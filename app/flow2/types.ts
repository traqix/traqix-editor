export interface NodeType {
  id: string
  type: string
  content: string
  position: { x: number; y: number }
  options?: string[]
  configurations?: string[]
}

export interface EdgeType {
  id: string
  source: string
  target: string
  sourceHandle: string
  targetHandle: string
  lineType: string
}

export type ConnectionPointType = 'input' | 'output'