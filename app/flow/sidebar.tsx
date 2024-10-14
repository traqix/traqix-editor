import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

interface SidebarProps {
  selectedNode: any;
  updateNodeData: any;
  closeSidebar: any;  // Function to update nodes
}

export default function Sidebar({ selectedNode, updateNodeData, closeSidebar }: SidebarProps) {
  

  return (
    <div className="w-80 border-l p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Node Settings</h2>
        <Button variant="ghost" size="icon" onClick={closeSidebar}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={selectedNode?.data?.label}
            onChange={(e) => updateNodeData(selectedNode?.id, { label: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            type="color"
            value={selectedNode?.data?.color}
            onChange={(e) => updateNodeData(selectedNode?.id, { color: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="size">Size</Label>
          <Slider
            id="size"
            min={0.5}
            max={2}
            step={0.1}
            value={[selectedNode?.data?.size]}
            onValueChange={(value) => updateNodeData(selectedNode?.id, { size: value[0] })}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="isSpecial"
            checked={selectedNode?.data?.isSpecial}
            onCheckedChange={(checked) => updateNodeData(selectedNode?.id, { isSpecial: checked })}
          />
          <Label htmlFor="isSpecial">Special Node</Label>
        </div>
        <div>
          <Label htmlFor="nodeType">Node Type</Label>
          <Select
            value={selectedNode?.type || 'default'}
            onValueChange={(value) => updateNodeData(selectedNode?.id, { type: value })}
          >
            <SelectTrigger id="nodeType">
              <SelectValue placeholder="Select node type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="input">Input</SelectItem>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="output">Output</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
