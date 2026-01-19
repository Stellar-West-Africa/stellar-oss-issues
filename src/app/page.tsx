'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import type { ProcessedIssue } from '@/types';

export default function Home() {
  const [issues, setIssues] = useState<ProcessedIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  // Filter states
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showGoodFirstIssueOnly, setShowGoodFirstIssueOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch issues on mount
  useEffect(() => {
    fetchIssues();
  }, []);

  async function fetchIssues() {
    try {
      setLoading(true);
      const response = await fetch('/api/issues');
      const data = await response.json();
      setIssues(data.issues || []);
      setLastUpdated(data.lastUpdated);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  }

  async function syncIssues() {
    try {
      setSyncing(true);
      const response = await fetch('/api/sync');
      const data = await response.json();

      if (data.success) {
        await fetchIssues();
      }
    } catch (error) {
      console.error('Error syncing issues:', error);
    } finally {
      setSyncing(false);
    }
  }

  // Get unique values for filters
  const availableStacks = useMemo(() => {
    const stacks = new Set<string>();
    issues.forEach(issue => issue.stack.forEach(s => stacks.add(s)));
    return Array.from(stacks).sort();
  }, [issues]);

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    issues.forEach(issue => issue.category.forEach(c => categories.add(c)));
    return Array.from(categories).sort();
  }, [issues]);

  // Filter issues
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      // Stack filter
      if (selectedStacks.length > 0) {
        if (!selectedStacks.some(stack => issue.stack.includes(stack))) {
          return false;
        }
      }

      // Skill level filter
      if (selectedSkillLevel !== 'all' && issue.skillLevel !== selectedSkillLevel) {
        return false;
      }

      // Category filter
      if (selectedCategories.length > 0) {
        if (!selectedCategories.some(cat => issue.category.includes(cat))) {
          return false;
        }
      }

      // Good first issue filter
      if (showGoodFirstIssueOnly && !issue.isGoodFirstIssue) {
        return false;
      }

      // Search query (search in title, body, and repo name)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          issue.title.toLowerCase().includes(query) ||
          issue.body.toLowerCase().includes(query) ||
          issue.repoFullName.toLowerCase().includes(query) ||
          issue.repoOwner.toLowerCase().includes(query) ||
          issue.repoName.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [issues, selectedStacks, selectedSkillLevel, selectedCategories, showGoodFirstIssueOnly, searchQuery]);

  const toggleStack = (stack: string) => {
    setSelectedStacks(prev =>
      prev.includes(stack)
        ? prev.filter(s => s !== stack)
        : [...prev, stack]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated Stellar Assets Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Asset 1 instances - 8 total */}
        <Image src="/stellar-asset-1.webp" alt="" width={200} height={200} className="absolute top-20 right-10 opacity-10 animate-float" />
        <Image src="/stellar-asset-1.webp" alt="" width={150} height={150} className="absolute top-1/3 left-20 opacity-8 animate-float-delayed" />
        <Image src="/stellar-asset-1.webp" alt="" width={100} height={100} className="absolute bottom-40 right-1/3 opacity-6 animate-pulse-slow" />
        <Image src="/stellar-asset-1.webp" alt="" width={130} height={130} className="absolute top-1/4 right-1/2 opacity-7 animate-float" />
        <Image src="/stellar-asset-1.webp" alt="" width={110} height={110} className="absolute bottom-1/3 left-1/4 opacity-5 animate-float-delayed" />
        <Image src="/stellar-asset-1.webp" alt="" width={90} height={90} className="absolute top-2/3 right-1/4 opacity-6 animate-pulse-slow" />
        <Image src="/stellar-asset-1.webp" alt="" width={170} height={170} className="absolute bottom-1/2 left-1/2 opacity-7 animate-float" />
        <Image src="/stellar-asset-1.webp" alt="" width={120} height={120} className="absolute top-1/5 left-10 opacity-5 animate-float-delayed" />

        {/* Asset 2 instances - 7 total */}
        <Image src="/stellar-asset-2.webp" alt="" width={150} height={150} className="absolute bottom-32 left-10 opacity-10 animate-float-delayed" />
        <Image src="/stellar-asset-2.webp" alt="" width={120} height={120} className="absolute top-40 right-1/4 opacity-8 animate-float" />
        <Image src="/stellar-asset-2.webp" alt="" width={140} height={140} className="absolute top-1/2 left-1/3 opacity-7 animate-pulse-slow" />
        <Image src="/stellar-asset-2.webp" alt="" width={100} height={100} className="absolute bottom-1/4 right-1/2 opacity-6 animate-float-delayed" />
        <Image src="/stellar-asset-2.webp" alt="" width={160} height={160} className="absolute top-1/5 left-1/2 opacity-5 animate-float" />
        <Image src="/stellar-asset-2.webp" alt="" width={110} height={110} className="absolute bottom-10 right-10 opacity-8 animate-pulse-slow" />
        <Image src="/stellar-asset-2.webp" alt="" width={130} height={130} className="absolute top-3/4 left-1/4 opacity-6 animate-float-delayed" />

        {/* Main asset instances - 8 total */}
        <Image src="/stellar-asset.webp" alt="" width={180} height={180} className="absolute top-1/2 right-1/4 opacity-5 animate-pulse-slow" />
        <Image src="/stellar-asset.webp" alt="" width={140} height={140} className="absolute bottom-1/4 left-1/3 opacity-7 animate-float-delayed" />
        <Image src="/stellar-asset.webp" alt="" width={160} height={160} className="absolute top-1/3 right-1/3 opacity-6 animate-float" />
        <Image src="/stellar-asset.webp" alt="" width={120} height={120} className="absolute bottom-1/2 left-1/4 opacity-5 animate-pulse-slow" />
        <Image src="/stellar-asset.webp" alt="" width={100} height={100} className="absolute top-3/4 right-1/2 opacity-8 animate-float-delayed" />
        <Image src="/stellar-asset.webp" alt="" width={130} height={130} className="absolute top-1/6 left-10 opacity-6 animate-float" />
        <Image src="/stellar-asset.webp" alt="" width={150} height={150} className="absolute bottom-1/3 right-20 opacity-7 animate-pulse-slow" />
        <Image src="/stellar-asset.webp" alt="" width={110} height={110} className="absolute top-1/4 left-1/2 opacity-5 animate-float-delayed" />

        {/* Asset 3 instances - 9 total */}
        <Image src="/stellar-asset-3.png" alt="" width={120} height={120} className="absolute bottom-20 right-20 opacity-10 animate-float" />
        <Image src="/stellar-asset-3.png" alt="" width={90} height={90} className="absolute top-1/4 left-1/4 opacity-8 animate-float-delayed" />
        <Image src="/stellar-asset-3.png" alt="" width={110} height={110} className="absolute top-2/3 right-10 opacity-6 animate-pulse-slow" />
        <Image src="/stellar-asset-3.png" alt="" width={100} height={100} className="absolute bottom-1/3 left-1/2 opacity-7 animate-float" />
        <Image src="/stellar-asset-3.png" alt="" width={80} height={80} className="absolute top-1/2 left-10 opacity-5 animate-float-delayed" />
        <Image src="/stellar-asset-3.png" alt="" width={95} height={95} className="absolute bottom-1/4 right-1/3 opacity-8 animate-pulse-slow" />
        <Image src="/stellar-asset-3.png" alt="" width={105} height={105} className="absolute top-1/5 right-1/5 opacity-6 animate-float" />
        <Image src="/stellar-asset-3.png" alt="" width={115} height={115} className="absolute bottom-40 left-20 opacity-7 animate-float-delayed" />
        <Image src="/stellar-asset-3.png" alt="" width={85} height={85} className="absolute top-10 right-1/2 opacity-5 animate-pulse-slow" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <Image
              src="/stellar-ambassador-seal-yellow.webp"
              alt="Stellar Logo"
              width={80}
              height={80}
              className="transition-transform hover:scale-110"
            />
          </div>

          <div className="text-center">
            <h1 className="text-7xl font-bold text-yellow-400 mb-6">
              Stellar OSS Issues
            </h1>
            <p className="text-slate-300 text-2xl mb-8">
              Find your next open source contribution in the Stellar ecosystem
            </p>

            <div className="flex justify-center">
              <button
                onClick={syncIssues}
                disabled={syncing}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-600 text-black font-semibold rounded-lg transition-all shadow-lg hover:shadow-yellow-500/50"
                title="Refresh Issues"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={syncing ? 'animate-spin' : ''}>
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="text-center text-slate-300 text-xl">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-4"></div>
            <p>Loading issues...</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-white mb-6">Filters</h2>

                {/* Search */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Search
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search issues or repos..."
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                {/* Good First Issue Toggle */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showGoodFirstIssueOnly}
                      onChange={(e) => setShowGoodFirstIssueOnly(e.target.checked)}
                      className="w-4 h-4 accent-yellow-500"
                    />
                    <span className="text-sm font-medium text-slate-300">
                      Good First Issues Only
                    </span>
                  </label>
                </div>

                {/* Skill Level */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Skill Level
                  </label>
                  <select
                    value={selectedSkillLevel}
                    onChange={(e) => setSelectedSkillLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-yellow-500 focus:outline-none"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                {/* Stack Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableStacks.map(stack => (
                      <button
                        key={stack}
                        onClick={() => toggleStack(stack)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedStacks.includes(stack)
                          ? 'bg-yellow-500 text-black font-semibold'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                      >
                        {stack}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-3">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map(category => (
                      <button
                        key={category}
                        onClick={() => toggleCategory(category)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedCategories.includes(category)
                          ? 'bg-yellow-500 text-black font-semibold'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedStacks.length > 0 || selectedCategories.length > 0 || selectedSkillLevel !== 'all' || showGoodFirstIssueOnly || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedStacks([]);
                      setSelectedCategories([]);
                      setSelectedSkillLevel('all');
                      setShowGoodFirstIssueOnly(false);
                      setSearchQuery('');
                    }}
                    className="w-full mt-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}

                {/* Stats */}
                <div className="mt-6 pt-6 border-t border-slate-700 space-y-2">
                  <div className="text-xs text-slate-400">
                    <span className="font-semibold text-yellow-400">{filteredIssues.length}</span> of <span className="font-semibold">{issues.length}</span> issues
                  </div>
                  {lastUpdated && (
                    <div className="text-xs text-slate-500">
                      Updated: {new Date(lastUpdated).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Issues Grid */}
            <main className="flex-1">
              {filteredIssues.length === 0 ? (
                <div className="text-center text-slate-400 py-12">
                  <p className="text-lg">No issues found matching your filters.</p>
                  <p className="text-sm mt-2">Try adjusting your filters or syncing for new issues.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredIssues.map(issue => (
                    <a
                      key={issue.id}
                      href={issue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/70 rounded-xl p-6 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/20"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-lg font-semibold text-white flex-1">
                          {issue.title}
                        </h3>
                        {issue.isGoodFirstIssue && (
                          <span className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                            Good First Issue
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                        <span className="font-medium text-yellow-400">{issue.repoFullName}</span>
                        <span>•</span>
                        <span>#{issue.number}</span>
                        <span>•</span>
                        <span>{issue.commentsCount} comments</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {issue.stack.map(stack => (
                          <span
                            key={stack}
                            className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-md"
                          >
                            {stack}
                          </span>
                        ))}
                        {issue.category.map(cat => (
                          <span
                            key={cat}
                            className="px-2 py-1 bg-blue-600/30 text-blue-300 text-xs rounded-md"
                          >
                            {cat}
                          </span>
                        ))}
                        {issue.skillLevel !== 'unknown' && (
                          <span className="px-2 py-1 bg-blue-600/30 text-blue-300 text-xs rounded-md">
                            {issue.skillLevel}
                          </span>
                        )}
                      </div>

                      {issue.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {issue.labels.slice(0, 5).map(label => (
                            <span
                              key={label}
                              className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded"
                            >
                              {label}
                            </span>
                          ))}
                          {issue.labels.length > 5 && (
                            <span className="px-2 py-0.5 text-slate-400 text-xs">
                              +{issue.labels.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
