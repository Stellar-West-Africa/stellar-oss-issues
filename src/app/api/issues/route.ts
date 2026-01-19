import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import type { ProcessedIssue } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const cachePath = join(process.cwd(), 'public', 'issues-cache.json');
        const fileContent = await readFile(cachePath, 'utf-8');
        const data = JSON.parse(fileContent);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error reading cache:', error);

        // If cache doesn't exist, return empty array
        return NextResponse.json({
            issues: [] as ProcessedIssue[],
            lastUpdated: null,
        });
    }
}
