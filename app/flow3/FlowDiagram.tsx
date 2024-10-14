"use client";

import React, { useState } from 'react';
import { Node } from './Node';
import { Edge } from './Edge';

interface NodeData {
  id: string;
  position: { x: number; y: number };
  inputs: string[];
  outputs: string[];
  type: string; // Adicionando tipo de nó
  label: string; // Rótulo do nó
}

interface EdgeData {
  id: string;
  source: string;
  target: string;
  label?: string; // Rótulo opcional para a borda
}

const FlowDiagram: React.FC = () => {
  const [nodes, setNodes] = useState<NodeData[]>([
    { id: 'node1', position: { x: 100, y: 100 }, inputs: [], outputs: ['node2', 'node3'], type: 'input', label: 'Início' },
    { id: 'node2', position: { x: 300, y: 50 }, inputs: ['node1'], outputs: [], type: 'process', label: 'Processo A' },
    { id: 'node3', position: { x: 300, y: 150 }, inputs: ['node1'], outputs: ['node4'], type: 'process', label: 'Processo B' },
    { id: 'node4', position: { x: 500, y: 100 }, inputs: ['node3'], outputs: [], type: 'output', label: 'Saída' },
  ]);

  const [edges, setEdges] = useState<EdgeData[]>([
    { id: 'e1-2', source: 'node1', target: 'node2', label: 'Para A' },
    { id: 'e1-3', source: 'node1', target: 'node3', label: 'Para B' },
    { id: 'e3-4', source: 'node3', target: 'node4', label: 'Saída de B' },
  ]);

  const addNode = (type: string = 'process') => {
    const newNode: NodeData = {
      id: `node-${nodes.length + 1}`,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      inputs: [],
      outputs: [],
      type: type,
      label: `Novo ${type}`,
    };
    setNodes([...nodes, newNode]);
  };

  const addEdge = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return; // Prevenir loops
    const newEdge: EdgeData = {
      id: `${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      label: `Conexão de ${sourceId} para ${targetId}`,
    };
    setEdges([...edges, newEdge]);
  };

  return (
    <div className="flow-diagram" style={{ backgroundColor: '#1e1e1e', padding: '20px' }}>
      <header>
        <h1 style={{ color: '#ffffff' }}>Diagrama de Fluxo</h1>
        <button onClick={() => addNode('input')} style={{ margin: '10px', padding: '10px', borderRadius: '5px' }}>
          Adicionar Nó de Entrada
        </button>
        <button onClick={() => addNode('process')} style={{ margin: '10px', padding: '10px', borderRadius: '5px' }}>
          Adicionar Processo
        </button>
        <button onClick={() => addNode('output')} style={{ margin: '10px', padding: '10px', borderRadius: '5px' }}>
          Adicionar Nó de Saída
        </button>
      </header>
      <div className="graph-container" style={{ position: 'relative', height: '500px', border: '1px solid #cccccc', borderRadius: '5px', backgroundColor: '#2e2e2e' }}>
        {nodes.map((node) => (
          <Node key={node.id} node={node} />
        ))}
        {edges.map((edge) => {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const targetNode = nodes.find((n) => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          const x1 = sourceNode.position.x + 50; // Centro do nó de origem
          const y1 = sourceNode.position.y + 25; // Centro do nó de origem
          const x2 = targetNode.position.x; // Posição x do nó de destino
          const y2 = targetNode.position.y + 25; // Centro do nó de destino

          return (
            <Edge key={edge.id} x1={x1} y1={y1} x2={x2} y2={y2} label={edge.label} />
          );
        })}
      </div>
    </div>
  );
};

export default FlowDiagram;
