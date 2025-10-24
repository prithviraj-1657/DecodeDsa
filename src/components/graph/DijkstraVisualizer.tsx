import React, { useState, useRef, MouseEvent, ChangeEvent } from 'react';
import 'tailwindcss/tailwind.css';

// Basic types
type NodeId = string;
type Pos = { x: number; y: number };
type Edge   const addNodeAt = (x: number, y: number): void => {
    const id = uuid("n");
    setState((s) => ({
      ...s,
      graph: {
        nodes: { ...s.graph.nodes, [id]: { x, y } },
        edges: [...s.graph.edges],
      },
      log: [`Added node ${id}`, ...s.log]
    }));
  };: NodeId; to: NodeId; weight: number; id: string };
type Mode = "add-node" | "add-edge" | "select" | "run";

// Data structures
interface Graph {
  nodes: Record<NodeId, Pos>;
  edges: Edge[];
}

interface NodeState {
  distance: number;
  predecessor: NodeId | null;
}

interface NodeStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
}

interface DijkstraState {
  graph: Graph;
  mode: Mode;
  selectedNode: NodeId | null;
  edgeFrom: NodeId | null;
  edgeWeightInput: string;
  log: string[];
  steps: Step[];
  stepIndex: number;
  sourceNode: NodeId | null;
  hoveredNode: NodeId | null;
  nodeDistances: Record<NodeId, number>;
}

type Step =
  | { type: "visit"; node: NodeId; dist: number }
  | { type: "edgeRelax"; edgeId: string; from: NodeId; to: NodeId; oldDist: number | null; newDist: number | null }
  | { type: "finished"; target?: NodeId }
  | { type: "init" };

// Utility functions
const uuid = (p = ""): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}${p}`;

type NodeId = string;
type   const addNodeAt = (x: number, y: number): void => {
    const id = uuid("n");
    setGraph((g: Graph) => ({
      nodes: { ...g.nodes, [id]: { x, y } },
      edges: [...g.edges],
    }));
    setLog((l: string[]) => [`Added node ${id}`, ...l]);
  };x: number; y: number };
type Edge = { from: NodeId; to: NodeId; weight: number; id: string };
type Mode = "add-node" | "add-edge" | "select" | "run";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      ul: React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
      li: React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
      svg: React.SVGProps<SVGSVGElement>;
      g: React.SVGProps<SVGGElement>;
      path: React.SVGProps<SVGPathElement>;
      circle: React.SVGProps<SVGCircleElement>;
      text: React.SVGProps<SVGTextElement>;
      defs: React.SVGProps<SVGDefsElement>;
      marker: React.SVGProps<SVGMarkerElement>;
    }
  }
}

interface GraphState {
  nodes: Record<NodeId, Pos>;
  edges: Edge[];
}

interface NodeStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  textColor: string;
}

interface Graph {
  nodes: Record<NodeId, Pos>;
  edges: Edge[];
}

type Step =
  | { type: "visit"; node: NodeId; dist: number }
  | { type: "edgeRelax"; edgeId: string; from: NodeId; to: NodeId; oldDist: number | null; newDist: number | null }
  | { type: "finished"; target?: NodeId }
  | { type: "init" };

const uuid = (p = "") =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}${p}`;

// -------------------- Algorithm logic --------------------
function dijkstraSteps(graph: Graph, source: NodeId): { steps: Step[]; dist: Record<NodeId, number>; prev: Record<NodeId, NodeId | null> } {
  const nodes = Object.keys(graph.nodes);
  const dist: Record<NodeId, number> = {};
  const prev: Record<NodeId, NodeId | null> = {};
  const q = new Set<NodeId>(nodes);  // Initialize with nodes directly

  nodes.forEach((n) => {
    dist[n] = Infinity;
    prev[n] = null;
    q.add(n);
  });

  const steps: Step[] = [{ type: "init" }];
  dist[source] = 0;
  steps.push({ type: "visit", node: source, dist: 0 });

  const extractMin = (): NodeId | null => {
    let minNode: NodeId | null = null;
    let minVal = Infinity;
    Array.from(q).forEach((n) => {
      if (dist[n] < minVal) {
        minVal = dist[n];
        minNode = n;
      }
    });
    if (minNode !== null) q.delete(minNode);
    return minNode;
  };

  while (q.size > 0) {
    const u = extractMin();
    if (!u) break;
    steps.push({ type: "visit", node: u, dist: dist[u] });

    const outgoing = graph.edges.filter((e) => e.from === u);
    for (const e of outgoing) {
      const v = e.to;
      const alt = dist[u] + e.weight;
      const old = Number.isFinite(dist[v]) ? dist[v] : null;
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
        steps.push({
          type: "edgeRelax",
          edgeId: e.id,
          from: u,
          to: v,
          oldDist: old,
          newDist: alt,
        });
      } else {
        steps.push({
          type: "edgeRelax",
          edgeId: e.id,
          from: u,
          to: v,
          oldDist: old,
          newDist: alt === Infinity ? null : alt,
        });
      }
    }
  }

  steps.push({ type: "finished" });
  return { steps, dist, prev };
}

