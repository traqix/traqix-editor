import React, { LegacyRef } from 'react'
import { useDrop } from 'react-dnd'

interface DropAreaProps {
  children: React.ReactNode
  moveNode: (id: string, x: number, y: number) => void
}

export function DropArea({ children, moveNode }: DropAreaProps) {
  const [, drop] = useDrop(() => ({
    accept: 'node',
    drop: (item: { id: string }, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset()
      if (delta) {
        const x = Math.round(delta.x)
        const y = Math.round(delta.y)
        moveNode(item.id, x, y)
      }
    },
  }))

  return <div ref={drop as unknown as LegacyRef<HTMLDivElement>} className="w-full h-full">{children}</div>
}