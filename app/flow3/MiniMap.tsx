import React from 'react'
import { NodeData, EdgeData } from './FlowDiagram'

interface MiniMapProps {
  nodes: NodeData[]
  edges: EdgeData[]
}

export function MiniMap({ nodes, edges }: MiniMapProps) {
  const mapSize = { width: 200, height: 150 }
  const padding = 20
  const nodePositions = nodes.map(node => node.position)
  const minX = Math.min(...nodePositions.map(p => p.x)) - padding
  const minY = Math.min(...nodePositions.map(p => p.y)) - padding
  const maxX = Math.max(...nodePositions.map(p => p.x)) + padding
  const maxY = Math.max(...nodePositions.map(p => p.y)) + padding
  const scaleX = mapSize.width / (maxX - minX)
  const scaleY = mapSize.height / (maxY - minY)
  const scale = Math.min(scaleX, scaleY)

  return (
    <div className="absolute bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      <svg width={mapSize.width} height={mapSize.height}>
        {edges.map(edge => {
          const source = nodes.find(n => n.id === edge.source)
          const target = nodes.find(n => n.id === edge.target)
          if (source && target) {
            return (
              <line
                key={edge.id}
                x1={(source.position.x - minX) * scale}
                y1={(source.position.y - minY) * scale}
                x2={(target.position.x - minX) * scale}
                y2={(target.position.y - minY) * scale}
                stroke="black"
                strokeWidth="1"
              />
            )
          }
          return null
        })}
        {nodes.map(node => (
          <rect
            key={node.id}
            x={(node.position.x - minX) * scale}
            y={(node.position.y - minY) * scale}
            width={10}
            height={10}
            fill="blue"
          />
        ))}
      </svg>
    </div>
  )
}