
export interface TreeItem {
    id: string
    name: string
    type: string
    icon: React.ReactNode
    children?: TreeItem[]
    props?: Record<string, any>
    allowsChildren?: boolean
    background?: string
    className?: string
  }
  