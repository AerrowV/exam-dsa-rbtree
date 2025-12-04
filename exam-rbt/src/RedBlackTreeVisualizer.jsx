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
    if (!node) return;

    const isNil = node === tree.nil || node.value === null;

    const id = idCounter++;
    const x = (xMin + xMax) / 2;
    const y = depth * LEVEL_HEIGHT + 40;

    nodes.push({
      id,
      value: isNil ? null : node.value,
      color: isNil ? "Black" : node.color,
      x,
      y,
      parentId,
      isNil,
    });

    if (isNil) return;

    const mid = (xMin + xMax) / 2;
    dfs(node.left, depth + 1, xMin, mid, id);
    dfs(node.right, depth + 1, mid, xMax, id);
  }

  if (tree.root && tree.root !== tree.nil) {
    dfs(tree.root, 0, 0, SVG_WIDTH, undefined);
  }

  return nodes;
}

export default function RedBlackTreeVisualizer() {
  const treeRef = useRef(new RedBlackTree());
  const [nodes, setNodes] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [showNullNodes, setShowNullNodes] = useState(true);

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

  const visibleNodes = nodes.filter((n) => showNullNodes || !n.isNil);
  const nodeMap = new Map(visibleNodes.map((n) => [n.id, n]));

  return (
    <div>
      <h1>Red-Black Tree Visualizer</h1>

      <p>
        Insert a value
      </p>

      <div>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value..."
          disabled={isPlaying}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleInsert();
          }}
        />
        <button onClick={handleInsert} disabled={isPlaying}>
          {isPlaying ? "Playing…" : "Insert"}
        </button>
        <button
          onClick={() => {
            const tree = treeRef.current;
            tree.inOrderTraversal(tree.root);
          }}
        >
          Inorder Traversal
        </button>

        <label style={{ marginLeft: "1rem" }}>
          <input
            type="checkbox"
            checked={showNullNodes}
            onChange={(e) => setShowNullNodes(e.target.checked)}
          />{" "}
          Show null (NIL) nodes
        </label>

        {isPlaying && (
          <span style={{ marginLeft: "1rem" }}>Step {stepIndex + 1}</span>
        )}
      </div>

      <svg width={SVG_WIDTH} height={SVG_HEIGHT}>
        {visibleNodes.map((node) => {
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

        {visibleNodes.map((node) => (
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
              r={node.isNil ? 14 : 22}
              fill={
                node.isNil
                  ? "#111827"
                  : node.color === "Red"
                  ? "#ef4444"
                  : "#111827"
              }
              stroke="#6b7280"
              strokeWidth={2}
              strokeDasharray={node.isNil ? "4 4" : "0"}
            />
            {!node.isNil && (
              <text
                x={0}
                y={5}
                textAnchor="middle"
                fontSize="14"
                fill="#f9fafb"
              >
                {node.value}
              </text>
            )}
            {node.isNil && (
              <text
                x={0}
                y={4}
                textAnchor="middle"
                fontSize="10"
                fill="#ffffff"
              >
                NIL
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
