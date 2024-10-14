import { useEffect, useRef, useState } from "react";
import type { TreeItem } from "@/app/(main)/(editor)/types";
import { useDrag, useDrop } from "react-dnd";
import { Button } from "@/components/ui/button";
import {
  AArrowDown,
  AArrowUp,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Copy,
  Edit2,
  Move,
  Plus,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  addComponent,
  getAcceptedComponentsTree,
  onDuplicate,
  onMove,
  onMoveChildren,
  onRemove,
  onRename,
} from "../utils/util";
import { componentLibrary } from "./library";
import { useTree } from "@/components/context/tree-context";

export const TreeNode: React.FC<{
  itemId: string;
  parent: TreeItem;
  level: number;
  selectedItemId?: string;
  position: number;
  totalChilds: number;
}> = ({ itemId, parent, level, selectedItemId, position, totalChilds }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const { getTree, setTree, removeTree } = useTree();
  const item: TreeItem = getTree(itemId);

  // useEffect(() => {
  //   console.log("parentparent 1", item)
  //   console.log("parentparent 2", parent)
  // }, [parent])

  const hasChildren = item?.children && item?.children.length > 0;

  const ref = useRef(null);
  const [{ isDragging }, drag, preview] = useDrag({
    type: `TREE_${item?.type?.toUpperCase() ?? "DIV"}`,
    item: { id: item?.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: getAcceptedComponentsTree(
      `TREE_${item?.type?.toUpperCase() ?? "DIV"}`
    ),
    drop: (draggedItem: any, monitor) => {
      console.log("AAAAAA useDrop", draggedItem, item);
      if (draggedItem.id !== item?.id && !monitor.didDrop()) {
        // if (draggedItem.parentId && draggedItem.parentId != item.id) {
        onMove(draggedItem.id, item?.id, "inside", getTree, setTree);
        // }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  const [{ isOverBefore }, dropBefore] = useDrop({
    accept: getAcceptedComponentsTree(
      `TREE_${parent?.type?.toUpperCase() ?? "DIV"}`
    ),
    drop: (draggedItem: any, monitor) => {
      console.log("AAAAAA useDrop", draggedItem, item);
      if (draggedItem.id !== item?.id && !monitor.didDrop()) {
        console.log("AAAAAA BBBBBBBBB", draggedItem, item.id);

        onMove(draggedItem?.id, item?.id, "before", getTree, setTree);
      }
    },
    collect: (monitor) => ({
      isOverBefore: monitor.isOver({ shallow: true }),
    }),
  });

  preview(drop(ref));

  const handleRemove = () => {
    // if (hasChildren) {
    //   // Move children up one level
    //   item?.children?.forEach((child) => {
    //     onMove(child, item?.id, "before", item, setTree);
    //   });
    // }
    console.log("PARENT AAAA", parent.children);
    onRemove(item ?? ({ id: itemId } as TreeItem), parent, setTree, removeTree);
  };

  const handleRename = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newName = formData.get("newName") as string;
    if (newName) {
      onRename(item?.id, newName);
      setIsEditing(false);
    }
  };

  const handleDuplicate = () => {
    onDuplicate(item?.id, item, setTree);
  };

  const handleMoveUp = () => {
    onMoveChildren(item?.id, "up", item, setTree);
  };

  const handleMoveDown = () => {
    onMoveChildren(item?.id, "down", item, setTree);
  };

  function onSelect(item: TreeItem) {
    sendMessageToParent(item);
  }

  const sendMessageToParent = (selectedItemPass: TreeItem | null) => {
    const message = { data: selectedItemPass };
    try {
      window.parent.postMessage(message, "*"); // Envia a mensagem para a página pai
    } catch (e) {
      console.log("err", e);
    }
  };

  // if (item?.id != itemId) {
  //   return <></>
  // }

  return (
    <>
      <div
        ref={drop as unknown as React.LegacyRef<HTMLDivElement>}
        className={cn(
          // "mb-3 last:mb-0",
          `relative z-[${level + 1}] pl-${level == 0 ? 0 : 1.5} ${level == 0 ? "pt-3.5" : ""} ${
            isOver
              ? "bg-tremor-background-emphasis/5 dark:bg-tremor-background-emphasis/95 ring-2"
              : ""
          }`,
          `flex flex-col items-start rounded-lg text-left text-sm transition-all border-[0.5px] border-slate-500/10 dark:border-slate-500/30 px-3 ${
            level != 0 ? "pt-0" : ""
          }`
          // mail.selected === item?.id && "bg-muted",
        )}
      >
        {/* ={parent?.children?.length}={JSON.stringify(item)}==<br />{itemId} */}
        {/* ={itemId}= */}
        {level != 0 && (
          <div
            ref={dropBefore as unknown as React.LegacyRef<HTMLDivElement>}
            className={cn(
              "h-3 w-60 mx-auto bg-red-500/0 border-[0.5px]",
              `relative z-[${level + 2}] pl-${level == 0 ? 0 : 1.5} ${
                isOverBefore
                  ? "bg-tremor-background-emphasis/5 dark:bg-tremor-background-emphasis/95 duration-500 ring-2 h-4 mb-2"
                  : ""
              }`,
              `flex flex-col items-start rounded text-left text-sm transition-all border-[0.5px] border-slate-500/5 dark:border-slate-500/30 px-3 ${
                level != 0 ? "pt-0" : ""
              }`
              // mail.selected === item?.id && "bg-muted",
            )}
          >
            <div className="cursor-pointer opacity-0 hover:opacity-30 flex justify-center items-center hover:bg-muted-foreground rounded-lg h-1.5 my-1 w-[10rem] ml-5">
              <PlusCircle
                className="bg-primary-foreground relative z-10 rounded-full"
                size={16}
              />
            </div>
          </div>
        )}

        {/* class={cn('card cursor-pointer user-select-none', {
          [style.dropZoneActive]: isActive,
          [style.dropZoneDragging]: isDragging
        })} */}

        <div ref={ref}>
          <div
            ref={drag as unknown as React.LegacyRef<HTMLDivElement>}
            className={`${isDragging ? "opacity-50" : ""}`}
          >
            <div
              className={`flex items-center shadow-tremor-card border-[0.5px] dark:border-tremor-background-emphasis/60 p-0.5 px-2 rounded-lg h-8 w-72 ${
                selectedItemId === item?.id
                  ? "bg-slate-200/70 dark:bg-slate-800/70"
                  : ""
              }`}
            >
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-4 h-4"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              )}
              {/* {item?.icon} */}
              {isEditing ? (
                <form onSubmit={handleRename} className="ml-2 flex-1">
                  <Input
                    name="newName"
                    defaultValue={item?.name}
                    className="py-0 px-1 h-6 text-sm"
                  />
                </form>
              ) : (
                <span
                  className="ml-2 cursor-pointer flex-1 font-semibold truncate text-dark-tremor-content-subtle dark:text-tremor-content-subtle"
                  onClick={() => onSelect(item)}
                >
                  {item?.name}
                </span>
              )}
              {level > 0 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-4 h-4"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  {totalChilds > 1 && position < totalChilds - 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-4 h-4"
                      onClick={handleMoveDown}
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                  )}
                  {position > 0 && totalChilds > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-4 h-4"
                      onClick={handleMoveUp}
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-4 h-4"
                    onClick={handleDuplicate}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="w-4 h-4"
                onClick={handleRemove}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
              {level > 0 && (
                <div className="cursor-move">
                  <Move className="w-3 h-3" />
                </div>
              )}
              {item?.allowsChildren && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-4 h-4">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <div className="grid gap-2">
                      {componentLibrary.map((component: any, i: number) => (
                        <Button
                          key={`${component.id}-${i}`}
                          variant="ghost"
                          onClick={() =>
                            addComponent(
                              component,
                              item?.id,
                              "inside",
                              item,
                              setTree
                            )
                          }
                        >
                          {component.name}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            {hasChildren && (
              <>
                {level == 0 ? (
                  <div className="h-3 w-72 bg-orange-500/0" />
                ) : (
                  <div className="h-3 w-72 bg-yellow-500/0">
                    <div className="cursor-pointer opacity-0 hover:opacity-100 flex justify-center items-center hover:bg-muted-foreground rounded-lg h-1.5 my-1 w-[16rem] ml-5">
                      <PlusCircle
                        className="bg-primary-foreground relative z-10 rounded-full"
                        size={16}
                      />
                    </div>
                  </div>
                )}
                <div
                  className={cn(
                    `overflow-hidden transition-all duration-700 p-1`,
                    !isOpen && "max-h-0 hidden animate-accordion-up",
                    isOpen && "max-h-full animate-accordion-down"
                  )}
                >
                  {item?.children?.map((child: string, i: number) => (
                    <TreeNode
                      position={i}
                      totalChilds={item?.children?.length ?? 1}
                      key={`tree-node-child-${itemId}-${i}`}
                      itemId={child}
                      parent={item}
                      level={level + 1}
                      selectedItemId={selectedItemId}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        {level == 0 ? (
          <div className="h-3 w-72 bg-orange-500/0" />
        ) : (
          <div className="h-3 w-72 bg-blue-500/0">
            <div className="cursor-pointer opacity-0 hover:opacity-100 flex justify-center items-center hover:bg-muted-foreground rounded-lg h-1.5 my-1 w-[16rem] ml-5">
              <PlusCircle
                className="bg-primary-foreground relative z-10 rounded-full"
                size={16}
              />
            </div>
          </div>
        )}
      </div>
      <div className="h-3 bg-green-500/0 last:hidden"></div>
    </>
  );
};
