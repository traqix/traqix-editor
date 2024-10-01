import { useState } from "react";
import type { TreeItem } from "@/app/(main)/(editor)/types";
import { useDrag, useDrop } from "react-dnd";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
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
  onMove,
  onRemove,
  onRename,
} from "../utils/util";

export const TreeNode: React.FC<{
  item: TreeItem;
  level: number;
}> = ({ item, level }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const hasChildren = item?.children && item?.children.length > 0;

  const componentLibrary: any[] = [];
  const selectedItemId = null;

  const [{ isDragging }, drag] = useDrag({
    type: `TREE_${item?.type?.toUpperCase() ?? "DIV"}`,
    item: { id: item?.id, type: item?.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: getAcceptedComponentsTree(
      `TREE_${item?.type?.toUpperCase() ?? "DIV"}`
    ),
    drop: (draggedItem: { id: string }, monitor) => {
      if (draggedItem.id !== item?.id && !monitor.didDrop()) {
        onMove(draggedItem.id, item?.id, "inside");
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleRemove = () => {
    if (hasChildren) {
      // Move children up one level
      item?.children?.forEach((child) => {
        onMove(child.id, item?.id, "before");
      });
    }
    onRemove(item?.id);
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

  function onSelect(item: TreeItem) {
    sendMessageToParent(item);
  }

  const sendMessageToParent = (selectedItemPass: TreeItem | null) => {
    const message = { data: selectedItemPass };
    window.parent.postMessage(message, "*"); // Envia a mensagem para a página pai
  };

  return (
    <div
      ref={drop as unknown as React.LegacyRef<HTMLDivElement>}
      className={cn(
        `relative z-[${level}] ml-${level == 0 ? 0 : 1.5} ${isOver ? "bg-blue-100" : ""}`,
        "flex flex-col items-start rounded-lg text-left text-sm transition-all"
        // mail.selected === item?.id && "bg-muted",
      )}
    >
      <div className="cursor-pointer opacity-0 hover:opacity-100 flex justify-center items-center hover:bg-muted-foreground rounded-lg h-1.5 my-1 w-[16rem] ml-5">
        <PlusCircle
          className="bg-primary-foreground relative z-10 rounded-full"
          size={16}
        />
      </div>
      <div
        ref={drag as unknown as React.LegacyRef<HTMLDivElement>}
        className={`ml-${level == 0 ? 0 : 1.5} ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        <div
          className={`flex items-center border-[0.5px] dark:border-tremor-background-emphasis/60 p-0.5 px-2 rounded-lg h-8 w-72 ${
            selectedItemId === item?.id
              ? "bg-gray-200/5 dark:bg-gray-900/5"
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
              className="ml-2 cursor-pointer flex-1 font-semibold"
              onClick={() => onSelect(item)}
            >
              {item?.name}
            </span>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="w-4 h-4"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-4 h-4"
            onClick={handleRemove}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
          <div className="cursor-move">
            <Move className="w-3 h-3" />
          </div>
          {item?.allowsChildren && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="w-4 h-4">
                  <Plus className="w-3 h-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="grid gap-2">
                  {componentLibrary.map((component: any) => (
                    <Button
                      key={component.id}
                      variant="ghost"
                      onClick={() => addComponent(component, item?.id)}
                    >
                      {component.name}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        {isOpen &&
          hasChildren &&
          item?.children?.map((child: TreeItem, i: number) => (
            <TreeNode
              key={`preview-child-${item.id}-${i}`}
              item={child}
              level={level + 1}
            />
          ))}
      </div>
    </div>
  );
};
