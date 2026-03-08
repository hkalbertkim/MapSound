/*
Copyright (c) 2026 Albert Kim
MapSound is licensed under the Business Source License 1.1 (BSL).
Use of this software for commercial purposes requires a commercial license.
Change Date: 2029-01-01
Change License: GPL-3.0-or-later
*/
import { NextResponse } from 'next/server';

interface NodeData {
  id: string;
  typeLabel: string;
  title: string;
  description: string;
}

// Helper to construct a detailed music generation prompt
function constructPrompt(nodes: NodeData[]): string {
  if (!nodes || nodes.length === 0) {
    return "Generate an experimental soundscape.";
  }

  const promptParts = nodes.map(node => {
    return `${node.typeLabel} element ('${node.title}'): ${node.description}`;
  });

  return `Create a cohesive musical piece weaving the following elements together:\n\n${promptParts.join('\n')}\n\nThe track should dynamically evolve, honoring the descriptions provided for each element while maintaining a unified cinematic atmosphere.`;
}

export async function POST(request: Request) {
  try {
    const { nodes } = await request.json();

    const generatedPrompt = constructPrompt(nodes);
    
    // Log the constructed prompt to server console
    console.log("🎵 Backend Processing Request...");
    console.log("📝 Constructed AI Prompt:\n", generatedPrompt);

    // Simulate a 3-second audio generation delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock successful response
    return NextResponse.json({
      success: true,
      prompt: generatedPrompt,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      message: "Tribute generated successfully."
    });

  } catch (error) {
    console.error("Error generating tribute:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate tribute." },
      { status: 500 }
    );
  }
}
