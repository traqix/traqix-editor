import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import LayoutBuilder from "./layout-builder";
import { PickerBackground } from "@/components/picker-background";
import { ScrollArea } from "@/components/ui/scroll-area";

import { TreeItem } from "../types";

interface RightSidebarProps {
  selectedItem: TreeItem | null;
  onUpdate: (id: string, updates: Partial<TreeItem>) => void;
}

interface ComponentOptionsProps {
  selectedItem: TreeItem | null;
  onUpdate: (id: string, updates: Partial<TreeItem>) => void;
}

export const ComponentOptions: React.FC<ComponentOptionsProps> = ({
  selectedItem,
  onUpdate,
}) => {
  const [classes, setClasses] = useState<string[]>([]);
  const [newClass, setNewClass] = useState("");
  const [background, setBackground] = useState("");

  useEffect(() => {
    if (selectedItem?.props?.className) {
      setClasses(selectedItem.props.className.split(" "));
    } else {
      setClasses([]);
    }
  }, [selectedItem]);

  if (!selectedItem) return null;

  const handleChange = (key: string, value: any) => {
    console.log("selectedItem", selectedItem, key);
    onUpdate(selectedItem.id, {
      props: { ...selectedItem.props, [key]: value },
    });
  };

  function handleChangeBackground(background: any) {
    const newClass = `bg-[${background}]`;
    const updatedClasses = [...classes, newClass];
    setClasses(updatedClasses);
    handleChange("background", `${background}`);
    // handleChange('className', updatedClasses.join(' '))
    // handleChange('style', {})
    setNewClass("");
  }

  const handleAddClass = (newClass: string) => {
    if (newClass && !classes.includes(newClass)) {
      const updatedClasses = [...classes, newClass];
      setClasses(updatedClasses);
      handleChange("className", updatedClasses.join(" "));
      setNewClass("");
    }
  };

  const handleRemoveClass = (classToRemove: string) => {
    const updatedClasses = classes.filter((c) => c !== classToRemove);
    setClasses(updatedClasses);
    handleChange("className", updatedClasses.join(" "));
  };

  const colorOptions = [
    "text-primary",
    "text-secondary",
    "text-accent",
    "text-muted",
    "bg-primary",
    "bg-secondary",
    "bg-accent",
    "bg-muted",
  ];

  const fontOptions = [
    "font-sans",
    "font-serif",
    "font-mono",
    "text-xs",
    "text-sm",
    "text-base",
    "text-lg",
    "text-xl",
    "text-2xl",
    "font-light",
    "font-normal",
    "font-medium",
    "font-semibold",
    "font-bold",
  ];

  const roundedOptions = [
    "rounded-none",
    "rounded-sm",
    "rounded",
    "rounded-md",
    "rounded-lg",
    "rounded-xl",
    "rounded-2xl",
    "rounded-full",
  ];

  const layoutOptions = [
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "space-x-2",
    "space-y-2",
    "grid",
    "grid-cols-2",
    "grid-cols-3",
    "gap-2",
    "gap-4",
  ];

  const commonOptions = [
    "p-2",
    "p-4",
    "p-6",
    "m-2",
    "m-4",
    "m-6",
    "w-full",
    "h-full",
    "shadow",
    "shadow-md",
    "shadow-lg",
  ];

  const mutuallyExclusiveClasses = ["flex", "grid", "block", "hidden"];

  const renderClassOptions = (options: string[], title: string) => (
    <div className="space-y-2">
      <Label>{title}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isMutuallyExclusive = mutuallyExclusiveClasses.includes(option);
          const isActive = classes.includes(option);
          const isDisabled =
            isMutuallyExclusive &&
            classes.some(
              (cls) => mutuallyExclusiveClasses.includes(cls) && cls !== option
            );

          return (
            <Button
              key={option}
              variant={isActive ? "secondary" : "outline"}
              size="sm"
              onClick={() =>
                isActive ? handleRemoveClass(option) : handleAddClass(option)
              }
              disabled={isDisabled}
              className={isDisabled ? "opacity-50 cursor-not-allowed" : ""}
            >
              {option}
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">{selectedItem.name} Options</h3>

      <Tabs defaultValue="classes">
        <TabsList>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          {(selectedItem.type === "div" || selectedItem.type === "section") && (
            <TabsTrigger value="layout">Layout</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="classes">
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newClass}
                onChange={(e) => setNewClass(e.target.value)}
                placeholder="Add custom class"
              />
              <Button onClick={() => handleAddClass(newClass)}>Add</Button>
            </div>

            <div className="space-y-2">
              <Label>Applied Classes</Label>
              <div className="flex flex-wrap gap-2">
                {classes.map((cls) => (
                  <Button
                    key={cls}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRemoveClass(cls)}
                  >
                    {cls}
                    <X className="w-4 h-4 ml-2" />
                  </Button>
                ))}
              </div>
            </div>

            {renderClassOptions(colorOptions, "Colors")}
            {renderClassOptions(fontOptions, "Fonts")}
            {renderClassOptions(roundedOptions, "Rounded Edges")}
            {renderClassOptions(commonOptions, "Common Options")}
          </div>
        </TabsContent>

        <TabsContent value="content">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Input
                id="content"
                value={selectedItem.content || ""}
                onChange={(e) => handleChange("content", e.target.value)}
              />
            </div>
            {selectedItem.type === "input" && (
              <div className="space-y-2">
                <Label htmlFor="placeholder">Placeholder</Label>
                <Input
                  id="placeholder"
                  value={selectedItem.props?.placeholder || ""}
                  onChange={(e) => handleChange("placeholder", e.target.value)}
                />
              </div>
            )}
          </div>
        </TabsContent>

        {(selectedItem.type === "div" || selectedItem.type === "section") && (
          <TabsContent value="layout">
            <PickerBackground
              background={background}
              setBackground={handleChangeBackground}
            />
            <LayoutBuilder
              classes={classes}
              handleRemoveClass={handleRemoveClass}
              handleAddClass={handleAddClass}
            />
            {renderClassOptions(layoutOptions, "Layout Options")}
          </TabsContent>
        )}
      </Tabs>

      {selectedItem.type === "button" && (
        <div className="space-y-2">
          <Label htmlFor="variant">Button Variant</Label>
          <Select onValueChange={(value) => handleChange("variant", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select variant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="ghost">Ghost</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedItem.type === "input" && (
        <div className="space-y-2">
          <Label htmlFor="type">Input Type</Label>
          <Select onValueChange={(value) => handleChange("type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select input type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="password">Password</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="number">Number</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

const RightSidebar: React.FC<RightSidebarProps> = ({
  selectedItem,
  onUpdate,
}) => {
  return (
    <aside className="w-96 p-4 py-0 overflow-y-auto">
      <div className="space-y-2 p-4 pt-2 rounded-xl border-[0.5px] dark:border-gray-800">
        <h2 className="text-lg font-semibold mb-4">Component Options</h2>
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <ComponentOptions selectedItem={selectedItem} onUpdate={onUpdate} />
        </ScrollArea>
      </div>
    </aside>
  );
};

export default RightSidebar;
