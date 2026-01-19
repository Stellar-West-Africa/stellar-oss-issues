import { Octokit } from 'octokit';
import type { StellarRepo, GitHubIssue, ProcessedIssue } from '@/types';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

/**
 * Detect the tech stack of a repository based on its language and package files
 */
export async function detectStack(owner: string, repo: string): Promise<string[]> {
    const stacks: string[] = [];

    try {
        // Check repository language
        const { data: repoData } = await octokit.rest.repos.get({
            owner,
            repo,
        });

        if (repoData.language) {
            stacks.push(repoData.language);
        }

        // Check for specific files to determine stack
        const filesToCheck = [
            { file: 'Cargo.toml', stack: 'Rust' },
            { file: 'package.json', stack: 'JavaScript' },
            { file: 'package.json', stack: 'TypeScript' },
            { file: 'go.mod', stack: 'Go' },
            { file: 'requirements.txt', stack: 'Python' },
            { file: 'Gemfile', stack: 'Ruby' },
        ];

        for (const { file, stack } of filesToCheck) {
            try {
                await octokit.rest.repos.getContent({
                    owner,
                    repo,
                    path: file,
                });
                if (!stacks.includes(stack)) {
                    stacks.push(stack);
                }
            } catch {
                // File doesn't exist, continue
            }
        }
    } catch (error) {
        console.error(`Error detecting stack for ${owner}/${repo}:`, error);
    }

    return stacks;
}

/**
 * Search for Stellar-related repositories
 */
export async function searchStellarRepos(): Promise<StellarRepo[]> {
    const repos: StellarRepo[] = [];
    const queries = [
        'topic:stellar',
        'topic:soroban',
        'org:stellar',
    ];

    for (const query of queries) {
        try {
            const { data } = await octokit.rest.search.repos({
                q: query,
                sort: 'updated',
                order: 'desc',
                per_page: 100,
            });

            for (const repo of data.items) {
                // Skip if owner is null
                if (!repo.owner) {
                    continue;
                }

                // Avoid duplicates
                if (repos.some(r => r.fullName === repo.full_name)) {
                    continue;
                }

                repos.push({
                    owner: repo.owner.login,
                    name: repo.name,
                    fullName: repo.full_name,
                    description: repo.description || '',
                    url: repo.html_url,
                    stars: repo.stargazers_count,
                    language: repo.language,
                    topics: repo.topics || [],
                    lastUpdated: repo.updated_at,
                });
            }
        } catch (error) {
            console.error(`Error searching repos with query "${query}":`, error);
        }
    }

    // Sort by stars descending
    return repos.sort((a, b) => b.stars - a.stars);
}

/**
 * Fetch issues from a repository
 */
export async function fetchRepoIssues(
    owner: string,
    repo: string
): Promise<GitHubIssue[]> {
    try {
        const { data } = await octokit.rest.issues.listForRepo({
            owner,
            repo,
            state: 'open',
            per_page: 100,
            sort: 'updated',
            direction: 'desc',
        });

        return data
            .filter(issue => !issue.pull_request) // Filter out pull requests
            .map(issue => ({
                id: issue.id,
                title: issue.title,
                url: issue.html_url,
                number: issue.number,
                state: issue.state,
                createdAt: issue.created_at,
                updatedAt: issue.updated_at,
                labels: issue.labels.map(label =>
                    typeof label === 'string' ? label : label.name || ''
                ),
                repoOwner: owner,
                repoName: repo,
                repoFullName: `${owner}/${repo}`,
                body: issue.body || '',
                commentsCount: issue.comments,
            }));
    } catch (error) {
        console.error(`Error fetching issues for ${owner}/${repo}:`, error);
        return [];
    }
}

/**
 * Determine skill level based on labels
 */
function determineSkillLevel(labels: string[]): 'beginner' | 'intermediate' | 'advanced' | 'unknown' {
    const lowerLabels = labels.map(l => l.toLowerCase());

    if (lowerLabels.some(l =>
        l.includes('good first issue') ||
        l.includes('beginner') ||
        l.includes('easy')
    )) {
        return 'beginner';
    }

    if (lowerLabels.some(l =>
        l.includes('intermediate') ||
        l.includes('medium')
    )) {
        return 'intermediate';
    }

    if (lowerLabels.some(l =>
        l.includes('advanced') ||
        l.includes('hard') ||
        l.includes('complex')
    )) {
        return 'advanced';
    }

    return 'unknown';
}

/**
 * Categorize issues based on labels
 */
function categorizeIssue(labels: string[]): string[] {
    const categories: string[] = [];
    const lowerLabels = labels.map(l => l.toLowerCase());

    const categoryMap: Record<string, string[]> = {
        'Bug': ['bug', 'bugfix', 'error'],
        'Feature': ['feature', 'enhancement', 'improvement'],
        'Documentation': ['documentation', 'docs'],
        'Testing': ['testing', 'test', 'qa'],
        'Performance': ['performance', 'optimization'],
        'Security': ['security', 'vulnerability'],
        'UI/UX': ['ui', 'ux', 'design', 'frontend'],
        'Backend': ['backend', 'api', 'server'],
        'DevOps': ['devops', 'ci/cd', 'infrastructure'],
    };

    for (const [category, keywords] of Object.entries(categoryMap)) {
        if (lowerLabels.some(label => keywords.some(keyword => label.includes(keyword)))) {
            categories.push(category);
        }
    }

    return categories.length > 0 ? categories : ['General'];
}

/**
 * Process raw issues to add metadata
 */
export async function processIssues(
    issues: GitHubIssue[],
    repoStacks: Map<string, string[]>
): Promise<ProcessedIssue[]> {
    return issues.map(issue => {
        const stack = repoStacks.get(issue.repoFullName) || [];
        const isGoodFirstIssue = issue.labels.some(label =>
            label.toLowerCase().includes('good first issue')
        );
        const skillLevel = determineSkillLevel(issue.labels);
        const category = categorizeIssue(issue.labels);

        return {
            ...issue,
            stack,
            isGoodFirstIssue,
            skillLevel,
            category,
        };
    });
}

/**
 * Main function to fetch and process all Stellar ecosystem issues
 */
export async function fetchAllStellarIssues(): Promise<ProcessedIssue[]> {
    console.log('Searching for Stellar repositories...');
    const repos = await searchStellarRepos();
    console.log(`Found ${repos.length} repositories`);

    // Fetch stack information for each repo
    const repoStacks = new Map<string, string[]>();
    for (const repo of repos.slice(0, 50)) { // Limit to top 50 repos to avoid rate limits
        const stack = await detectStack(repo.owner, repo.name);
        repoStacks.set(repo.fullName, stack);
    }

    // Fetch issues from all repos
    console.log('Fetching issues...');
    const allIssues: GitHubIssue[] = [];

    for (const repo of repos.slice(0, 50)) {
        const issues = await fetchRepoIssues(repo.owner, repo.name);
        allIssues.push(...issues);

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`Found ${allIssues.length} total issues`);

    // Process issues with metadata
    const processedIssues = await processIssues(allIssues, repoStacks);

    return processedIssues;
}
