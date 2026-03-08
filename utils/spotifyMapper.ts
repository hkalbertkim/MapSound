/*
Copyright (c) 2026 Albert Kim
MapSound is licensed under the Business Source License 1.1 (BSL).
Use of this software for commercial purposes requires a commercial license.
Change Date: 2029-01-01
Change License: GPL-3.0-or-later
*/
import { Node, Edge } from '@xyflow/react';

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  albumCoverUrl?: string;
}

export interface SpotifyAudioFeatures {
  tempo: number;
  valence: number;
  energy: number;
  acousticness: number;
}

export interface SpotifyMappedData {
  nodes: Node[];
  edges: Edge[];
}

export function mapSpotifyToSonicNodes(track: SpotifyTrack, features: SpotifyAudioFeatures): SpotifyMappedData {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const centerX = 400;
  const centerY = 300;
  const radius = 250;

  // 1. Seed Track Node (Center)
  const seedId = `seed-${track.id}`;
  nodes.push({
    id: seedId,
    type: 'custom',
    position: { x: centerX, y: centerY },
    data: {
      title: track.name,
      type: 'Seed Track',
      description: `By ${track.artist}`,
      imageUrl: track.albumCoverUrl
    }
  });

  // 2. Rhythm Node
  const rhythmId = `rhythm-${track.id}`;
  nodes.push({
    id: rhythmId,
    type: 'custom',
    position: { 
      x: centerX + radius * Math.cos(Math.PI * 1.5), 
      y: centerY + radius * Math.sin(Math.PI * 1.5) 
    }, // Top
    data: {
      title: 'Rhythm Signature',
      type: 'Rhythm',
      description: `${Math.round(features.tempo)} BPM`
    }
  });

  // 3. Mood Node
  const moodId = `mood-${track.id}`;
  let moodDesc = "Neutral/Balanced";
  if (features.valence > 0.7) moodDesc = "Highly Upbeat, Euphoric";
  else if (features.valence > 0.5) moodDesc = "Positive, Groovy";
  else if (features.valence < 0.3) moodDesc = "Dark, Melancholic";
  else if (features.valence < 0.5) moodDesc = "Somber, Wistful";

  nodes.push({
    id: moodId,
    type: 'custom',
    position: { 
      x: centerX + radius * Math.cos(Math.PI * 0.16), 
      y: centerY + radius * Math.sin(Math.PI * 0.16) 
    }, // Bottom Right
    data: {
      title: 'Emotional Core',
      type: 'Mood',
      description: moodDesc
    }
  });

  // 4. Atmosphere Node
  const atmosphereId = `atmosphere-${track.id}`;
  let atmosphereDesc = "";
  if (features.acousticness > 0.7) atmosphereDesc += "Organic, Intimate. ";
  else if (features.acousticness < 0.3) atmosphereDesc += "Electronic, Synthetic. ";
  
  if (features.energy > 0.7) atmosphereDesc += "High Energy, Driving.";
  else if (features.energy < 0.4) atmosphereDesc += "Lush, Ambient, Distant.";

  nodes.push({
    id: atmosphereId,
    type: 'custom',
    position: { 
      x: centerX + radius * Math.cos(Math.PI * 0.84), 
      y: centerY + radius * Math.sin(Math.PI * 0.84) 
    }, // Bottom Left
    data: {
      title: 'Sonic Scape',
      type: 'Atmosphere',
      description: atmosphereDesc.trim() || "Balanced Environment."
    }
  });

  // Generate Aura Flows
  const generateAuraFlow = (targetId: string, color: string): Edge => ({
    id: `edge-${seedId}-${targetId}`,
    source: seedId,
    target: targetId,
    animated: true,
    style: { stroke: color, strokeWidth: 2, strokeDasharray: '4 4' },
    className: 'animate-[dash_1s_linear_infinite]'
  });

  edges.push(generateAuraFlow(rhythmId, '#a855f7')); // Purple flow to Rhythm
  edges.push(generateAuraFlow(moodId, '#f59e0b'));   // Orange flow to Mood
  edges.push(generateAuraFlow(atmosphereId, '#3b82f6')); // Blue flow to Atmosphere

  return { nodes, edges };
}
