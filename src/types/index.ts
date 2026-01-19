export interface StellarRepo {
    owner: string;
    name: string;
    fullName: string;
    description: string;
    url: string;
    stars: number;
    language: string | null;
    topics: string[];
    lastUpdated: string;
}

export interface GitHubIssue {
    id: number;
    title: string;
    url: string;
    number: number;
    state: string;
    createdAt: string;
    updatedAt: string;
    labels: string[];
    repoOwner: string;
    repoName: string;
    repoFullName: string;
    body: string;
    commentsCount: number;
}

export interface ProcessedIssue extends GitHubIssue {
    stack: string[];
    isGoodFirstIssue: boolean;
    skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'unknown';
    category: string[];
}

export interface IssueFilters {
    stack?: string[];
    skillLevel?: string;
    category?: string;
    goodFirstIssue?: boolean;
}
