import { useState } from "react"
import { ChevronDown, ChevronRight, Play, Plus, Save, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ApiAutomationFlow() {
  const [collections, setCollections] = useState([
    {
      name: "Authentication",
      requests: [
        { name: "Login", method: "POST", url: "{{baseUrl}}/login" },
        { name: "Logout", method: "POST", url: "{{baseUrl}}/logout" },
      ],
    },
    {
      name: "User Data",
      requests: [
        { name: "Get User Profile", method: "GET", url: "{{baseUrl}}/user/{{userId}}" },
        { name: "Update User Profile", method: "PUT", url: "{{baseUrl}}/user/{{userId}}" },
      ],
    },
  ])

  const [variables, setVariables] = useState([
    { name: "baseUrl", value: "https://api.example.com" },
    { name: "userId", value: "12345" },
  ])

  const [selectedRequests, setSelectedRequests] = useState([])

  const addVariable = () => {
    setVariables([...variables, { name: "", value: "" }])
  }

  const updateVariable = (index, field, value) => {
    const updatedVariables = [...variables]
    updatedVariables[index][field] = value
    setVariables(updatedVariables)
  }

  const addRequestToFlow = (collectionIndex, requestIndex) => {
    const request = collections[collectionIndex].requests[requestIndex]
    setSelectedRequests([...selectedRequests, request])
  }

  const removeRequestFromFlow = (index) => {
    const updatedRequests = [...selectedRequests]
    updatedRequests.splice(index, 1)
    setSelectedRequests(updatedRequests)
  }

  const runAutomationFlow = () => {
    console.log("Running automation flow:", selectedRequests)
    // Here you would implement the actual API calls and handle responses
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">API Automation Flow</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Define variables to use in your API calls</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {variables.map((variable, index) => (
                <div key={index} className="mb-4 grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Variable name"
                    value={variable.name}
                    onChange={(e) => updateVariable(index, "name", e.target.value)}
                  />
                  <Input
                    placeholder="Variable value"
                    value={variable.value}
                    onChange={(e) => updateVariable(index, "value", e.target.value)}
                  />
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button onClick={addVariable}>
              <Plus className="mr-2 h-4 w-4" /> Add Variable
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>API Collections</CardTitle>
            <CardDescription>Organize your API requests into collections</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <Accordion type="single" collapsible className="w-full">
                {collections.map((collection, collectionIndex) => (
                  <AccordionItem key={collectionIndex} value={`item-${collectionIndex}`}>
                    <AccordionTrigger>{collection.name}</AccordionTrigger>
                    <AccordionContent>
                      {collection.requests.map((request, requestIndex) => (
                        <div key={requestIndex} className="mb-2 flex items-center justify-between">
                          <span>
                            {request.method} {request.name}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addRequestToFlow(collectionIndex, requestIndex)}
                          >
                            Add to Flow
                          </Button>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Automation Flow</CardTitle>
          <CardDescription>Sequence of API calls to be executed</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {selectedRequests.map((request, index) => (
              <div key={index} className="mb-2 flex items-center justify-between">
                <span>
                  {index + 1}. {request.method} {request.name}
                </span>
                <Button size="sm" variant="destructive" onClick={() => removeRequestFromFlow(index)}>
                  Remove
                </Button>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter className="justify-between">
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" /> Save Flow
          </Button>
          <Button onClick={runAutomationFlow}>
            <Play className="mr-2 h-4 w-4" /> Run Flow
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}