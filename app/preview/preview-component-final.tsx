import {
  Dispatch,
  FC,
  SetStateAction,
  useRef,
  useState,
} from "react";
import type { TreeItem } from "@/app/(main)/(editor)/types";
import { convertValueTreeItem } from "@/app/(main)/(editor)/utils/util";
import {
  matchTailwindClassesWidth,
  modifyLayoutClassesChild,
} from "../(main)/(editor)/utils/tailwind";
import { useTree } from "@/components/context/tree-context";
import { useMemory } from "@/components/context/memory-context";
import { renderComponentFinal } from "@/components-editor/render-components-final";

export const PreviewComponentFinal: FC<{
  itemId: string;
  selectedItemId?: string;
  onSelect: (item: TreeItem) => void;
  onMove: (
    draggedId: string,
    targetId: string,
    position: "before" | "after" | "inside"
  ) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TreeItem>) => void;
  addComponent: (component: TreeItem, parentId?: string) => void;
  levelHovered?: number;
  setLevelHovered: Dispatch<SetStateAction<number>>;
  level: number;
}> = ({
  itemId,
  selectedItemId,
  onSelect,
  onMove,
  onRemove,
  onUpdate,
  addComponent,
  levelHovered,
  setLevelHovered,
  level,
}) => {

  const { getTree } = useTree();
  const { getMemory } = useMemory();
  const tree = getTree(itemId)
  const item = convertValueTreeItem(getMemory, tree)

  // const items: TreeItem[] = JSON.parse(JSON.stringify(tree)) as TreeItem[];
  // const item: TreeItem = items[0];
  
  const ref = useRef<HTMLDivElement>(null);

  return (
    renderComponentFinal(
      itemId, 
      selectedItemId, 
      false, 
      ref, 
      item,
      onSelect,
      onMove,
      onRemove,
      onUpdate,
      addComponent,
      levelHovered,
      setLevelHovered,
      level,
      getTree,
    )
  )
};
