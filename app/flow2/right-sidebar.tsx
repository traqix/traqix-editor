import React from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { NodeType } from './types'

interface RightSidebarProps {
  selectedNode: NodeType | null
  updateNode: (id: string, updates: Partial<NodeType>) => void
}

const RightSidebar: React.FC<RightSidebarProps> = ({ selectedNode, updateNode }) => {
  if (!selectedNode) {
    return (
      <div className="w-64 bg-muted p-4 border-l">
        <h2 className="text-lg font-semibold mb-4">Properties</h2>
        <p className="text-sm text-muted-foreground">Select a node to view its properties</p>
      </div>
    )
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNode(selectedNode.id, { content: e.target.value })
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(selectedNode.options || [])]
    newOptions[index] = value
    updateNode(selectedNode.id, { options: newOptions })
  }

  const addOption = () => {
    const newOptions = [...(selectedNode.options || []), '']
    updateNode(selectedNode.id, { options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = selectedNode.options?.filter((_, i) => i !== index)
    updateNode(selectedNode.id, { options: newOptions })
  }

  return (
    <div className="w-64 bg-muted p-4 border-l">
      <h2 className="text-lg font-semibold mb-4">Properties</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Node Type</Label>
          <Input value={selectedNode.type} readOnly />
        </div>
        <div className="space-y-2">
          <Label>Content</Label>
          <Textarea value={selectedNode.content} onChange={handleContentChange} />
        </div>
        {selectedNode.options && (
          <div className="space-y-2">
            <Label>Options</Label>
            {selectedNode.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                <Button variant="ghost" size="icon" onClick={() => removeOption(index)}>
                  X
                </Button>
              </div>
            ))}
            <Button onClick={addOption}>Add Option</Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RightSidebar