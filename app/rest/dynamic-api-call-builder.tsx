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

// Function to replace placeholders in JSON
function replacePlaceholders(template: any, variables: Record<string, string>) {
  return JSON.parse(
    JSON.stringify(template).replace(/{{(.*?)}}/g, (match, p1) => variables[p1] || '')
  )
}

export default function DynamicApiCallBuilder() {
  const [apiConfig, setApiConfig] = useState({
    method: "GET",
    url: "https://api.example.com/{{endpoint}}",
    params: [{ key: "q", value: "{{query}}" }],
    headers: [{ key: "Authorization", value: "Bearer {{token}}" }],
    body: ""
  })
  const [dynamicValues, setDynamicValues] = useState<Record<string, string>>({
    endpoint: "",
    query: "",
    token: ""
  })
  const [response, setResponse] = useState<any>(null)

  const updateApiConfig = (field: string, value: any) => {
    setApiConfig({ ...apiConfig, [field]: value })
  }

  const addParam = () => {
    updateApiConfig("params", [...apiConfig.params, { key: "", value: "" }])
  }

  const updateParam = (index: number, field: string, value: string) => {
    const updatedParams = [...apiConfig.params]
    updatedParams[index][field] = value
    updateApiConfig("params", updatedParams)
  }

  const removeParam = (index: number) => {
    const updatedParams = [...apiConfig.params]
    updatedParams.splice(index, 1)
    updateApiConfig("params", updatedParams)
  }

  const addHeader = () => {
    updateApiConfig("headers", [...apiConfig.headers, { key: "", value: "" }])
  }

  const updateHeader = (index: number, field: string, value: string) => {
    const updatedHeaders = [...apiConfig.headers]
    updatedHeaders[index][field] = value
    updateApiConfig("headers", updatedHeaders)
  }

  const removeHeader = (index: number) => {
    const updatedHeaders = [...apiConfig.headers]
    updatedHeaders.splice(index, 1)
    updateApiConfig("headers", updatedHeaders)
  }

  const updateDynamicValue = (key: string, value: string) => {
    setDynamicValues({ ...dynamicValues, [key]: value })
  }

  const executeApiCall = async () => {
    try {
      const resolvedConfig = replacePlaceholders(apiConfig, dynamicValues)

      const queryString = new URLSearchParams(
        resolvedConfig.params.reduce((acc: Record<string, string>, param: { key: string; value: string }) => {
          if (param.key && param.value) {
            acc[param.key] = param.value
          }
          return acc
        }, {})
      ).toString()

      const fullUrl = `${resolvedConfig.url}${queryString ? `?${queryString}` : ""}`

      const headerObject = resolvedConfig.headers.reduce((acc: Record<string, string>, header: { key: string; value: string }) => {
        if (header.key && header.value) {
          acc[header.key] = header.value
        }
        return acc
      }, {})

      const requestOptions = {
        method: resolvedConfig.method,
        headers: headerObject,
        body: resolvedConfig.method !== "GET" && resolvedConfig.body ? resolvedConfig.body : undefined,
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
      <h1 className="mb-6 text-3xl font-bold">Dynamic API Call Builder</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Configure your API call with placeholders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <Label htmlFor="method">Method</Label>
                <Select value={apiConfig.method} onValueChange={(value) => updateApiConfig("method", value)}>
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
                  placeholder="https://api.example.com/{{endpoint}}"
                  value={apiConfig.url}
                  onChange={(e) => updateApiConfig("url", e.target.value)}
                />
              </div>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="params">
                <AccordionTrigger>Parameters</AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-[200px]">
                    {apiConfig.params.map((param, index) => (
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
                    {apiConfig.headers.map((header, index) => (
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
                    value={apiConfig.body}
                    onChange={(e) => updateApiConfig("body", e.target.value)}
                    className="min-h-[200px]"
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dynamic Values</CardTitle>
            <CardDescription>Provide runtime values for placeholders</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {Object.entries(dynamicValues).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <Label htmlFor={key}>{key}</Label>
                  <Input
                    id={key}
                    value={value}
                    onChange={(e) => updateDynamicValue(key, e.target.value)}
                    placeholder={`Enter value for {{${key}}}`}
                  />
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button onClick={executeApiCall}>
              <Play className="mr-2 h-4 w-4" /> Execute API Call
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Response</CardTitle>
          <CardDescription>API call response will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
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
  )
}