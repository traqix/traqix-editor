import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { NodeType } from './types'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  node: NodeType | null
  updateNode: (id: string, updates: Partial<NodeType>) => void
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, node, updateNode }) => {
  if (!node) return null

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNode(node.id, { content: e.target.value })
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(node.options || [])]
    newOptions[index] = value
    updateNode(node.id, { options: newOptions })
  }

  const addOption = () => {
    const newOptions = [...(node.options || []), '']
    updateNode(node.id, { options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = node.options?.filter((_, i) => i !== index)
    updateNode(node.id, { options: newOptions })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Node</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="node-type" className="text-right">
              Type
            </Label>
            <Input id="node-type" value={node.type} className="col-span-3" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="node-content" className="text-right">
              Content
            </Label>
            <Textarea
              id="node-content"
              value={node.content}
              onChange={handleContentChange}
              className="col-span-3"
            />
          </div>
          {node.options && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Options</Label>
              <div className="col-span-3 space-y-2">
                {node.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeOption(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button onClick={addOption}>Add Option</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Modal