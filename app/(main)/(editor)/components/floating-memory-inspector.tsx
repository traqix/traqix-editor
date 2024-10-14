"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2, RefreshCw, ChevronDown, ChevronUp, MemoryStickIcon } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EyeNoneIcon } from '@radix-ui/react-icons'

type DataType = number | string | object | any[]

interface MemoryBlock {
  [key: string]: DataType
}

interface FloatingMemoryInspectorProps {
  data: MemoryBlock
  selectedObjectData?: MemoryBlock
  globalData?: MemoryBlock
  isOpen: boolean
  onToggle: () => void
  onRefresh?: () => void
}

const FloatingMemoryInspector: React.FC<FloatingMemoryInspectorProps> = ({ 
  data, 
  selectedObjectData, 
  globalData, 
  isOpen, 
  onToggle, 
  onRefresh 
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isMinimized, setIsMinimized] = useState(false)
  const [height, setHeight] = useState(480)
  const [isResizing, setIsResizing] = useState(false)
  const [size, setSize] = useState({ width: 320, height: 200 });
  const [activeTab, setActiveTab] = useState("local")

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onToggle()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onToggle])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newHeight = e.clientY - (position.y + 40)
        setHeight(Math.max(200, newHeight))
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, position.y])


  const handleResizeStart = (e: { stopPropagation: () => void }) => {
    e.stopPropagation(); // Evitar que o arrasto seja ativado
    setIsResizing(true);
    
    // Adicionar eventos de redimensionamento globalmente
    window.addEventListener('mousemove', handleResize);
    window.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResize = (e: { movementY: number }) => {
    if (isResizing) {
      setSize((prevSize) => ({
        width: prevSize.width,
        height: prevSize.height + e.movementY,
      }));
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    
    // Remover eventos globais após o redimensionamento
    window.removeEventListener('mousemove', handleResize);
    window.removeEventListener('mouseup', handleResizeEnd);
  };

  const getDataTypeColor = (value: DataType): string => {
    if (typeof value === 'number') return 'bg-blue-500'
    if (typeof value === 'string') return 'bg-green-500'
    if (Array.isArray(value)) return 'bg-yellow-500'
    if (typeof value === 'object') return 'bg-purple-500'
    return 'bg-gray-500'
  }

  const renderValue = (value: DataType): JSX.Element => {
    if (typeof value === 'number' || typeof value === 'string') {
      return <span className="font-mono">{JSON.stringify(value)}</span>
    }
    return (
      <pre className="font-mono text-xs overflow-auto max-h-40 bg-gray-100 dark:bg-gray-700 p-2 rounded">
        {JSON.stringify(value, null, 2)}
      </pre>
    )
  }

  const renderMemoryContent = (memoryData: MemoryBlock) => (
    <ScrollArea className="pr-4" style={{ height: isMinimized ? '0' : `${height - 120}px` }}>
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(memoryData).map(([key, value], index) => (
          <AccordionItem value={`item-${index}`} key={key}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <span>{key}</span>
                <Badge variant="secondary" className={`${getDataTypeColor(value)}`}>
                  {Array.isArray(value) ? 'Array' : typeof value}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {renderValue(value)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  )

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <TooltipProvider>
            <motion.div
              drag={!isResizing}
              dragMomentum={false}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                x: position.x, 
                y: position.y,
                height: isMinimized ? 40 : height
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              onDragEnd={(_, info) => {
                console.log("INFO", info);
                const newX = position.x + info.offset.x;
                const newY = position.y + info.offset.y;
                if (!isResizing) {
                  setPosition({ x: newX, y: newY });
                }
              }}
              className={`fixed top-20 right-20 w-96 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 overflow-hidden border border-gray-200 dark:border-gray-700`}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Card className="h-full">
                <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isMinimized ? 'p-0 px-4' : ''} pb-2`}>
                  <CardTitle className="text-lg font-semibold">Memory Inspector</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setIsMinimized(!isMinimized)}>
                          {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isMinimized ? 'Maximize' : 'Minimize'}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={onRefresh}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Refresh Data</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={onToggle}>
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Close</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                {!isMinimized && (
                  <CardContent className='p-0 px-6'>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="local">Local</TabsTrigger>
                        <TabsTrigger value="selected">Selected Object</TabsTrigger>
                        <TabsTrigger value="global">Global</TabsTrigger>
                      </TabsList>
                      <TabsContent value="local">
                        <div className='pl-2'>
                          {renderMemoryContent(data)}
                        </div>
                      </TabsContent>
                      <TabsContent value="selected">
                        {selectedObjectData ? renderMemoryContent(selectedObjectData) : <p>No object selected</p>}
                      </TabsContent>
                      <TabsContent value="global">
                        {globalData ? renderMemoryContent(globalData) : <p>Global data not available</p>}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                )}
                {!isMinimized && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-4 bg-gray-200 dark:bg-gray-700 cursor-ns-resize flex items-center justify-center"
                    onMouseDown={handleResizeStart}
                  >
                    <ChevronUp className="h-3 w-3" />
                    <ChevronDown className="h-3 w-3" />
                  </div>
                )}
              </Card>
            </motion.div>
          </TooltipProvider>
        )}
      </AnimatePresence>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* <Button
            onClick={onToggle}
            className="fixed top-1/2 right-0 transform -translate-y-1/2 rounded-l-md shadow-md z-50"
            size="icon"
            variant="default"
          >
            {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button> */ }
          <Button
            variant="outline"
            className="w-9 h-9"
            size="icon"
            onClick={onToggle}
          >
            { isOpen ? <EyeNoneIcon className="h-4 w-4" /> : <MemoryStickIcon className="h-4 w-4" /> }
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{isOpen ? 'Close' : 'Open'} Memory Inspector</p>
        </TooltipContent>
      </Tooltip>
    </>
  )
}

export default FloatingMemoryInspector