import React, { LegacyRef, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { NodeType, ConnectionPointType } from './types'
import { Separator } from '@/components/ui/separator'

interface NodeProps {
  node: NodeType
  updateNode: (id: string, updates: Partial<NodeType>) => void
  removeNode: (id: string) => void
  onNodeSelect: (node: NodeType) => void
  onConnectionStart: (nodeId: string, pointType: ConnectionPointType, handleId: string) => void
  onConnectionEnd: (nodeId: string, pointType: ConnectionPointType, handleId: string) => void
}

const Node: React.FC<NodeProps> = ({
  node,
  updateNode,
  removeNode,
  onNodeSelect,
  onConnectionStart,
  onConnectionEnd,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'node',
    item: { id: node.id, type: node.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  React.useEffect(() => {
    if (headerRef.current) {
      drag(headerRef)
    }
  }, [drag, headerRef])

  const handleConnectionPointMouseDown = (e: React.MouseEvent, pointType: ConnectionPointType, handleId: string) => {
    e.stopPropagation()
    onConnectionStart(node.id, pointType, handleId)
  }

  const handleConnectionPointMouseUp = (e: React.MouseEvent, pointType: ConnectionPointType, handleId: string) => {
    e.stopPropagation()
    onConnectionEnd(node.id, pointType, handleId)
  }

  const renderConnectionPoints = (type: ConnectionPointType) => {
    const count = type === 'input' ? 1 : (node.options?.length || 1)
    const points = []

    const position = type === 'input' ? 'left' : 'right'
    const bottom = `18px`

    for (let i = 0; i < count; i++) {
      const handleId = `${type}-${i}`
      // const position = type === 'input' ? 'left' : 'right'
      const top = type === 'input' ? '30%' : `${(i + 1) / (count + 1) * 100}%`

      points.push(
        
          <div
            key={handleId}
            className={`${position == 'left' ? 'absolute w-3 h-9' : 'w-3 h-3'}  bg-primary/30 rounded-full cursor-crosshair`}
            style={{ [position]: '-10px', top }}
            onMouseDown={(e) => handleConnectionPointMouseDown(e, type, handleId)}
            onMouseUp={(e) => handleConnectionPointMouseUp(e, type, handleId)}
          />
      )
    }

    if (position == 'right') {
      return <div className="absolute p-1 bg-red-500 rounded-r-lg space-y-[13px] cursor-crosshair" style={{ [position]: '-18px', bottom }}>{points}</div>
    }
    return <div>{points}</div>
  }


  const [, drop] = useDrop({
    accept: 'configuration',
    drop: (item: { id: string; type: string }, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset()
      console.log("AAAA", delta)
      return
    },
  })

  return (
    <div
      ref={nodeRef}
      style={{
        position: 'absolute',
        left: node.position.x,
        top: node.position.y,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="bg-card text-card-foreground border border-border shadow-md rounded-md w-64"
    >
      <div
        ref={headerRef}
        className="flex justify-between items-center p-2 bg-muted rounded-t-md cursor-move"
      >
        <span className="font-medium">{node.type}</span>
        <Button variant="ghost" size="icon" onClick={() => onNodeSelect(node)}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        <div ref={drop as unknown as LegacyRef<HTMLDivElement>} className="flex-1 relative overflow-hidden">
          <div className="text-sm">{node.content}</div>
          <Separator />
          {node.configurations && (
            <div className="mt-2 space-y-1">
              {node.configurations.map((option, index) => (
                <div key={index} className="text-xs bg-muted p-1 rounded flex justify-between items-center">
                  <span>{option}</span>
                </div>
              ))}
            </div>
          )}
          <Separator />
          {node.options && (
            <div className="mt-2 space-y-1">
              {node.options.map((option, index) => (
                <div key={index} className="text-xs bg-muted p-1 rounded flex justify-between items-center">
                  <span>{option}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {renderConnectionPoints('input')}
        {renderConnectionPoints('output')}
      </div>
    </div>
  )
}

export default Node