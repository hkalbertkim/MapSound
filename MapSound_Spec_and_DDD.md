# MapSound.me: Official PRD & DDD Specification

**Version:** 1.0.0
**Author:** MapSound UX/UI Council (Silicon Valley Standard)
**Purpose:** Single Source of Truth for all human and AI developers (Cursor, Antigravity, Copilot). All architectural and UI/UX decisions MUST align with this document.

---

## 1. The Vision & Core Philosophy
MapSound.me is a paradigm-shifting community platform for music enthusiasts. It is not just a listening tool, but a creative canvas. By visually decomposing a "Seed Track" into a spatial node-based interface, users can understand the DNA of their favorite music and generate AI-powered "Tributes" based on their unique structural analysis.

## 2. Ubiquitous Language (Glossary)
All code (variables, components, files) and UI copy MUST strictly use these terms to maintain Domain-Driven Design consistency.

* **Seed Track:** The original song searched and selected by the user for analysis.
* **Sonic Scape:** The overarching auditory atmosphere or landscape produced by the collected nodes.
* **Sonic Blueprint:** The visual, interactive node-based map (formerly 'Canvas' or 'Map'). It represents the musical DNA of the Seed Track.
* **Sonic Node (or Stem):** The individual building blocks of the Blueprint (e.g., Rhythm, Melody, Low-End, Atmosphere, Mood).
* **Aura Flow:** The edges/lines connecting the Sonic Nodes. They must visually represent the flow of musical energy or data.
* **Tribute:** The final AI-generated audio track created as an homage to the Seed Track based on the user's Blueprint.
* **Decompose:** The system action of breaking down a Seed Track into its initial Sonic Nodes.
* **Tweak:** The user action of editing a Sonic Node's properties (BPM, instrument, sentiment) before generation.
* **Weave:** The user action of connecting nodes using Aura Flows.

---

## 3. UX/UI Design Grammar (Apple HIG Inspired)
We utilize a "Data Flow" visual metaphor, commonly found in pro-level creative tools (node-based UI), but refined for consumer elegance.

* **The Spatial Canvas:** The background must be an infinite, deep dark void (`bg-black` or deep `slate`), emphasizing the content. Subtle dot patterns or grids are permitted to indicate space.
* **Glassmorphism & Depth:** Sonic Nodes should appear as frosted glass (backdrop-blur) floating above the canvas. Use subtle drop-shadows and semantic glow effects based on the node's category.
* **Glowing Data Streams (Aura Flow):** Edges connecting nodes must not be static lines. They should have a glowing, animated effect (e.g., SVG `stroke-dasharray` animation) simulating data flowing toward the final output.
* **Tactile Micro-interactions:** Buttons and nodes should have smooth, satisfying hover states (scaling up by 2%, border glowing) to mimic physical resistance and magnetic snapping.

---

## 4. User Journey & Progressive Disclosure
The application experience is split into two distinct phases to prevent cognitive overload.

### Phase 1: MVP (Discovery & Inspiration)
1.  **Search:** User enters an artist or song name (e.g., "Coldplay - Yellow").
2.  **Decompose:** The system auto-generates the `Sonic Blueprint` with pre-filled `Sonic Nodes` and `Aura Flows`.
3.  **View & Generate:** User visually appreciates the breakdown and clicks `[Generate Tribute]`. No complex editing required.

### Phase 2: Pro (Intervention & Creation)
1.  **Tweak:** User double-clicks a `Sonic Node` to open a sleek modal and change its DNA (e.g., change Rhythm from 'Acoustic Drums' to '808 Trap Beats').
2.  **Weave & Add:** User clicks the floating `[Add Node]` button to introduce a new element, or re-routes the `Aura Flow`.
3.  **Generate:** The resulting `Tribute` reflects the user's custom, tweaked Blueprint.

---

## 5. Domain Models (For AI Agents)
* **`BlueprintContext`**: State manager handling `nodes` (Sonic Nodes) and `edges` (Aura Flows).
* **`NodeData` Interface**: Must include `id`, `typeLabel` (Rhythm, Melody, etc.), `title`, and `description`.
* **`GenerationEngine`**: The API route (`/api/generate`) that ingests the `BlueprintContext` and outputs the `Tribute` audio URL.

---

## 6. Technical Architecture & Engineering Spec

This section defines the strict technical boundaries for all AI agents and developers working on the MapSound repository.

### 6.1. Directory Structure & Rendering Strategy (Next.js App Router)
MapSound utilizes Next.js App Router (`app/` directory). Strict separation of Server and Client components must be maintained.

* `app/page.tsx`: The main landing page. (Server Component where possible, wrapping Client components).
* `app/api/generate/route.ts`: The core backend engine for Tribute generation. (Strictly Server-side).
* `components/canvas/SonicBlueprint.tsx`: The main interactive React Flow canvas. (Strictly `"use client"`).
* `components/nodes/SonicNode.tsx`: The individual custom nodes. (Strictly `"use client"`).
* `components/ui/*`: Reusable Tailwind/glassmorphism UI components (buttons, modals).

### 6.2. Data Schema (TypeScript Interfaces)
All data passed between components and APIs MUST strictly adhere to these interfaces.

```typescript
// The DNA of a single musical element
interface SonicNodeData {
  id: string; // Unique UUID
  type: 'Rhythm' | 'Melody' | 'LowEnd' | 'Atmosphere' | 'Mood' | 'Custom';
  title: string; // e.g., "Train Beat"
  description: string; // e.g., "90 BPM, Snare Brushes"
  position: { x: number; y: number }; // Canvas coordinates
}

// The connection between nodes
interface AuraFlowEdge {
  id: string;
  source: string; // Source Node ID
  target: string; // Target Node ID
  animated: boolean; // Must be true for the glowing effect
}

// The entire payload sent to the Generation API
interface BlueprintPayload {
  seedTrack: string; // e.g., "Last Train Home"
  nodes: SonicNodeData[];
  edges: AuraFlowEdge[];
}
```

### 6.3. API Contract (`/api/generate`)
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Body:** `BlueprintPayload` JSON object.
* **Response (Success):** ```json
{
  "status": "success",
  "tributeAudioUrl": "https://...",
  "promptUsed": "Detailed text prompt generated from nodes..."
}
```
* **Response (Error):**
```json
{
  "status": "error",
  "message": "Failed to weave the Tribute. Please try again."
}
```

### 6.4. State Management (Phase 1)
* **Local Persistence:** The `SonicBlueprint` state (nodes and edges) must be saved to the browser's `localStorage` on every change. 
* **Hydration:** Upon initial load, the canvas must read from `localStorage`. If empty, it loads the default "Last Train Home" blueprint.