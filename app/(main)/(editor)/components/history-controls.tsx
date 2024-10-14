import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, LucideMemoryStick, MemoryStick, MemoryStickIcon, Redo, Undo } from "lucide-react";
import { TreeItem } from "@/app/(main)/(editor)/types";
import { useTree } from "@/components/context/tree-context";
import { EyeClosedIcon, EyeNoneIcon, LockClosedIcon } from "@radix-ui/react-icons";
import FloatingMemoryInspector from "./floating-memory-inspector";

interface HistoryControlsProps {
  currentPage?: string; // Optional prop to allow for page changes
}

export function HistoryControls({
  currentPage = "Home",
}: HistoryControlsProps) {
  const { undo, redo, onTreeChange } = useTree();

  // Escuta as alterações na árvore
  useEffect(() => {
    const handleTreeChange = (updatedItem: TreeItem) => {
      // Se necessário, faça algo com o item atualizado
    };

    const unsubscribe = onTreeChange(handleTreeChange);
    return () => {
      unsubscribe(); // Remove o listener ao desmontar
    };
  }, [onTreeChange]);

  const generateSampleData = () => ({
    count: Math.floor(Math.random() * 100),
    message: "Hello, World!",
    items: ["apple", "banana", "cherry"],
    config: {
      isEnabled: Math.random() > 0.5,
      maxRetries: Math.floor(Math.random() * 5) + 1
    },
    nestedObject: {
      level1: {
        level2: {
          level3: "Deep nested value"
        }
      }
    },
    longArray: Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`),
    timestamp: new Date().toISOString()
  })

  const generateGlobalData = () => ({
    appVersion: "1.0.0",
    userSettings: {
      theme: "dark",
      notifications: true
    },
    sessionInfo: {
      id: "sess_" + Math.random().toString(36).substr(2, 9),
      startTime: new Date().toISOString()
    }
  })

  const [isInspectorOpen, setIsInspectorOpen] = useState(false)
  const [localData, setLocalData] = useState(generateSampleData())
  const [selectedObjectData, setSelectedObjectData] = useState<Record<string, any> | null>(null)
  const [globalData] = useState(generateGlobalData())

  const handleRefresh = useCallback(() => {
    setLocalData(generateSampleData())
  }, [])

  const handleSelectObject = () => {
    setSelectedObjectData({
      selectedItem: localData.items[Math.floor(Math.random() * localData.items.length)],
      selectionTime: new Date().toISOString()
    })
  }


  return (
    <div className="grid gap-2 grid-flow-col justify-stretch">
      <Button
        variant="outline"
        size="icon"
        onClick={undo}
        className="w-9 h-9"
        // O botão de desfazer deve ser desabilitado se não houver mais ações a desfazer
        disabled={false} // Ajuste conforme necessário para controlar o estado
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={redo}
        className="w-9 h-9"
        // O botão de refazer deve ser desabilitado se não houver mais ações a refazer
        disabled={false} // Ajuste conforme necessário para controlar o estado
      >
        <Redo className="h-4 w-4" />
      </Button>
      <FloatingMemoryInspector
        data={localData}
        selectedObjectData={selectedObjectData || undefined}
        globalData={globalData}
        isOpen={isInspectorOpen}
        onToggle={() => setIsInspectorOpen(!isInspectorOpen)}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
