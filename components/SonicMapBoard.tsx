"use client";

import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  Connection,
  Edge,
  Node
} from '@xyflow/react';
import CustomNode from './CustomNode';

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 50 },
    data: { 
      title: 'Rhythm', 
      description: 'Train Beat, 90 BPM, Snare Brushes', 
      type: 'Rhythm' 
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 100, y: 200 },
    data: { 
      title: 'Low-End', 
      description: 'Fretless Bass, Fluid & Melodic', 
      type: 'Low-End' 
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 400, y: 200 },
    data: { 
      title: 'Melody', 
      description: 'Synth Guitar (GR-300 style), Brassy & Expressive', 
      type: 'Melody' 
    },
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 250, y: 350 },
    data: { 
      title: 'Atmosphere', 
      description: 'Cinematic, Lush Synth Pads, Wide Acoustic Strums', 
      type: 'Atmosphere' 
    },
  },
  {
    id: '5',
    type: 'custom',
    position: { x: 250, y: 500 },
    data: { 
      title: 'Mood', 
      description: 'Wistful Nostalgia, Forward Motion', 
      type: 'Mood' 
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#a855f7', strokeWidth: 2 } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#ec4899', strokeWidth: 2 } },
];

export default function SonicMapBoard() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioResult, setAudioResult] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true } as Edge, eds)),
    [setEdges]
  );
  
  const handleGenerateMusic = useCallback(async () => {
    setIsGenerating(true);
    setAudioResult(null); // Reset previous result
    
    // Extract node text values
    const nodeData = nodes.map(node => ({
      id: node.id,
      typeLabel: node.data.type,
      title: node.data.title,
      description: node.data.description,
    }));
    
    console.log("📤 Sending MapSound Tribute Data to backend...");
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes: nodeData }),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Generation complete.");
        console.log("🎵 Audio URL:", data.audioUrl);
        console.log("📝 Prompt Used:", data.prompt);
        setAudioResult(data.audioUrl);
      } else {
        console.error("❌ Generation failed:", data.error);
      }
    } catch (error) {
      console.error("❌ Network error generating tribute:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [nodes]);

  return (
    <div className="w-full h-full min-h-[600px] border border-white/10 rounded-[1.4rem] bg-black/40 backdrop-blur-md relative overflow-hidden shadow-2xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-transparent"
      >
        <Background color="#ffffff" gap={24} size={1} />
        <Controls 
          className="bg-zinc-900 border-zinc-800 fill-white" 
          showInteractive={false} 
        />
      </ReactFlow>
      
      {/* Generate / Player Container */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 w-full max-w-md px-4">
        
        {/* Generate Tribute Action */}
        <button
          onClick={handleGenerateMusic}
          disabled={isGenerating}
          className={`
            relative group overflow-hidden rounded-full font-bold
            px-8 py-4 transition-all duration-300 w-fit
            ${isGenerating ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed border outline-none border-zinc-700' : 'bg-white text-black hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.6)]'}
          `}
        >
          {/* Gradient Hover Effect */}
          {!isGenerating && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          )}
          
          <div className="relative flex items-center justify-center gap-3">
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating MapSound...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Generate Tribute</span>
              </>
            )}
          </div>
        </button>

        {/* Custom Auth Player */}
        {audioResult && (
          <div className="w-full bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-400 tracking-wide uppercase">Tribute Ready</span>
            </div>
            <audio 
              controls 
              autoPlay 
              src={audioResult}
              className="w-full h-10 [&::-webkit-media-controls-panel]:bg-white/10 [&::-webkit-media-controls-panel]:backdrop-blur-sm [&::-webkit-media-controls-current-time-display]:text-white [&::-webkit-media-controls-time-remaining-display]:text-white"
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>

      {/* Glow effect overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
    </div>
  );
}
