import { NextResponse } from 'next/server';
import { fetchAllStellarIssues } from '@/lib/github';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('Starting issue fetch...');
        const issues = await fetchAllStellarIssues();

        // Cache the results to a JSON file
        const cacheDir = join(process.cwd(), 'public');
        const cachePath = join(cacheDir, 'issues-cache.json');

        await writeFile(
            cachePath,
            JSON.stringify({
                issues,
                lastUpdated: new Date().toISOString(),
            }, null, 2)
        );

        console.log(`Cached ${issues.length} issues to ${cachePath}`);

        return NextResponse.json({
            success: true,
            count: issues.length,
            lastUpdated: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error in sync route:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
