"use client"

import { useState } from "react"
import {
  Book,
  Code2,
  FileJson,
  FolderTree,
  LifeBuoy,
  Play,
  Plus,
  Save,
  Send,
  Settings2,
  SquareTerminal,
  SquareUser,
  Triangle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ApiTesterDashboard() {
  const [responseData, setResponseData] = useState("")

  const handleSendRequest = () => {
    // Simulating an API call
    setTimeout(() => {
      setResponseData(JSON.stringify({ message: "API response received" }, null, 2))
    }, 1000)
  }

  return (
    <div className="grid h-screen w-full pl-[56px]">
      <aside className="fixed inset-y-0 left-0 z-20 flex h-full w-[56px] flex-col border-r">
        <div className="border-b p-2">
          <Button variant="outline" size="icon" aria-label="Home">
            <Triangle className="h-5 w-5 fill-foreground" />
          </Button>
        </div>
        <nav className="grid gap-1 p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg bg-muted"
                aria-label="Requests"
              >
                <Send className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Requests
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Collections"
              >
                <FolderTree className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Collections
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Environments"
              >
                <FileJson className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Environments
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Console"
              >
                <SquareTerminal className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Console
            </TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto grid gap-1 p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-lg"
                aria-label="Settings"
              >
                <Settings2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Settings
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-lg"
                aria-label="Help"
              >
                <LifeBuoy className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Help
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-lg"
                aria-label="Account"
              >
                <SquareUser className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Account
            </TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">API Tester</h1>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5 text-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            New Request
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-sm"
          >
            <Save className="h-3.5 w-3.5" />
            Save
          </Button>
        </header>
        <main className="flex flex-1 overflow-hidden">
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center gap-2 border-b p-2">
              <Select defaultValue="get">
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="get">GET</SelectItem>
                  <SelectItem value="post">POST</SelectItem>
                  <SelectItem value="put">PUT</SelectItem>
                  <SelectItem value="delete">DELETE</SelectItem>
                </SelectContent>
              </Select>
              <Input className="flex-1" placeholder="Enter request URL" />
              <Button onClick={handleSendRequest}>Send</Button>
            </div>
            <Tabs defaultValue="params" className="flex-1">
              <TabsList className="w-full justify-start rounded-none border-b px-2">
                <TabsTrigger value="params">Params</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
                <TabsTrigger value="body">Body</TabsTrigger>
                <TabsTrigger value="tests">Tests</TabsTrigger>
              </TabsList>
              <TabsContent value="params" className="flex-1 overflow-auto p-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Input placeholder="Key" />
                    <Input placeholder="Value" />
                    <Input placeholder="Description" />
                  </div>
                  <Button className="w-full" variant="outline">
                    Add Parameter
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="headers" className="flex-1 overflow-auto p-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Input placeholder="Key" />
                    <Input placeholder="Value" />
                    <Input placeholder="Description" />
                  </div>
                  <Button className="w-full" variant="outline">
                    Add Header
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="body" className="flex-1 overflow-auto p-4">
                <Textarea
                  className="min-h-[300px]"
                  placeholder="Enter request body"
                />
              </TabsContent>
              <TabsContent value="tests" className="flex-1 overflow-auto p-4">
                <Textarea
                  className="min-h-[300px]"
                  placeholder="Write your test scripts here"
                />
              </TabsContent>
            </Tabs>
          </div>
          <div className="w-1/2 border-l">
            <div className="flex items-center justify-between border-b p-2">
              <h2 className="text-lg font-semibold">Response</h2>
              <Badge variant="outline">Status: 200 OK</Badge>
            </div>
            <Tabs defaultValue="body" className="flex-1">
              <TabsList className="w-full justify-start rounded-none border-b px-2">
                <TabsTrigger value="body">Body</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
                <TabsTrigger value="tests">Test Results</TabsTrigger>
              </TabsList>
              <TabsContent value="body" className="flex-1 overflow-auto p-4">
                <pre className="whitespace-pre-wrap">{responseData}</pre>
              </TabsContent>
              <TabsContent value="headers" className="flex-1 overflow-auto p-4">
                <div className="grid gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-semibold">Content-Type:</div>
                    <div>application/json</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-semibold">Server:</div>
                    <div>nginx/1.18.0</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="tests" className="flex-1 overflow-auto p-4">
                <div className="rounded-lg bg-green-100 p-4 text-green-800">
                  All tests passed successfully!
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}