import React from 'react'
import { Button } from "@/components/ui/button"
import { Save, Undo, Redo } from 'lucide-react'

interface ToolbarProps {
  onSave: () => void
  onUndo: () => void
  onRedo: () => void
}

export function Toolbar({ onSave, onUndo, onRedo }: ToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-2 flex justify-between items-center">
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={onUndo}>
          <Undo className="h-4 w-4 mr-1" />
          Undo
        </Button>
        <Button variant="outline" size="sm" onClick={onRedo}>
          <Redo className="h-4 w-4 mr-1" />
          Redo
        </Button>
      </div>
      <Button variant="outline" size="sm" onClick={onSave}>
        <Save className="h-4 w-4 mr-1" />
        Save
      </Button>
    </div>
  )
}