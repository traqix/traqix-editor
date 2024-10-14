"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Mic, MicOff, Video, VideoOff, Monitor, Phone, MoreVertical, Search, UserPlus, X, Settings, MessageSquare, Hand, Smile, Layout, Move, PanelLeftOpen, Maximize, Tv, Cube, Shield, Users, Share2, VolumeX, Volume2, Edit3, Zap, UserMinus, Coffee, PenTool, Eraser, Download, Upload } from 'lucide-react'

const participants = [
  { id: 1, name: "Amy Lui", role: "Meeting host", color: "bg-pink-200" },
  { id: 2, name: "Joe Carlson", role: "Companion mode", color: "bg-blue-200" },
  { id: 3, name: "Erin Kirkpatrick", role: "Co-host", color: "bg-green-200" },
  { id: 4, name: "No Cow On The Ice", role: "", color: "bg-yellow-200" },
  { id: 5, name: "Alexander Pitt", role: "", color: "bg-purple-200" },
]

const displayModes = [
  { id: 'grid', name: 'Grid View', icon: Layout },
  { id: 'spotlight', name: 'Spotlight', icon: Maximize },
  { id: 'sidebar', name: 'Sidebar', icon: PanelLeftOpen },
  { id: 'presentation', name: 'Presentation', icon: Tv },
  { id: 'immersive', name: 'Immersive', icon: Cube },
]

const backgroundOptions = [
  { id: 'gradient', name: 'Gradient' },
  { id: 'particles', name: 'Particles' },
  { id: 'waves', name: 'Waves' },
  { id: 'geometric', name: 'Geometric' },
  { id: 'custom', name: 'Custom Upload' },
]

const themeColors = [
  { id: 'pink', name: 'Pink', value: '#FFC0CB', secondary: '#FF69B4' },
  { id: 'blue', name: 'Blue', value: '#ADD8E6', secondary: '#4169E1' },
  { id: 'green', name: 'Green', value: '#90EE90', secondary: '#32CD32' },
  { id: 'yellow', name: 'Yellow', value: '#FFFFE0', secondary: '#FFD700' },
  { id: 'purple', name: 'Purple', value: '#E6E6FA', secondary: '#8A2BE2' },
]

