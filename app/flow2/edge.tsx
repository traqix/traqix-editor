import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { NodeType, EdgeType, ConnectionPointType } from './types'

interface EdgeProps {
  sourceNode: NodeType
  targetNode: NodeType
  edge: EdgeType
  updateEdge: (edgeId: string, updates: Partial<EdgeType>) => void
  removeEdge: (edgeId: string) => void
  onEdgeDragStart: (edgeId: string) => void
  onEdgeDragEnd: (edgeId: string, sourceId: string, targetId: string, sourceHandle: string, targetHandle: string) => void
  isPreview?: boolean
  previewSourcePos?: { x: number; y: number }
  previewTargetPos?: { x: number; y: number }
}

const lineTypes = ['curve', 'zigzag', 'straight', 'step', 'smoothstep']

const Edge: React.FC<EdgeProps> = ({
  sourceNode,
  targetNode,
  edge,
  updateEdge,
  removeEdge,
  onEdgeDragStart,
  onEdgeDragEnd,
  isPreview = false,
  previewSourcePos,
  previewTargetPos,
}) => {
  const [lineType, setLineType] = useState(edge.lineType || 'curve')
  const [isHovered, setIsHovered] = useState(false)
  const edgeRef = useRef<SVGGElement>(null)

  const sourceX = useMotionValue(sourceNode.position.x + 200)
  const sourceY = useMotionValue(sourceNode.position.y + ((parseInt(edge.sourceHandle.split('-')[1]) + 1) / (sourceNode.options?.length || 2)) * 100)
  const targetX = useMotionValue(targetNode.position.x)
  const targetY = useMotionValue(targetNode.position.y + ((parseInt(edge.targetHandle.split('-')[1]) + 1) / (targetNode.options?.length || 2)) * 100)

  const springConfig = { damping: 20, stiffness: 300 }
  const sourceXSpring = useSpring(sourceX, springConfig)
  const sourceYSpring = useSpring(sourceY, springConfig)
  const targetXSpring = useSpring(targetX, springConfig)
  const targetYSpring = useSpring(targetY, springConfig)

  useEffect(() => {
    if (isPreview && previewSourcePos && previewTargetPos) {
      sourceX.set(previewSourcePos.x)
      sourceY.set(previewSourcePos.y)
      targetX.set(previewTargetPos.x)
      targetY.set(previewTargetPos.y)
    } else {
      sourceX.set(sourceNode.position.x + 200)
      sourceY.set(sourceNode.position.y + ((parseInt(edge.sourceHandle.split('-')[1]) + 1) / (sourceNode.options?.length || 2)) * 100)
      targetX.set(targetNode.position.x)
      targetY.set(targetNode.position.y + ((parseInt(edge.targetHandle.split('-')[1]) + 1) / (targetNode.options?.length || 2)) * 100)
    }
  }, [sourceNode, targetNode, edge, isPreview, previewSourcePos, previewTargetPos])

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'edge',
    // item: { id: edge.id, type: 'edge' },
    item: () => {
      return [edge, onEdgeDragStart(edge.id)]
  },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    // begin: () => {
    //   onEdgeDragStart(edge.id)
    // },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult() as { nodeId: string; handleId: string } | null
      if (dropResult) {
        onEdgeDragEnd(edge.id, sourceNode.id, dropResult.nodeId, edge.sourceHandle, dropResult.handleId)
      }
    },
  })

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])


  function generateCurvePath(sx: number, sy: number, tx: number, ty: number) {
    // Cálculo do ponto médio com ajuste para os quadrantes esquerdo
    const offsetX = 20; // deslocamento para a esquerda
    const offsetY = 20; // deslocamento para baixo

    let controlPointX, controlPointY;

    if (sx < tx) {
        // Quadrantes direito-superior e direito-inferior
        const midX = (sx + tx) / 2;
        controlPointX = midX;
        controlPointY = sy < ty ? sy + offsetY : sy - offsetY;
        return `M ${sx} ${sy} H ${midX} Q ${controlPointX} ${controlPointY} ${tx} ${ty}`;
    } else {
        // Quadrantes esquerdo-superior e esquerdo-inferior
        const midX = (sx + tx) - offsetX; // 20px para a esquerda
        controlPointX = midX;
        controlPointY = sy < ty ? ty - offsetY : ty + offsetY; // 20px para baixo ou para cima
        return `M ${sx} ${sy} H ${midX} Q ${controlPointX} ${controlPointY} ${tx} ${ty}`;
    }
}


  const getPath = useCallback(() => {
    const sx = sourceXSpring.get()
    const sy = sourceYSpring.get()
    const tx = targetXSpring.get()
    const ty = targetYSpring.get()

    switch (lineType) {
      case 'curve':
        return `M ${sx} ${sy} C ${(sx + tx) / 2} ${sy}, ${(sx + tx) / 2} ${ty}, ${tx} ${ty}`
      case 'straight':
        return `M ${sx} ${sy} L ${tx} ${ty}`
      case 'zigzag':
        const amplitude = Math.abs((tx - sx) / 10); // Define a amplitude do zigzag
        const numZigzags = 4; // Número de zigue-zagues
        const dx = (tx - sx) / numZigzags;
        let path = `M ${sx} ${sy}`; // Ponto inicial

        for (let i = 1; i <= numZigzags; i++) {
          const nextX = sx + i * dx;
          const nextY = i % 2 === 0 ? sy : sy + amplitude * (sy < ty ? 1 : -1);
          path += ` Q ${(sx + nextX) / 2} ${sy}, ${nextX} ${nextY}`;
        }
        
        path += ` T ${tx} ${ty}`; // Conectar ao destino final suavemente
        return path;

      
      case 'step':
        const midX = (sx + tx) / 2 - 20; // Move 20px à esquerda
        const startY = sy + 20; // Move 20px abaixo
        const curveRadius = Math.abs((tx - sx) / 80); // Ajuste do raio da curva
        const directionY = sy < ty ? 1 : -1; // Define se a curva é para baixo (1) ou para cima (-1)

        return `M ${sx} ${sy} 
                H ${midX} 
                Q ${midX} ${startY} ${midX} ${startY + (curveRadius * directionY)} 
                V ${ty - (curveRadius * directionY)} 
                Q ${midX} ${ty} ${midX + curveRadius} ${ty} 
                H ${tx}`;
        // const midX = (sx + tx) / 2;
        // const curveRadius = Math.abs((tx - sx) / 80); // Ajuste o valor do raio
        // const directionY = sy < ty ? 1 : -1; // Define se a curva é para baixo ou para cima
        
        // return `M ${sx} ${sy} H ${midX - curveRadius} Q ${midX} ${sy}, ${midX} ${sy + curveRadius * directionY} V ${ty - curveRadius * directionY} Q ${midX} ${ty}, ${midX + curveRadius} ${ty} H ${tx}`
      case 'smoothstep':
        return `M ${sx} ${sy} Q ${(sx + tx) / 2} ${sy}, ${(sx + tx) / 2} ${(sy + ty) / 2} T ${tx} ${ty}`
      default:
        return `M ${sx} ${sy} L ${tx} ${ty}`
    }
  }, [sourceXSpring, sourceYSpring, targetXSpring, targetYSpring, lineType])

  const handleLineTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLineType = e.target.value
    setLineType(newLineType)
    updateEdge(edge.id, { lineType: newLineType })
  }

  const handleEdgeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // You can add more functionality here, like selecting the edge
  }

  const handleEdgeDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeEdge(edge.id)
  }

  const renderArrowhead = () => {
    const arrowSize = 10
    const sx = sourceXSpring.get()
    const sy = sourceYSpring.get()
    const tx = targetXSpring.get()
    const ty = targetYSpring.get()

    const angle = Math.atan2(ty - sy, tx - sx)
    const x1 = tx - arrowSize * Math.cos(angle - Math.PI / 6)
    const y1 = ty - arrowSize * Math.sin(angle - Math.PI / 6)
    const x2 = tx - arrowSize * Math.cos(angle + Math.PI / 6)
    const y2 = ty - arrowSize * Math.sin(angle + Math.PI / 6)

    console.log(`${sx} - ${sy} - ${tx} - ${ty} || ${x1} - ${y1} - ${x2} - ${y2}`)
    return (
      <polygon
        points={`${tx},${ty} ${x1},${y1} ${x2},${y2}`}
        fill="currentColor"
      />
    )
  }

  return (
    <motion.g
      ref={drag(edgeRef)}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      animate={{ opacity: isPreview ? 0.5 : 1 }}
    >
      <motion.path
        d={getPath()}
        fill="none"
        stroke="currentColor"
        strokeWidth={isHovered ? 3 : 2}
        initial={false}
        animate={{ strokeWidth: isHovered ? 3 : 2 }}
        transition={{ duration: 0.2 }}
        onClick={handleEdgeClick}
        onDoubleClick={handleEdgeDoubleClick}
      />
      {renderArrowhead()}
      {!isPreview && (
        <foreignObject
          x={(sourceXSpring.get() + targetXSpring.get()) / 2 - 50}
          y={(sourceYSpring.get() + targetYSpring.get()) / 2 - 15}
          width={100}
          height={30}
        >
          <select
            value={lineType}
            onChange={handleLineTypeChange}
            className="bg-background text-foreground border border-input rounded px-2 py-1 text-xs"
          >
            {lineTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </foreignObject>
      )}
    </motion.g>
  )
}

export const EdgePreview: React.FC<{
  sourcePos: { x: number; y: number }
  targetPos: { x: number; y: number }
}> = ({ sourcePos, targetPos }) => {
  return (
    <Edge
      sourceNode={{ id: 'preview-source', position: sourcePos } as NodeType}
      targetNode={{ id: 'preview-target', position: targetPos } as NodeType}
      edge={{
        id: 'preview-edge',
        source: 'preview-source',
        target: 'preview-target',
        sourceHandle: 'output-0',
        targetHandle: 'input-0',
        lineType: 'curve',
      }}
      updateEdge={() => {}}
      removeEdge={() => {}}
      onEdgeDragStart={() => {}}
      onEdgeDragEnd={() => {}}
      isPreview={true}
      previewSourcePos={sourcePos}
      previewTargetPos={targetPos}
    />
  )
}

export default Edge