// -------------------- UI Component --------------------
interface DijkstraState {
  graph: Graph;
  mode: Mode;
  selectedNode: NodeId | null;
  edgeFrom: NodeId | null;
  edgeWeightInput: string;
  log: string[];
  steps: Step[];
  stepIndex: number;
  sourceNode: NodeId | null;
  hoveredNode: NodeId | null;
  nodeDistances: Record<NodeId, number>;
}

const DijkstraVisualizer: React.FC = () => {
  const [state, setState] = useState<DijkstraState>({
    graph: { nodes: {}, edges: [] },
    mode: "select",
    selectedNode: null,
    edgeFrom: null,
    edgeWeightInput: "1",
    log: [],
    steps: [],
    stepIndex: 0,
    sourceNode: null,
    hoveredNode: null,
    nodeDistances: {}
  });
  
  const svgRef = useRef<SVGSVGElement | null>(null);

  const addNodeAt = (x: number, y: number) => {
    const id = uuid("n");
    setGraph((g) => ({
      nodes: { ...g.nodes, [id]: { x, y } },
      edges: [...g.edges],
    }));
    setLog((l) => [`Added node ${id}`, ...l]);
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (mode === "add-node" && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      addNodeAt(x, y);
    }
  };

  const onNodeClick = (id: NodeId, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (mode === "select") {
      setSelectedNode(id === selectedNode ? null : id);
    } else if (mode === "add-edge") {
      if (!edgeFrom) {
        setEdgeFrom(id);
        setLog((l) => [`Edge start selected: ${id}`, ...l]);
      } else {
        const weight = Math.max(0, Number(edgeWeightInput) || 0);
        const newEdge: Edge = { from: edgeFrom, to: id, weight, id: uuid("e") };
        setGraph((g) => ({ ...g, edges: [...g.edges, newEdge] }));
        setEdgeFrom(null);
        setLog((l) => [`Added edge ${newEdge.from} → ${newEdge.to} (w=${weight})`, ...l]);
      }
    } else if (mode === "run") {
      setSourceNode(id);
      setLog((l) => [`Source set to ${id}`, ...l]);
    }
  };

  const removeSelected = () => {
    if (!selectedNode) return;
    const id = selectedNode;
    setGraph((g) => {
      const newNodes = { ...g.nodes };
      delete newNodes[id];
      const newEdges = g.edges.filter((e) => e.from !== id && e.to !== id);
      return { nodes: newNodes, edges: newEdges };
    });
    setSelectedNode(null);
    setLog((l) => [`Removed node ${id}`, ...l]);
  };

  const runDijkstra = () => {
    if (!sourceNode) {
      setLog((l) => ["Pick a source node first (Run mode, click a node).", ...l]);
      return;
    }
    const res = dijkstraSteps(graph, sourceNode);
    setSteps(res.steps);
    setNodeDistances(res.dist);
    setStepIndex(0);
    setLog((l) => [`Dijkstra started from ${sourceNode}`, ...l]);
  };

  const stepForward = () => {
    if (stepIndex >= steps.length) return;
    const s = steps[stepIndex];
    if (!s) return;
    setStepIndex((i) => i + 1);

    if (s.type === "visit") {
      setLog((l) => [`Visited ${s.node} (dist=${s.dist})`, ...l]);
    } else if (s.type === "edgeRelax") {
      setLog((l) => [
        `Edge ${s.from}→${s.to} checked: old=${s.oldDist ?? "∞"} new=${s.newDist ?? "∞"}`,
        ...l,
      ]);
    } else if (s.type === "finished") {
      setLog((l) => ["Dijkstra finished", ...l]);
    }
  };

  const stepBack = () => setStepIndex((i) => Math.max(0, i - 1));

  const clearLog = () => {
    setLog([]);
  };

  const cancelEdge = () => {
    if (edgeFrom) {
      setEdgeFrom(null);
      setLog((l: string[]) => ["Edge creation cancelled", ...l]);
    }
  };

  const resetAll = () => {
    setGraph({ nodes: {}, edges: [] });
    setLog([]);
    setSteps([]);
    setStepIndex(0);
    setSelectedNode(null);
    setEdgeFrom(null);
    setSourceNode(null);
    setNodeDistances({});
  };

  const activeStep = steps[stepIndex] ?? null;

  const makeEdgePath = (from: Pos, to: Pos) => `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

  return (
    <div className="p-4 w-full h-full">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          className={`px-3 py-1 rounded ${mode === "select" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
          onClick={() => setMode("select")}
        >
          Select
        </button>
        <button
          className={`px-3 py-1 rounded ${mode === "add-node" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
          onClick={() => setMode("add-node")}
        >
          Add Node
        </button>
        <button
          className={`px-3 py-1 rounded ${mode === "add-edge" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
          onClick={() => setMode("add-edge")}
        >
          Add Edge
        </button>
        <button
          className={`px-3 py-1 rounded ${mode === "run" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
          onClick={() => setMode("run")}
        >
          Run
        </button>
        <input
          type="number"
          value={edgeWeightInput}
          onChange={(e) => setEdgeWeightInput(e.target.value)}
          className="w-20 px-2 py-1 border rounded"
          placeholder="Weight"
        />
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={runDijkstra}>
          Start
        </button>
        <button className="px-3 py-1 bg-gray-500 text-white rounded" onClick={stepBack}>
          ← Step
        </button>
        <button className="px-3 py-1 bg-gray-500 text-white rounded" onClick={stepForward}>
          Step →
        </button>
        <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={resetAll}>
          Reset
        </button>
        <button className="px-3 py-1 bg-yellow-500 text-white rounded" onClick={removeSelected}>
          Delete Node
        </button>
        {edgeFrom && (
          <button className="px-3 py-1 bg-orange-500 text-white rounded" onClick={cancelEdge}>
            Cancel Edge
          </button>
        )}
        <button className="px-3 py-1 bg-gray-400 text-white rounded" onClick={clearLog}>
          Clear Log
        </button>
      </div>

      {/* Canvas */}
      <div className="flex">
        <svg
          ref={svgRef}
          onClick={handleSvgClick}
          width="820"
          height="480"
          className="border rounded bg-white"
        >
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="#94a3b8" />
            </marker>
          </defs>

          {graph.edges.map((e) => {
            const from = graph.nodes[e.from];
            const to = graph.nodes[e.to];
            if (!from || !to) return null;
            const isActive =
              activeStep?.type === "edgeRelax" && (activeStep as any).edgeId === e.id;
            return (
              <g key={e.id}>
                <path
                  d={makeEdgePath(from, to)}
                  stroke={isActive ? "orange" : "#94a3b8"}
                  strokeWidth={isActive ? 4 : 2}
                  fill="none"
                  markerEnd="url(#arrow)"
                />
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 8}
                  fontSize={14}
                  textAnchor="middle"
                  fill={isActive ? "orange" : "#0f172a"}
                >
                  {e.weight}
                </text>
              </g>
            );
          })}

          {Object.entries(graph.nodes).map(([id, p]) => {
            const isSelected = selectedNode === id;
            const isSource = sourceNode === id;
            const activeVisited =
              activeStep?.type === "visit" && activeStep.node === id;
            return (
              <g
                key={id}
                transform={`translate(${p.x}, ${p.y})`}
                onClick={(e) => onNodeClick(id, e)}
                onMouseEnter={() => setHoveredNode(id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  r={20}
                  fill={
                    isSource
                      ? "#10b981"
                      : isSelected
                      ? "#2563eb"
                      : activeVisited
                      ? "#f97316"
                      : hoveredNode === id
                      ? "#e2e8f0"
                      : "#f1f5f9"
                  }
                  stroke={hoveredNode === id ? "#2563eb" : "#0f172a"}
                  strokeWidth={hoveredNode === id ? 2 : 1}
                />
                <text
                  y={nodeDistances[id] !== undefined ? -2 : 5}
                  fontSize={13}
                  fill={isSource || isSelected ? "white" : "#0f172a"}
                  textAnchor="middle"
                  style={{ pointerEvents: "none" }}
                >
                  {id.slice(-4)}
                </text>
                {nodeDistances[id] !== undefined && nodeDistances[id] !== Infinity && (
                  <text
                    y={12}
                    fontSize={11}
                    fill={isSource || isSelected ? "white" : "#0f172a"}
                    textAnchor="middle"
                    style={{ pointerEvents: "none" }}
                  >
                    ({nodeDistances[id]})
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Log */}
        <div className="ml-4 w-72 bg-gray-50 p-3 rounded overflow-y-auto h-[480px] text-sm">
          <div className="font-semibold mb-2">Log</div>
          {log.length === 0 ? (
            <p className="text-gray-400">No events yet</p>
          ) : (
            <ul className="space-y-1">
              {log.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DijkstraVisualizer;
