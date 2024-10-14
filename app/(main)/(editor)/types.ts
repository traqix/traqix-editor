export interface Tree {
  id: string;
  parentId?: string;
  name: string;
  type: string;
  icon?: React.ReactNode;
  props?: Record<string, any>;
  allowsChildren?: boolean;
  background?: string;
  className?: string;
}

export interface TreeItem extends Tree {
  lastUpdate: number;
  children?: string[];
}

export interface TreeFull extends Tree {
  children?: TreeFull[];
}

export type Position = "before" | "after" | "inside";
