/*
Copyright (c) 2026 Albert Kim
MapSound is licensed under the Business Source License 1.1 (BSL).
Use of this software for commercial purposes requires a commercial license.
Change Date: 2029-01-01
Change License: GPL-3.0-or-later
*/
import { NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

/**
 * Deterministic pseudo-random generator based on a seed string.
 * Returns a value between 0.0 and 1.0.
 */
function getDeterministicValue(seedString: string, salt: string): number {
  let hash = 0;
  const str = seedString + salt;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) / 2147483648;
}

/**
 * Helper to get a Server-to-Server Bearer token via Client Credentials Flow
 */
async function getSpotifyToken(): Promise<string> {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error("Missing Spotify environment variables. Please check your .env.local file.");
  }

  const basicAuth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Spotify Auth Error Details:", response.status, errorBody);
    throw new Error(`Spotify Auth Error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: "Missing search query 'q'" }, { status: 400 });
    }

    // 1. Authenticate with Spotify
    const token = await getSpotifyToken();

    // 2. Search for the track
    const searchRes = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!searchRes.ok) {
      const searchErr = await searchRes.text();
      console.error("Spotify Search API failed:", searchRes.status, searchErr);
      return NextResponse.json({ error: `Spotify Search API failed: ${searchErr}` }, { status: searchRes.status });
    }
    const searchData = await searchRes.json();

    if (!searchData.tracks || !searchData.tracks.items.length) {
      return NextResponse.json({ error: `No tracks found for query: ${query}` }, { status: 404 });
    }

    const trackInfo = searchData.tracks.items[0];
    const trackId = trackInfo.id;

    // 3. Fallback to Deterministic DNA Simulation (Spotify restricted /v1/audio-features)
    // 4. Construct response identical to what our mapper expects
    const mappedTrack = {
      id: trackInfo.id,
      name: trackInfo.name,
      artist: trackInfo.artists[0]?.name || "Unknown Artist",
      albumCoverUrl: trackInfo.album?.images?.[0]?.url || "",
    };

    const mappedFeatures = {
      tempo: 70 + (getDeterministicValue(trackId, 'tempo') * 110), // 70 to 180
      valence: getDeterministicValue(trackId, 'valence'),           // 0.0 to 1.0
      energy: getDeterministicValue(trackId, 'energy'),             // 0.0 to 1.0
      acousticness: getDeterministicValue(trackId, 'acousticness'), // 0.0 to 1.0
    };

    return NextResponse.json({
      success: true,
      track: mappedTrack,
      features: mappedFeatures
    });

  } catch (err: unknown) {
    console.error("API Error in /api/spotify/analyze:", err);
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
