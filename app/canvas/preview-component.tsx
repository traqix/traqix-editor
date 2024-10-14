import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Move,
} from "lucide-react";
import {
  Dispatch,
  FC,
  LegacyRef,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { useDrag, useDrop } from "react-dnd";
import type { TreeItem } from "@/app/(main)/(editor)/types";
import { Button } from "@/components/ui/button";
import { convertValueTreeItem, getAcceptedComponents } from "@/app/(main)/(editor)/utils/util";
import {
  matchTailwindClassesWidth,
  modifyLayoutClassesChild,
} from "../(main)/(editor)/utils/tailwind";
import { useTree } from "@/components/context/tree-context";
import { renderComponent } from "@/components-editor/render-components";
import { useMemory } from "@/components/context/memory-context";

export const PreviewComponent: FC<{
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
  
  const [isHovered, setIsHovered] = useState(false);

  const [{ isDragging }, drag, preview] = useDrag({
    type: `${item?.type?.toUpperCase() ?? "DIV"}`,
    item: { id: item?.id, type: item?.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: getAcceptedComponents(`${item?.type?.toUpperCase() ?? "DIV"}`),
    drop: (droppedItem: { id?: string; type: string }, monitor) => {
      if (!monitor.didDrop()) {
        const clientOffset = monitor.getClientOffset();
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        if (clientOffset && hoverBoundingRect) {
          const hoverMiddleY =
            (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
          const hoverClientY = clientOffset.y - hoverBoundingRect.top;
          if (droppedItem.id) {
            if (hoverClientY < hoverMiddleY) {
              onMove(droppedItem.id, item.id, "before");
            } else if (hoverClientY > hoverMiddleY) {
              onMove(droppedItem.id, item.id, "after");
            }
          } else {
            addComponent(
              {
                type: droppedItem.type,
                props: { content: `New ${droppedItem.type}` },
                id:
                  Date.now().toString() +
                  Math.random().toString(36).substr(2, 9),
                name: `New ${droppedItem.type}`,
              },
              item.id
            );
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  const ref = useRef<HTMLDivElement>(null);
  drag(drop(ref));

  // const handleContentChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   onUpdate(item.id, { content: e.target.value })
  // }

  // const handleClassChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   onUpdate(item.id, { props: { ...item.props, className: e.target.value } })
  // }

  // const handleBackgroundChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   onUpdate(item.id, { props: { ...item.props, style: { background: e.target.value } } })
  // }


  const { parentClasses } = modifyLayoutClassesChild(
    item?.props?.className ?? ""
  );

  // const containsColSpan = item?.props?.className?.includes("col-span-2")
  //   ? "col-span-2"
  //   : "";

  const setHovered = (hovered: boolean, level: number) => {
    setIsHovered(hovered);
    setLevelHovered(level);
  };

  const matchesWidth = matchTailwindClassesWidth(item?.props?.className ?? '')
  if (matchesWidth.length) {
    let add = true
    matchesWidth.map((el) => {
      if (el.startsWith('w-')) {
        add = false
      }
    })

    if (add) {
      parentClasses.push('w-full')
    }
  }

  if (item?.type.toLowerCase() === 'avatarfallback') {
    parentClasses.push('w-full')
  }

  return (
    <motion.div
      className={`relative2 group mml-${level * 1} ${parentClasses.join(" ")} ${
        parentClasses.includes("container") ? "mx-autoo" : ""
      }`}
      onMouseEnter={() => setHovered(true, level)}
      onMouseLeave={() => setHovered(false, level - 1)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-full h-full" draggable="true">
        {renderComponent(
          itemId, 
          selectedItemId, 
          isOver, 
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
        )}
      </div>
      <AnimatePresence>
        {isHovered && levelHovered == level && (
          <motion.div
            className="absolute top-0.5 right-0.5 flex space-x-1 p-1 bg-orange-200 dark:bg-orange-800 rounded-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              zIndex: level + 2000,
              display: "relative",
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.1 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6"
              onClick={(e) => {
                e.stopPropagation();
                addComponent(
                  {
                    type: "div",
                    props: { content: "New Component" },
                    id: "",
                    name: "",
                  },
                  item.id
                );
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <div
              className="cursor-move"
              ref={drag as unknown as LegacyRef<HTMLDivElement>}
            >
              <Button variant="ghost" size="icon" className="w-6 h-6">
                <Move className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* {selectedItemId === item.id && (
          <div className="mt-2 space-y-2">
            <Label>Content</Label>
            <Input value={item?.props?.content} onChange={handleContentChange} />
            <Label>Classes</Label>
            <Input value={item?.props?.className || ''} onChange={handleClassChange} />
          </div>
        )} */}
    </motion.div>
  );
};
