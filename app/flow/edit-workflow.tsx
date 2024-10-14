"use client";

import { useState, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  NodeProps,
  SmoothStepEdge,
  StepEdge,
  StraightEdge,
  ConnectionLineType,
} from "reactflow";
import "reactflow/dist/style.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Input Node", color: "#ff0000", size: 1, isSpecial: false },
    position: { x: 250, y: 25 },
  },
  {
    id: "2",
    data: {
      label: "Default Node",
      color: "#00ff00",
      size: 1,
      isSpecial: false,
    },
    position: { x: 100, y: 125 },
  },
  {
    id: "3",
    type: "output",
    data: { label: "Output Node", color: "#0000ff", size: 1, isSpecial: true },
    position: { x: 250, y: 250 },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "step",
    animated: true,
    style: { stroke: "#000", strokeWidth: 2 },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    type: "SmoothStep",
    animated: false,
    style: { stroke: "#000", strokeWidth: 2 },
  },
];

function CustomNode({ id, data }: NodeProps) {
  return (
    <div
      style={{
        background: data.color,
        padding: 10,
        borderRadius: 5,
        transform: `scale(${data.size})`,
      }}
    >
      {data.label}
      {data.isSpecial && <span style={{ marginLeft: 10 }}>🌟</span>}
    </div>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  // cant use this here since the types are not exported
  default: StepEdge,
  straight: StraightEdge,
  smoothstep: SmoothStepEdge
}

export default function ReactFlowWithSidebar() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const updateNodeData = useCallback(
    (id: string, newData: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return { ...node, data: { ...node.data, ...newData } };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  const closeSidebar = () => {
    setSelectedNode(null);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-grow">
        <ReactFlow
          connectionLineType={ConnectionLineType.SmoothStep}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{
            type: "SmoothStep",
          }}
        >
          <Controls />
          <MiniMap />
          <Background />
        </ReactFlow>
      </div>
      {selectedNode && (
        <div className="w-80 border-l p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Node Settings</h2>
            <Button variant="ghost" size="icon" onClick={closeSidebar}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={selectedNode.data.label}
                onChange={(e) =>
                  updateNodeData(selectedNode.id, { label: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                type="color"
                value={selectedNode.data.color}
                onChange={(e) =>
                  updateNodeData(selectedNode.id, { color: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="size">Size</Label>
              <Slider
                id="size"
                min={0.5}
                max={2}
                step={0.1}
                value={[selectedNode.data.size]}
                onValueChange={(value) =>
                  updateNodeData(selectedNode.id, { size: value[0] })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isSpecial"
                checked={selectedNode.data.isSpecial}
                onCheckedChange={(checked) =>
                  updateNodeData(selectedNode.id, { isSpecial: checked })
                }
              />
              <Label htmlFor="isSpecial">Special Node</Label>
            </div>
            <div>
              <Label htmlFor="nodeType">Node Type</Label>
              <Select
                value={selectedNode.type || "default"}
                onValueChange={(value) =>
                  updateNodeData(selectedNode.id, { type: value })
                }
              >
                <SelectTrigger id="nodeType">
                  <SelectValue placeholder="Select node type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="input">Input</SelectItem>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="output">Output</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
