import { ElkNode } from 'elkjs'
import { HandleType } from 'reactflow'

export type Element = {
  id: string
  name: string
  type: string
  children?: Element[]
  bg?: string
  collapsed?: boolean
}

export type Elements = Element[]

export type ElementMap = Record<string, Element>

export type Connection = {
  id: string
  comp1: string
  comp2: string
}

export type ElMapData = {
  el: Element
  parent: string
  path: string[]
}

export type Connections = Connection[]

export type NodeHandleData = {
  x: number
  y: number
  id: string
  type: HandleType
}

export type NodeDataBase = {
  element: Element
  handles: NodeHandleData[]
  width: number
  height: number
  bg?: string
}

export type NodeData = {
  elk: ElkNode
  element: Element
  label: string
  stageX: number
  stageY: number
  width: number
  height: number
  handles: NodeHandleData[]
}

export type EdgeData = {
  points: { x: number; y: number }[]
  nodeWidth: number
  nodeHeight: number
}

export type User = {
  id: string
  name: string
  color: string
  cursorPos?: CursorPos
}


export type CursorPos = {
  x: number
  y: number
  lastUpdate: number
}