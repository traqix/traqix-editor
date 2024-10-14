import React from 'react'
import { NodeData } from './FlowDiagram'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

interface SidebarProps {
  selectedNode: NodeData | null
  updateNode: (id: string, data: Partial<NodeData['data']>) => void
  onClose: () => void
}

export function Sidebar({ selectedNode, updateNode, onClose }: SidebarProps) {
  if (!selectedNode) {
    return null
  }

  const handleInputChange = (key: string, value: string) => {
    updateNode(selectedNode.id, { [key]: value })
  }

  return (
    <div className="w-64 bg-white p-4 shadow-lg overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Node Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="nodeLabel">Label</Label>
          <Input
            id="nodeLabel"
            value={selectedNode.data.label}
            onChange={(e) => handleInputChange('label', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="nodeType">Type</Label>
          <Input
            id="nodeType"
            value={selectedNode.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
          />
        </div>
        <div>
          <Label>Inputs</Label>
          {selectedNode.data.inputs.map((input, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <Input
                value={input}
                onChange={(e) => {
                  const newInputs = [...selectedNode.data.inputs]
                  newInputs[index] = e.target.value
                  updateNode(selectedNode.id, { inputs: newInputs })
                }}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const newInputs = selectedNode.data.inputs.filter((_, i) => i !== index)
                  updateNode(selectedNode.id, { inputs: newInputs })
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => {
              const newInputs = [...selectedNode.data.inputs, '']
              updateNode(selectedNode.id, { inputs: newInputs })
            }}
          >
            Add Input
          </Button>
        </div>
        <div>
          <Label>Outputs</Label>
          {selectedNode.data.outputs.map((output, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <Input
                value={output}
                onChange={(e) => {
                  const newOutputs = [...selectedNode.data.outputs]
                  newOutputs[index] = e.target.value
                  updateNode(selectedNode.id, { outputs: newOutputs })
                }}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const newOutputs = selectedNode.data.outputs.filter((_, i) => i !== index)
                  updateNode(selectedNode.id, { outputs: newOutputs })
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => {
              const newOutputs = [...selectedNode.data.outputs, '']
              updateNode(selectedNode.id, { outputs: newOutputs })
            }}
          >
            Add Output
          </Button>
        </div>
      </div>
    </div>
  )
}