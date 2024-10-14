"use client"

import { useState } from "react"
import { ChevronDown, Play, Plus, Trash } from "lucide-react"

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

export default function ApiCallBuilder() {
  const [method, setMethod] = useState("GET")
  const [url, setUrl] = useState("")
  const [params, setParams] = useState([{ key: "", value: "" }])
  const [headers, setHeaders] = useState([{ key: "", value: "" }])
  const [body, setBody] = useState("")
  const [response, setResponse] = useState(null)

  const addParam = () => {
    setParams([...params, { key: "", value: "" }])
  }

  const updateParam = (index, field, value) => {
    const updatedParams = [...params]
    updatedParams[index][field] = value
    setParams(updatedParams)
  }

  const removeParam = (index) => {
    const updatedParams = [...params]
    updatedParams.splice(index, 1)
    setParams(updatedParams)
  }

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }])
  }

  const updateHeader = (index, field, value) => {
    const updatedHeaders = [...headers]
    updatedHeaders[index][field] = value
    setHeaders(updatedHeaders)
  }

  const removeHeader = (index) => {
    const updatedHeaders = [...headers]
    updatedHeaders.splice(index, 1)
    setHeaders(updatedHeaders)
  }

  const executeApiCall = async () => {
    try {
      const queryString = new URLSearchParams(
        params.reduce((acc, param) => {
          if (param.key && param.value) {
            acc[param.key] = param.value
          }
          return acc
        }, {})
      ).toString()

      const fullUrl = `${url}${queryString ? `?${queryString}` : ""}`

      const headerObject = headers.reduce((acc, header) => {
        if (header.key && header.value) {
          acc[header.key] = header.value
        }
        return acc
      }, {})

      const requestOptions = {
        method,
        headers: headerObject,
        body: method !== "GET" && body ? body : undefined,
      }

      const fetchResponse = await fetch(fullUrl, requestOptions)
      const data = await fetchResponse.json()

      setResponse({
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        headers: Object.fromEntries(fetchResponse.headers.entries()),
        body: data,
      })
    } catch (error) {
      setResponse({
        error: error.message,
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">API Call Builder</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request Configuration</CardTitle>
            <CardDescription>Configure your API call</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <Label htmlFor="method">Method</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger id="method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="https://api.example.com/endpoint"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="params">
                <AccordionTrigger>Parameters</AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-[200px]">
                    {params.map((param, index) => (
                      <div key={index} className="mb-2 grid grid-cols-5 gap-2">
                        <Input
                          className="col-span-2"
                          placeholder="Key"
                          value={param.key}
                          onChange={(e) => updateParam(index, "key", e.target.value)}
                        />
                        <Input
                          className="col-span-2"
                          placeholder="Value"
                          value={param.value}
                          onChange={(e) => updateParam(index, "value", e.target.value)}
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeParam(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </ScrollArea>
                  <Button onClick={addParam} className="mt-2">
                    <Plus className="mr-2 h-4 w-4" /> Add Parameter
                  </Button>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="headers">
                <AccordionTrigger>Headers</AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-[200px]">
                    {headers.map((header, index) => (
                      <div key={index} className="mb-2 grid grid-cols-5 gap-2">
                        <Input
                          className="col-span-2"
                          placeholder="Key"
                          value={header.key}
                          onChange={(e) => updateHeader(index, "key", e.target.value)}
                        />
                        <Input
                          className="col-span-2"
                          placeholder="Value"
                          value={header.value}
                          onChange={(e) => updateHeader(index, "value", e.target.value)}
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeHeader(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </ScrollArea>
                  <Button onClick={addHeader} className="mt-2">
                    <Plus className="mr-2 h-4 w-4" /> Add Header
                  </Button>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="body">
                <AccordionTrigger>Body</AccordionTrigger>
                <AccordionContent>
                  <Textarea
                    placeholder="Enter request body (JSON)"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="min-h-[200px]"
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter>
            <Button onClick={executeApiCall}>
              <Play className="mr-2 h-4 w-4" /> Execute API Call
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
            <CardDescription>API call response will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              {response ? (
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Status: {response.status} {response.statusText}</h3>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="headers">
                      <AccordionTrigger>Headers</AccordionTrigger>
                      <AccordionContent>
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(response.headers, null, 2)}
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="body">
                      <AccordionTrigger>Body</AccordionTrigger>
                      <AccordionContent>
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(response.body, null, 2)}
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ) : (
                <p>No response yet. Execute an API call to see the results.</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}