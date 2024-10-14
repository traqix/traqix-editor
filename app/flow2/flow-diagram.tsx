"use client"

import React, { useState, useCallback, useRef, LegacyRef } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend, getEmptyImage } from 'react-dnd-html5-backend'
import { MessageSquare, ChevronRight, GitBranch } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Node from './node'
import Edge, { EdgePreview } from './edge'
import Modal from './modal'
import RightSidebar from './right-sidebar'
import { NodeType, EdgeType, ConnectionPointType } from './types'
import ComponentConfiguration from './component-configuration'
import ComponentOption from './component-option'

const NodeTypes = {
  START: 'Start',
  MESSAGE: 'Message',
  INPUT: 'Input',
  CONDITION: 'Condition',
}

const FlowDiagram: React.FC = () => {
  const [nodes, setNodes] = useState<NodeType[]>([
    { id: '1', type: NodeTypes.START, content: 'Start', position: { x: 100, y: 100 } },
    { id: '2', type: NodeTypes.MESSAGE, content: "Hey, I'm your personal assistant. How can I help you today?", position: { x: 100, y: 250 } },
    { id: '3', type: NodeTypes.CONDITION, content: "User's request", position: { x: 100, y: 400 }, options: ['Sign up', 'Check wallet', 'Get advice on product', 'Speak to human', 'No match'] },
    { id: '4', type: NodeTypes.MESSAGE, content: "Sounds good. May I wonder your name?", position: { x: 400, y: 250 } },
  ])

  const [edges, setEdges] = useState<EdgeType[]>([])
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [connectionStart, setConnectionStart] = useState<{ nodeId: string, pointType: ConnectionPointType, handleId: string } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [previewEdge, setPreviewEdge] = useState<{ source: { x: number; y: number }, target: { x: number; y: number } } | null>(null)

  const updateNode = useCallback((id: string, updates: Partial<NodeType>) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id ? { ...node, ...updates } : node
      )
    )
  }, [])

  const removeNode = useCallback((id: string) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id))
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.source !== id && edge.target !== id))
  }, [])

  const addNode = useCallback((type: string) => {
    const newNode: NodeType = {
      id: Date.now().toString(),
      type,
      content: `New ${type}`,
      position: { x: 100, y: 100 },
      options: type === NodeTypes.CONDITION ? ['Option 1', 'Option 2'] : undefined,
    }
    setNodes((prevNodes) => [...prevNodes, newNode])
  }, [])

  const updateEdge = useCallback((edgeId: string, updates: Partial<EdgeType>) => {
    setEdges((prevEdges) =>
      prevEdges.map((edge) =>
        edge.id === edgeId ? { ...edge, ...updates } : edge
      )
    )
  }, [])

  const removeEdge = useCallback((edgeId: string) => {
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId))
  }, [])

  const handleConnectionStart = (nodeId: string, pointType: ConnectionPointType, handleId: string) => {
    setConnectionStart({ nodeId, pointType, handleId })
  }

  const handleConnectionEnd = (nodeId: string, pointType: ConnectionPointType, handleId: string) => {
    if (connectionStart && connectionStart.nodeId !== nodeId) {
      const newEdge: EdgeType = {
        id: Date.now().toString(),
        source: connectionStart.pointType === 'output' ? connectionStart.nodeId : nodeId,
        target: connectionStart.pointType === 'output' ? nodeId : connectionStart.nodeId,
        sourceHandle: connectionStart.pointType === 'output' ? connectionStart.handleId : handleId,
        targetHandle: connectionStart.pointType === 'output' ? handleId : connectionStart.handleId,
        lineType: 'step',
      }
      setEdges((prevEdges) => [...prevEdges, newEdge])
    }
    setConnectionStart(null)
  }

  const handleEdgeDragStart = (edgeId: string) => {
    // Logic for when an edge drag starts
  }
  
  const handleEdgeDragEnd = (edgeId: string, sourceId: string, targetId: string, sourceHandle: string, targetHandle: string) => {
    // Logic for when an edge drag ends and potentially connects to a new node
    // Update the edge data here
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (connectionStart && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
  
      const sourceNode = nodes.find(n => n.id === connectionStart.nodeId)
      if (sourceNode) {
        const sourcePos = {
          x: sourceNode.position.x,
          y: sourceNode.position.y
        }
  
        setPreviewEdge({
          source: sourcePos,
          target: { x, y }
        })
      }
    }
  }  

  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    if (connectionStart) {
      setConnectionStart(null)
    }
  }

  const [, drop] = useDrop({
    accept: 'node',
    drop: (item: { id: string; type: string }, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset()
      if (delta) {
        const node = nodes.find((n) => n.id === item.id)
        if (node) {
          const newX = Math.round(node.position.x + delta.x)
          const newY = Math.round(node.position.y + delta.y)
          updateNode(node.id, {
            position: { x: newX, y: newY },
          })
        }
      }
    },
  })

  return (
    <>
      <div className="w-full h-screen bg-background flex">
        <div className="w-64 bg-muted p-4 border-r">
          <h2 className="text-lg font-semibold mb-4">Components</h2>
          <div className="space-y-2">
            <Button onClick={() => addNode(NodeTypes.MESSAGE)} className="w-full justify-start">
              <MessageSquare className="mr-2 h-4 w-4" /> Message
            </Button>
            <Button onClick={() => addNode(NodeTypes.INPUT)} className="w-full justify-start">
              <ChevronRight className="mr-2 h-4 w-4" /> Input
            </Button>
            <Button onClick={() => addNode(NodeTypes.CONDITION)} className="w-full justify-start">
              <GitBranch className="mr-2 h-4 w-4" /> Condition
            </Button>

            {/* Adicionar botões para arrastar componentes Configuração e Opção */}
            <div className="pt-4">
              <h3 className="text-lg font-semibold mb-2">Add Component</h3>
              <div className="space-y-2">
                <ComponentConfiguration />
                <ComponentConfiguration />
                <ComponentOption />
                <ComponentOption />
              </div>
            </div>
          </div>
        </div>

        <div ref={drop as unknown as LegacyRef<HTMLDivElement>} className="flex-1 relative overflow-hidden">
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {edges.map((edge) => {
              const sourceNode = nodes.find((node) => node.id === edge.source)
              const targetNode = nodes.find((node) => node.id === edge.target)
              if (sourceNode && targetNode) {
                return (
                  <Edge
                    key={edge.id}
                    sourceNode={sourceNode}
                    targetNode={targetNode}
                    edge={edge}
                    updateEdge={updateEdge}
                    removeEdge={removeEdge}
                    onEdgeDragStart={handleEdgeDragStart}
                    onEdgeDragEnd={handleEdgeDragEnd}
                  />
                )
              }
              return null
            })}
            {previewEdge && (
              <EdgePreview
                sourcePos={previewEdge.source}
                targetPos={previewEdge.target}
              />
            )}
            {connectionStart && (
              <line
                x1={nodes.find(n => n.id === connectionStart.nodeId)?.position.x || 0}
                y1={nodes.find(n => n.id === connectionStart.nodeId)?.position.y || 0}
                x2={svgRef.current?.getBoundingClientRect().left || 0}
                y2={svgRef.current?.getBoundingClientRect().top || 0}
                stroke="currentColor"
                strokeWidth={2}
                strokeDasharray="5,5"
              />
            )}
          </svg>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            {nodes.map((node) => (
              <Node
                key={node.id}
                node={node}
                updateNode={updateNode}
                removeNode={removeNode}
                onNodeSelect={setSelectedNode}
                onConnectionStart={handleConnectionStart}
                onConnectionEnd={handleConnectionEnd}
              />
            ))}
          </div>
        </div>
        <RightSidebar selectedNode={selectedNode} updateNode={updateNode} />
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        node={selectedNode}
        updateNode={updateNode}
      />
    </>
  )
}

export default FlowDiagram