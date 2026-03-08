/*
Copyright (c) 2026 Albert Kim
MapSound is licensed under the Business Source License 1.1 (BSL).
Use of this software for commercial purposes requires a commercial license.
Change Date: 2029-01-01
Change License: GPL-3.0-or-later
*/
import { Handle, Position } from '@xyflow/react';
import React from 'react';

type NodeData = {
  title: string;
  description: string;
  type: string;
};

export default function CustomNode({ data, selected }: { data: NodeData; selected?: boolean }) {
  // Determine gradient color based on node type
  const getTypeColor = () => {
    switch (data.type?.toLowerCase()) {
      case 'rhythm': return 'from-orange-500 to-red-500';
      case 'low-end': return 'from-blue-600 to-indigo-800';
      case 'atmosphere': return 'from-teal-400 to-emerald-600';
      case 'melody': return 'from-yellow-400 to-amber-600';
      case 'mood': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  return (
    <div
      className={`relative min-w-[220px] rounded-2xl p-4 bg-zinc-950/80 backdrop-blur-xl border-2 transition-all duration-300 shadow-xl cursor-pointer ${
        selected ? 'border-white/40 shadow-white/10 scale-[1.02]' : 'border-white/10 hover:border-white/30 hover:shadow-white/5 hover:scale-[1.02]'
      }`}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-zinc-300 border-2 border-zinc-950" 
      />
      
      {/* Node Type Indicator */}
      <div className="absolute -top-3 left-4 px-3 py-1 bg-black rounded-full border border-white/10 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getTypeColor()}`} />
        <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
          {data.type}
        </span>
      </div>

      <div className="mt-3">
        <h3 className="text-lg font-semibold text-white mb-1 leading-tight tracking-tight">
          {data.title}
        </h3>
        <p className="text-sm text-zinc-400 leading-snug">
          {data.description}
        </p>
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-zinc-300 border-2 border-zinc-950" 
      />
    </div>
  );
}
