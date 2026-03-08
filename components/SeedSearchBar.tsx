/*
Copyright (c) 2026 Albert Kim
MapSound is licensed under the Business Source License 1.1 (BSL).
Use of this software for commercial purposes requires a commercial license.
Change Date: 2029-01-01
Change License: GPL-3.0-or-later
*/
"use client";

import { useState } from "react";
import { Node, Edge } from "@xyflow/react";
import { mapSpotifyToSonicNodes } from "@/utils/spotifyMapper";

interface SeedSearchBarProps {
  onSearchComplete: (nodes: Node[], edges: Edge[]) => void;
}

export default function SeedSearchBar({ onSearchComplete }: SeedSearchBarProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);

    // Real API Call to Spotify Analytics Endpoint
    try {
      const response = await fetch(`/api/spotify/analyze?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch Spotify DNA");
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Unknown Error");
      }

      // Pass real authenticated data through mapper
      const { nodes, edges } = mapSpotifyToSonicNodes(data.track, data.features);
      
      // Clear search and success callback
      setQuery("");
      setIsSearching(false);
      onSearchComplete(nodes, edges);

    } catch (error) {
      console.error(error);
      setIsSearching(false);
      // Optional: Add a user-facing toast or error state here in the future
    }
  };

  return (
    <div className="absolute top-6 left-6 z-20 w-full max-w-sm sm:max-w-md">
      <form 
        onSubmit={handleSearch} 
        className="flex items-center gap-3 w-full relative"
      >
        <div className="relative flex-1 group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Seed Track (e.g. Coldplay - Yellow)"
            disabled={isSearching}
          className="w-full bg-black/40 backdrop-blur-xl border border-white/20 rounded-full py-3 px-5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-zinc-500 shadow-xl"
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
      </div>

      <button
        type="submit"
        disabled={isSearching || !query.trim()}
        className={`shrink-0 rounded-full p-3 transition-all duration-300 ${
          isSearching || !query.trim()
            ? "bg-white/5 text-zinc-500 cursor-not-allowed border border-white/5"
            : "bg-white text-black hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        }`}
        aria-label="Search Spotify"
      >
        {isSearching ? (
          <svg className="animate-spin h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </button>

      {/* Ephemeral parsing state text */}
      {isSearching && (
        <span className="absolute -bottom-6 left-5 text-xs font-semibold text-purple-400 animate-pulse tracking-wide uppercase">
          Decomposing...
        </span>
      )}
      </form>
    </div>
  );
}
