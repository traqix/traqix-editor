import FlowDiagram from "./FlowDiagram";

// Exemplo de uso do FlowDiagram
const initialNodes: Node[] = [
  { id: 'node1', position: { x: 100, y: 100 }, inputs: [], outputs: ['node2', 'node3'] },
  { id: 'node2', position: { x: 300, y: 50 }, inputs: ['node1'], outputs: [] },
  { id: 'node3', position: { x: 300, y: 150 }, inputs: ['node1'], outputs: ['node4'] },
  { id: 'node4', position: { x: 500, y: 100 }, inputs: ['node3'], outputs: [] },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'node1', target: 'node2' },
  { id: 'e1-3', source: 'node1', target: 'node3' },
  { id: 'e3-4', source: 'node3', target: 'node4' },
];

const FlowDiagramExample: React.FC = () => {
  return (
    <div>
      <h1>Flow Diagram Example</h1>
      <FlowDiagram initialNodes={initialNodes} initialEdges={initialEdges} />
    </div>
  );
};

export default FlowDiagramExample;