import { useState, useCallback } from 'react'
import { NodeData, EdgeData } from './FlowDiagram'

export function useFlowDiagram(initialNodes: NodeData[], initialEdges: EdgeData[]) {
  const [nodes, setNodes] = useState<NodeData[]>(initialNodes)
  const [edges, setEdges] = useState<EdgeData[]>(initialEdges)
  const [draggingNode, setDraggingNode] = useState<NodeData | null>(null)
  const [draggingOffset, setDraggingOffset] = useState({ x: 0, y: 0 })

  const onNodeMouseDown = useCallback((event: React.MouseEvent, node: NodeData) => {
    setDraggingNode(node)
    setDraggingOffset({
      x: event.clientX - node.position.x,
      y: event.clientY - node.position.y,
    })
  }, [])

  const onNodeMouseUp = useCallback(() => {
    setDraggingNode(null)
  }, [])

  const onCanvasMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (draggingNode) {
        const newX = event.clientX - draggingOffset.x
        const newY = event.clientY - draggingOffset.y
        setNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.id === draggingNode.id
              ? { ...node, position: { x: newX, y: newY } }
              : node
          )
        )
      }
    },
    [draggingNode, draggingOffset]
  )

  const onCanvasMouseUp = useCallback(() => {
    setDraggingNode(null)
  }, [])

  const onConnect = useCallback(
    (params: { source: string; sourceHandle: string; target: string; targetHandle: string }) => {
      const newEdge: EdgeData = {
        id: `edge-${edges.length + 1}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
      }
      setEdges((prevEdges) => [...prevEdges, newEdge])
    },
    [edges]
  )

  const updateNode = useCallback((id: string, newData: Partial<NodeData['data']>) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...newData } } : node
      )
    )
  }, [])

  const addNode = useCallback((newNode: NodeData) => {
    setNodes((prevNodes) => [...prevNodes, newNode])
  }, [])

  const moveNode = useCallback((id: string, deltaX: number, deltaY: number) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id
          ? {
              ...node,
              position: {
                x: node.position.x + deltaX,
                y: node.position.y + deltaY,
              },
            }
          : node
      )
    )
  }, [])

  return {
    nodes,
    edges,
    onNodeMouseDown,
    onNodeMouseUp,
    onCanvasMouseMove,
    onCanvasMouseUp,
    onConnect,
    updateNode,
    addNode,
    moveNode,
  }
}