export default function Component() {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isRaiseHand, setIsRaiseHand] = useState(false)
  const [displayMode, setDisplayMode] = useState('grid')
  const [chatOpen, setChatOpen] = useState(false)
  const [chatPosition, setChatPosition] = useState('floating')
  const [isSecurityEnabled, setIsSecurityEnabled] = useState(true)
  const [volume, setVolume] = useState(50)
  const [selectedParticipant, setSelectedParticipant] = useState(null)
  const [background, setBackground] = useState('gradient')
  const [themeColor, setThemeColor] = useState('pink')
  const [isDrawingMode, setIsDrawingMode] = useState(false)
  const [drawingTool, setDrawingTool] = useState('pen')
  const [lineWidth, setLineWidth] = useState(2)
  const [isBreakoutRoom, setIsBreakoutRoom] = useState(false)
  const canvasRef = useRef(null)
  const [drawings, setDrawings] = useState([])
  const [participantList, setParticipantList] = useState(participants)

  const controls = useAnimation()

  useEffect(() => {
    if (isDrawingMode && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      let isDrawing = false
      let lastX = 0
      let lastY = 0

      const startDrawing = (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY]
      }

      const draw = (e) => {
        if (!isDrawing) return
        ctx.beginPath()
        ctx.moveTo(lastX, lastY)
        ctx.lineTo(e.offsetX, e.offsetY)
        ctx.strokeStyle = themeColors.find(color => color.id === themeColor).secondary
        ctx.lineWidth = lineWidth
        ctx.lineCap = 'round'
        if (drawingTool === 'eraser') {
          ctx.globalCompositeOperation = 'destination-out'
        } else {
          ctx.globalCompositeOperation = 'source-over'
        }
        ctx.stroke()
        ;[lastX, lastY] = [e.offsetX, e.offsetY]
      }

      const stopDrawing = () => {
        if (isDrawing) {
          isDrawing = false
          setDrawings([...drawings, canvas.toDataURL()])
        }
      }

      canvas.addEventListener('mousedown', startDrawing)
      canvas.addEventListener('mousemove', draw)
      canvas.addEventListener('mouseup', stopDrawing)
      canvas.addEventListener('mouseout', stopDrawing)

      return () => {
        canvas.removeEventListener('mousedown', startDrawing)
        canvas.removeEventListener('mousemove', draw)
        canvas.removeEventListener('mouseup', stopDrawing)
        canvas.removeEventListener('mouseout', stopDrawing)
      }
    }
  }, [isDrawingMode, drawings, themeColor, drawingTool, lineWidth])

  const renderParticipants = () => {
    const participantClass = {
      grid: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
      spotlight: "flex flex-col space-y-4",
      sidebar: "flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4",
      presentation: "flex flex-col space-y-4",
      immersive: "relative aspect-video",
    }[displayMode]

    return (
      <div className={participantClass}>
        <AnimatePresence>
          {participantList.map((participant, index) => (
            <motion.div
              key={participant.id}
              layoutId={`participant-${participant.id}`}
              className={`aspect-video bg-white rounded-lg overflow-hidden shadow-lg ${displayMode === 'immersive' ? 'absolute' : ''} ${selectedParticipant === participant.id ? 'z-10 ring-4' : ''}`}
              style={displayMode === 'immersive' ? { top: `${(index * 20)}%`, left: `${(index * 20)}%`, zIndex: participantList.length - index } : {}}
              onClick={() => setSelectedParticipant(selectedParticipant === participant.id ? null : participant.id)}
              animate={controls}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className={`w-full h-full flex items-center justify-center ${participant.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-20"></div>
                <div className="relative z-10 text-4xl font-bold text-gray-800">{participant.name.charAt(0)}</div>
                <div className="absolute bottom-2 left-2 text-xs text-gray-800 font-semibold">{participant.name}</div>
                <div className="absolute top-2 right-2 flex space-x-1">
                  {!isMuted && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                  {isVideoOn && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                  {isRaiseHand && <div className="w-2 h-2 rounded-full bg-yellow-500"></div>}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )
  }

  const renderChat = () => {
    if (!chatOpen) return null

    const chatClass = {
      floating: "fixed bottom-20 right-4 w-80 h-96 bg-white border rounded-lg shadow-lg overflow-hidden",
      bottom: "fixed bottom-0 left-0 right-0 h-1/3 bg-white border-t",
      side: "fixed top-0 right-0 w-80 h-full bg-white border-l",
      top: "fixed top-0 left-0 right-0 h-1/3 bg-white border-b",
    }[chatPosition]

    return (
      <motion.div
        className={chatClass}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Tabs defaultValue="chat" className="h-full flex flex-col">
          <div className="flex justify-between items-center p-2 border-b">
            <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="icon" onClick={() => setChatOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <TabsContent value="chat" className="flex-grow overflow-hidden flex flex-col">
            <ScrollArea className="flex-grow">
              {/* Chat messages would go here */}
            </ScrollArea>
            <div className="p-2 border-t">
              <form className="flex space-x-2" onSubmit={(e) => e.preventDefault()}>
                <Input placeholder="Type a message..." />
                <Button type="submit">Send</Button>
              </form>
            </div>
          </TabsContent>
          <TabsContent value="participants" className="flex-grow overflow-hidden">
            <ScrollArea className="h-full">
              {participantList.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between space-x-2 p-2 hover:bg-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full ${participant.color} flex items-center justify-center text-gray-800 font-bold`}>
                      {participant.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <p className="text-sm text-gray-500">{participant.role}</p>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Participant</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove {participant.name} from the meeting?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => setParticipantList(participantList.filter(p => p.id !== participant.id))}>
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </motion.div>
    )
  }

  const renderBackground = () => {
    switch (background) {
      case 'gradient':
        return (
          <div 
            className="absolute inset-0 animate-gradient-x" 
            style={{
              background: `linear-gradient(-45deg, ${themeColors.find(c => c.id === themeColor).value}, ${themeColors.find(c => c.id === themeColor).secondary}, #ffffff)`,
              backgroundSize: '400% 400%',
            }}
          />
        )
      case 'particles':
        return <div className="absolute inset-0 bg-dots-darker" style={{ backgroundColor: themeColors.find(c => c.id === themeColor).value }} />
      case 'waves':
        return <div className="absolute inset-0 bg-wave-pattern" style={{ backgroundColor: themeColors.find(c => c.id === themeColor).value }} />
      case 'geometric':
        return <div className="absolute inset-0 bg-triangle-pattern" style={{ backgroundColor: themeColors.find(c => c.id === themeColor).value }} />
      default:
        return null
    }
  }

  return (
    <div className="relative h-screen overflow-hidden text-gray-800 bg-white">
      {renderBackground()}
      <div className="absolute inset-0 bg-white bg-opacity-50"></div>
      <div className="absolute inset-0 p-4 overflow-auto">
        {renderParticipants()}
        {isDrawingMode && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-20 cursor-crosshair"
            width={window.innerWidth}
            height={window.innerHeight}
          />
        )}
      </div>
      
      {renderChat()}

      <motion.div
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-2 flex justify-center space-x-2 bg-white bg-opacity-80 backdrop-blur-sm rounded-full shadow-lg"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={isMuted ? "destructive" : "secondary"}
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Audio Settings</h4>
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Input Device</h5>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select microphone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default Microphone</SelectItem>
                          <SelectItem value="headset">Headset Microphone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Input Volume</h5>
                      <Slider defaultValue={[50]} max={100} step={1} />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isMuted ? 'Unmute' : 'Mute'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isVideoOn ? "secondary" : "destructive"}
                size="icon"
                className="rounded-full"
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isVideoOn ? 'Turn off video' : 'Turn on video'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={isScreenSharing ? "destructive" : "secondary"}
                    size="icon"
                    className="rounded-full"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Screen Sharing</h4>
                    <div className="space-y-2">
                      <Button onClick={() => setIsScreenSharing(!isScreenSharing)} className="w-full">
                        {isScreenSharing ? "Stop Sharing" : "Start Sharing"}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Share</h5>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select what to share" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entire-screen">Entire Screen</SelectItem>
                          <SelectItem value="window">Application Window</SelectItem>
                          <SelectItem value="tab">Browser Tab</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isScreenSharing ? 'Stop sharing' : 'Share screen'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={chatOpen ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-full"
                    onClick={() => setChatOpen(!chatOpen)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="space-y-2">
                    <h4 className="font-medium">Chat Position</h4>
                    <Select value={chatPosition} onValueChange={setChatPosition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select chat position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="floating">Floating</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                        <SelectItem value="side">Side</SelectItem>
                        <SelectItem value="top">Top</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent>
              <p>{chatOpen ? 'Close chat' : 'Open chat'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isRaiseHand ? "secondary" : "ghost"}
                size="icon"
                className="rounded-full"
                onClick={() => setIsRaiseHand(!isRaiseHand)}
              >
                <Hand className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isRaiseHand ? 'Lower hand' : 'Raise hand'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full">
                    <Smile className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Reactions</h4>
                    <div className="grid grid-cols-6 gap-2">
                      {['👍', '👏', '🎉', '❤️', '😂', '🤔'].map((emoji) => (
                        <Button key={emoji} variant="outline" className="text-2xl">
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reactions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full">
                    <Layout className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Display Mode</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {displayModes.map((mode) => (
                        <Button
                          key={mode.id}
                          variant={displayMode === mode.id ? "secondary" : "outline"}
                          className="justify-start"
                          onClick={() => {
                            setDisplayMode(mode.id)
                            controls.start({
                              scale: [1, 1.05, 1],
                              transition: { duration: 0.3 }
                            })
                          }}
                        >
                          {/* <mode.icon className="mr-2 h-4 w-4" /> */}
                          {mode.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent>
              <p>Change layout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={isDrawingMode ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsDrawingMode(!isDrawingMode)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Drawing Tools</h4>
                    <div className="flex space-x-2">
                      <Button
                        variant={drawingTool === 'pen' ? "secondary" : "outline"}
                        onClick={() => setDrawingTool('pen')}
                      >
                        <PenTool className="h-4 w-4 mr-2" />
                        Pen
                      </Button>
                      <Button
                        variant={drawingTool === 'eraser' ? "secondary" : "outline"}
                        onClick={() => setDrawingTool('eraser')}
                      >
                        <Eraser className="h-4 w-4 mr-2" />
                        Eraser
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Line Width</h5>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[lineWidth]}
                        onValueChange={([value]) => setLineWidth(value)}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => setDrawings([])}>Clear All</Button>
                      <Button onClick={() => {
                        const link = document.createElement('a')
                        link.download = 'drawing.png'
                        link.href = canvasRef.current.toDataURL()
                        link.click()
                      }}>
                        <Download className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isDrawingMode ? 'Stop drawing' : 'Start drawing'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Meeting Settings</DialogTitle>
                    <DialogDescription>Adjust additional meeting settings here.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="security">Enable Security Features</Label>
                      <Switch
                        id="security"
                        checked={isSecurityEnabled}
                        onCheckedChange={setIsSecurityEnabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="volume">Speaker Volume</Label>
                      <div className="flex items-center space-x-2">
                        <VolumeX className="h-4 w-4" />
                        <Slider
                          id="volume"
                          min={0}
                          max={100}
                          value={[volume]}
                          onValueChange={([v]) => setVolume(v)}
                        />
                        <Volume2 className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Background</Label>
                      <Select value={background} onValueChange={setBackground}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select background" />
                        </SelectTrigger>
                        <SelectContent>
                          {backgroundOptions.map((option) => (
                            <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Theme Color</Label>
                      <Select value={themeColor} onValueChange={setThemeColor}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme color" />
                        </SelectTrigger>
                        <SelectContent>
                          {themeColors.map((color) => (
                            <SelectItem key={color.id} value={color.id}>
                              <div className="flex items-center">
                                <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color.value }}></div>
                                {color.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Invite Participants</Label>
                      <div className="flex space-x-2">
                        <Input placeholder="Enter email address" />
                        <Button>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Invite
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Breakout Rooms</Label>
                      <Button onClick={() => setIsBreakoutRoom(!isBreakoutRoom)}>
                        {isBreakoutRoom ? 'End Breakout Rooms' : 'Create Breakout Rooms'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </TooltipTrigger>
            <TooltipContent>
              <p>More options</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="destructive" size="icon" className="rounded-full">
                <Phone className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Leave meeting</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
    </div>
  )
}