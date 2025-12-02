import { useRef, useState } from "react";
import RedBlackTree from "./redblacktree.js";

const SVG_WIDTH = 800;
const SVG_HEIGHT = 400;
const LEVEL_HEIGHT = 80;
const STEP_DURATION = 1000;

function buildVisualNodes(tree) {
  const nodes = [];
  let idCounter = 0;

  function dfs(node, depth, xMin, xMax, parentId) {
    if (!node || node === tree.nil || node.value === null) return;

    const id = idCounter++;
    const x = (xMin + xMax) / 2;
    const y = depth * LEVEL_HEIGHT + 40;

    nodes.push({
      id,
      value: node.value,
      color: node.color,
      x,
      y,
      parentId,
    });

    const mid = (xMin + xMax) / 2;
    dfs(node.left, depth + 1, xMin, mid, id);
    dfs(node.right, depth + 1, mid, xMax, id);
  }

  dfs(tree.root, 0, 0, SVG_WIDTH, undefined);
  return nodes;
}

export default function RedBlackTreeVisualizer() {
  const treeRef = useRef(new RedBlackTree());
  const [nodes, setNodes] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const handleInsert = () => {
    const num = Number(inputValue);
    if (Number.isNaN(num) || inputValue === "" || isPlaying) return;

    const tree = treeRef.current;
    const frames = [];

    tree.onChange = () => {
      frames.push(buildVisualNodes(tree));
    };

    frames.length = 0;

    tree.insert(num);

    tree.onChange = null;

    if (frames.length === 0) {
      frames.push(buildVisualNodes(tree));
    }

    setIsPlaying(true);
    setStepIndex(0);
    setInputValue("");

    const playFrame = (i) => {
      setNodes(frames[i]);
      setStepIndex(i);

      if (i < frames.length - 1) {
        setTimeout(() => playFrame(i + 1), STEP_DURATION);
      } else {
        setTimeout(() => {
          setIsPlaying(false);
        }, STEP_DURATION);
      }
    };

    playFrame(0);
  };

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: "1.5rem",
        background: "white",
        borderRadius: "0.75rem",
        boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
        maxWidth: "900px",
        width: "100%",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
        Red–Black Tree Visualizer
      </h1>

      <p
        style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "0.5rem" }}
      >
        Insert a value to see the <strong>rotations and recolorings</strong>{" "}
        step by step.
      </p>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
          alignItems: "center",
        }}
      >
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value..."
          disabled={isPlaying}
          style={{
            padding: "0.4rem 0.6rem",
            borderRadius: "0.375rem",
            border: "1px solid #ccc",
            minWidth: "150px",
            opacity: isPlaying ? 0.6 : 1,
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleInsert();
          }}
        />
        <button
          onClick={handleInsert}
          disabled={isPlaying}
          style={{
            padding: "0.4rem 0.9rem",
            borderRadius: "0.375rem",
            border: "none",
            cursor: isPlaying ? "default" : "pointer",
            background: isPlaying ? "#9ca3af" : "#2563eb",
            color: "white",
            fontWeight: 500,
          }}
        >
          {isPlaying ? "Playing…" : "Insert"}
        </button>
        <button
          onClick={() => {
            const tree = treeRef.current;
            tree.inOrderTraversal(tree.root);
          }}
          style={{
            marginBottom: "1rem",
            padding: "0.4rem 0.9rem",
            borderRadius: "0.375rem",
            border: "none",
            background: "#10b981",
            color: "white",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Inorder Traversal
        </button>
        {isPlaying && (
          <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
            Step {stepIndex + 1}
          </span>
        )}
      </div>

      <svg
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "0.75rem",
          background: "#f9fafb",
        }}
      >
        {nodes.map((node) => {
          if (node.parentId == null) return null;
          const parent = nodeMap.get(node.parentId);
          if (!parent) return null;
          return (
            <line
              key={`line-${node.id}`}
              x1={parent.x}
              y1={parent.y}
              x2={node.x}
              y2={node.y}
              stroke="#9ca3af"
              strokeWidth={2}
            />
          );
        })}
        {nodes.map((node) => (
          <g
            key={node.id}
            style={{
              transition: "transform 0.5s ease",
              transform: `translate(${node.x}px, ${node.y}px)`,
            }}
          >
            <circle
              cx={0}
              cy={0}
              r={22}
              fill={node.color === "Red" ? "#ef4444" : "#111827"}
              stroke="#111827"
              strokeWidth={2}
            />
            <text x={0} y={5} textAnchor="middle" fontSize="14" fill="#f9fafb">
              {node.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
