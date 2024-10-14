/// <reference lib="dom" />

import * as Y from 'yjs'
import { WebsocketProvider} from 'y-websocket'
import { proxy, useSnapshot } from 'valtio'
import { bind } from 'valtio-yjs'
import randColor from 'randomcolor'
import * as T from './types'
import { copy, makeId, sortItemsBy } from './util'


/*

  COMP STATE

*/

export type CompState = {
  elements: T.Elements
  connections: T.Connections
  elMap: Record<string, T.ElMapData>
}

const compState = proxy<{ data: CompState }>({
  data: {
    elements: [],
    connections: [],
    elMap: {},
  },
})

function updateCompState(input: CompState) {
  compState.data = copy(input)
}

function useCompState() {
  const s = useSnapshot(compState)
  return s.data as CompState
}

/*

  COLLAB STATE

*/

type NodeInteractionState = {
  selected: boolean
  editing: boolean
  dragging: null | { x: number; y: number; userId: string }
}

type CollabState = {
  selected: Record<string, string[]>
  editing: Record<string, string[]>
  interactions: Record<string, NodeInteractionState>
}

const collabState = proxy<CollabState>({
  selected: {},
  editing: {},
  interactions: {},
})

function useNodeInteractions(nodeId: string) {
  const s = useSnapshot(collabState) as CollabState
  if (s.interactions[nodeId]) {
    return s.interactions[nodeId]
  }
  return null
}

function useSelected(id: string) {
  const s = useSnapshot(collabState) as CollabState

  if (s.selected[id]) {
    return s.selected[id]
  }

  return null
}

function useEditing(id: string) {
  const s = useSnapshot(collabState) as CollabState

  if (s.editing[id]) {
    return s.editing[id]
  }

  return null
}

function addSelected(id: string, userId: string) {
  if (collabState.selected[id]) {
    if (!collabState.selected[id].includes(userId)) {
      console.log(id, userId)
      collabState.selected[id].push(userId)
    }
  } else {
    collabState.selected[id] = [userId]
  }
}

function addEditing(id: string, userId: string) {
  if (collabState.editing[id]) {
    if (!collabState.editing[id].includes(userId)) {
      collabState.editing[id].push(userId)
    }
  } else {
    collabState.editing[id] = [userId]
  }
}

function removeSelected(id: string, userId: string) {
  if (collabState.selected[id]) {
    if (collabState.selected[id].includes(userId)) {
      collabState.selected[id] = collabState.selected[id].filter(
        (_id) => _id !== userId,
      )
    }
  }
}

function removeEditing(id: string, userId: string) {
  if (collabState.editing[id]) {
    if (collabState.editing[id].includes(userId)) {
      collabState.editing[id] = collabState.editing[id].filter(
        (_id) => _id !== userId,
      )
    }
  }
}

function refreshCollabState(currentUserIds: string[]) {
  const _selected: Record<string, string[]> = {}
  const _editing: Record<string, string[]> = {}

  Object.keys(collabState.selected).forEach((id) => {
    if (collabState.selected[id]) {
      _selected[id] = collabState.selected[id].filter(currentUserIds.includes)
    }
  })
  Object.keys(collabState.editing).forEach((id) => {
    if (collabState.editing[id]) {
      _editing[id] = collabState.editing[id].filter(currentUserIds.includes)
    }
  })

  collabState.selected = _selected
  collabState.editing = _editing
}

function resetCollabState() {
  console.log('resetCollabState')
  collabState.selected = {}
  collabState.editing = {}
}

/*

  USER STATE

*/

type UserState = {
  users: T.User[]
}

function createUser(name: string): T.User {
  const id = `user-${makeId.small()}`
  const color = randColor({
    luminosity: 'bright',
    format: 'hex',
  })

  return {
    id,
    name,
    color,
    cursorPos: undefined,
  }
}

const userState = proxy<UserState>({
  users: [],
})

function useUserState(): T.User[] {
  const s = useSnapshot(userState) as UserState
  return sortItemsBy(copy(s.users), 'name')
}

function useUserById(id: string) {
  const s = useSnapshot(userState) as UserState
  return s.users.find((u) => u.id === id)
}

function storeUser(u: T.User) {
  localStorage.setItem('current-user', JSON.stringify(u))
}

function getCurrentUser(): T.User {
  const u = localStorage.getItem('current-user')

  if (u) {
    return JSON.parse(u) as T.User
  }

  const user = createUser(prompt('First and last name') || 'Anon Imous')
  storeUser(user)

  return user
}

const User = getCurrentUser()

/*

  SETUP

*/

function init() {
  const doc = new Y.Doc()

  const provider = new WebsocketProvider(
    'ws://localhost:1234',
    'yjs-reactflow-test-1',
    doc,
  )
  const ymapComps = doc.getMap('comp-state')
  bind(compState, ymapComps)

  const ymapCollab = doc.getMap('collab-state')
  bind(collabState, ymapCollab)

  const { awareness } = provider

  awareness.on('change', () => {
    const states = awareness.getStates()
    const userList = Array.from(states.entries()).map((s) => s[1].user)
    userState.users = userList.filter((u) => u.id !== User.id)
    refreshCollabState(userList.map((u) => u.id))
  })

  awareness.setLocalStateField('user', User)
}

export const collaboration = {
  currentUser: User,
  state: compState,
  init,
  update: updateCompState,
  use: useCompState,
  userState,
  useUserState,
  useUserById,
  collabState,
  useNodeInteractions,
  useEditing,
  useSelected,
  addEditing,
  addSelected,
  removeEditing,
  removeSelected,
  refreshCollabState,
  resetCollabState,
}