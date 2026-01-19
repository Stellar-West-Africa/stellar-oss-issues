# Stellar OSS Issues

A web application that aggregates open source issues from repositories in the Stellar ecosystem, making it easy for developers to find contribution opportunities.

## Features

- Automatic discovery of Stellar-related repositories via GitHub API
- Filtering by programming language, skill level, and category
- Search functionality across issue titles, descriptions, and repository names
- Categorization and skill level detection from issue labels

## Prerequisites

- Node.js 18 or higher
- npm
- GitHub Personal Access Token

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stellar-oss-projects
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the project root:
```bash
GITHUB_TOKEN=your_github_personal_access_token
```

To create a GitHub Personal Access Token:
- Go to GitHub Settings > Developer settings > Personal access tokens
- Generate a new token with `public_repo` read access
- Copy the token to your `.env` file

## Usage

### Development

Start the development server:
```bash
npm run dev
```

Access the application at `http://localhost:3000`

### Production

Build:
```bash
npm run build
npm start
```

## How It Works

### Data Collection

The application fetches issues through the `/api/sync` endpoint which:
1. Searches GitHub for repositories with `topic:stellar`, `topic:soroban`, or under the `stellar` organization
2. Retrieves open issues from the top 50 most active repositories
3. Analyzes each repository to detect the technology stack (Rust, JavaScript, Go, etc.)
4. Categorizes issues based on labels (Bug, Feature, Documentation, etc.)
5. Assigns skill levels (Beginner, Intermediate, Advanced) based on label patterns
6. Caches results to `public/issues-cache.json`

### Filtering

Users can filter issues by:
- **Technology Stack**: JavaScript, TypeScript, Rust, Go, Python, etc.
- **Skill Level**: Beginner, Intermediate, Advanced
- **Category**: Bug, Feature, Documentation, Testing, UI/UX, Backend, DevOps
- **Good First Issues**: Toggle to show beginner-friendly issues only
- **Search**: Full-text search across titles, descriptions, and repository names

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── issues/route.ts    # Serves cached issues
│   │   └── sync/route.ts      # Fetches and caches data
│   ├── globals.css            # Global styles and animations
│   ├── layout.tsx             # Root layout with metadata
│   └── page.tsx               # Main UI component
├── lib/
│   └── github.ts              # GitHub API client
└── types/
    └── index.ts               # TypeScript interfaces
```

## Technology Stack

- Next.js 16
- TypeScript
- Tailwind CSS 4
- Octokit


## Contributing

Contributions are welcome. Please open an issue or submit a pull request.


## Cheers!