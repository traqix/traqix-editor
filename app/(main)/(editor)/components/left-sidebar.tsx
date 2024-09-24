import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  File,
  Move,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TreeItem } from "../types";
import { Label } from "@/components/ui/label";

interface LeftSidebarProps {
  tree: TreeItem[];
  componentLibrary: TreeItem[];
  onSelect: (item: TreeItem) => void;
  onMove: (draggedId: string, targetId: string) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  selectedItemId: string | null;
  addComponent: (component: TreeItem, parentId?: string) => void;
  pages: string[];
  currentPage: string;
  onAddPage: (pageName: string) => void;
  onSelectPage: (pageName: string) => void;
}

const TreeNode: React.FC<{
  item: TreeItem;
  onSelect: (item: TreeItem) => void;
  onMove: (
    draggedId: string,
    targetId: string,
    position: "before" | "after" | "inside"
  ) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  selectedItemId: string | null;
  level: number;
  addComponent: (component: Partial<TreeItem>, parentId?: string) => void;
  componentLibrary: TreeItem[];
}> = ({
  item,
  onSelect,
  onMove,
  onRemove,
  onRename,
  selectedItemId,
  level,
  addComponent,
  componentLibrary,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const [{ isDragging }, drag] = useDrag({
    type: "TREE_ITEM",
    item: { id: item.id, type: item.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "TREE_ITEM",
    drop: (draggedItem: { id: string }, monitor) => {
      if (draggedItem.id !== item.id && !monitor.didDrop()) {
        onMove(draggedItem.id, item.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleRemove = () => {
    if (hasChildren) {
      // Move children up one level
      item.children?.forEach((child) => {
        onMove(child.id, item.id, "before");
      });
    }
    onRemove(item.id);
  };

  const handleRename = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newName = formData.get("newName") as string;
    if (newName) {
      onRename(item.id, newName);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={drop}
      className={`ml-${level == 0 ? 0 : 1.5} ${isOver ? "bg-blue-100" : ""}`}
    >
      <div
        ref={drag}
        className={`ml-${level == 0 ? 0 : 1.5} ${isDragging ? "opacity-50" : ""}`}
      >
        <div
          className={`flex items-center bg-muted border-[0.5px] dark:border-gray-800 p-0.5 px-2 mb-3.5 rounded-xl w-80 ${
            selectedItemId === item.id ? "bg-gray-200 dark:bg-gray-900" : ""
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
          {/* {item.icon} */}
          {isEditing ? (
            <form onSubmit={handleRename} className="ml-2 flex-1">
              <Input
                name="newName"
                defaultValue={item.name}
                className="py-0 px-1 h-6 text-sm"
              />
            </form>
          ) : (
            <span
              className="ml-2 cursor-pointer flex-1 font-semibold text-muted-foreground text-md"
              onClick={() => onSelect(item)}
            >
              {item.name}
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
          {item.allowsChildren && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="w-4 h-4">
                  <Plus className="w-3 h-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="grid gap-2">
                  {componentLibrary.map((component) => (
                    <Button
                      key={component.id}
                      variant="ghost"
                      onClick={() => addComponent(component, item.id)}
                    >
                      {component.name}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        {isOpen && hasChildren && (
          <>
            {item.children!.map((child) => (
              <TreeNode
                key={child.id}
                item={child}
                onSelect={onSelect}
                onMove={onMove}
                onRemove={onRemove}
                onRename={onRename}
                selectedItemId={selectedItemId}
                level={level + 1}
                addComponent={addComponent}
                componentLibrary={componentLibrary}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  tree,
  componentLibrary,
  onSelect,
  onMove,
  onRemove,
  onRename,
  selectedItemId,
  addComponent,
  pages,
  currentPage,
  onAddPage,
  onSelectPage,
}) => {
  const [newPageName, setNewPageName] = useState("");

  const handleAddPage = () => {
    if (newPageName) {
      onAddPage(newPageName);
      setNewPageName("");
    }
  };

  return (
    <aside className="w-96 p-4 pt-0 space-y-4 border-r border-gray-200 dark:border-gray-800">
      <div className="space-y-2 p-4 pt-2 bg-slate-100 dark:bg-slate-900 rounded-xl border-[0.5px] dark:border-gray-800">
        <Label>Pages</Label>
        <Select value={currentPage} onValueChange={onSelectPage}>
          <SelectTrigger>
            <SelectValue placeholder="Select a page" />
          </SelectTrigger>
          <SelectContent>
            {pages.map((page) => (
              <SelectItem key={page} value={page}>
                {page}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex space-x-2">
          <Input
            placeholder="New page name"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
          />
          <Button onClick={handleAddPage}>Add</Button>
        </div>
      </div>
      <Tabs defaultValue="layers">
        <TabsList className="w-full">
          <TabsTrigger value="layers" className="flex-1">
            Layers
          </TabsTrigger>
          <TabsTrigger value="components" className="flex-1">
            Components
          </TabsTrigger>
        </TabsList>
        <TabsContent value="layers">
          <ScrollArea className="h-[calc(100vh-19rem)]">
            {tree.map((item) => (
              <TreeNode
                key={item.id}
                item={item}
                onSelect={onSelect}
                onMove={onMove}
                onRemove={onRemove}
                onRename={onRename}
                selectedItemId={selectedItemId}
                level={0}
                addComponent={addComponent}
                componentLibrary={componentLibrary}
              />
            ))}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="components">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="grid grid-cols-2 gap-2">
              {componentLibrary.map((component) => {
                component.id = null;
                const [{ isDragging }, drag] = useDrag({
                  type: "NEW_COMPONENT",
                  item: { ...component },
                  collect: (monitor) => ({
                    isDragging: monitor.isDragging(),
                  }),
                });

                return (
                  <div
                    key={component.id}
                    ref={drag}
                    className={`cursor-move ${isDragging ? "opacity-50" : ""}`}
                  >
                    <Button
                      variant="outline"
                      className="h-20 w-full flex flex-col items-center justify-center"
                    >
                      {component.icon}
                      <span className="mt-2 text-xs">{component.name}</span>
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  );
};

export default LeftSidebar;
