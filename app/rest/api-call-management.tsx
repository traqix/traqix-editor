"use client"

import { useState } from "react"
import { Edit, Play, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample API calls data
const initialApiCalls = [
  {
    id: 1,
    name: "Fetch Weather",
    method: "GET",
    endpoint: "/data/2.5/weather",
    params: "q={{city}}, appid={{apiKey}}",
    config: {
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather",
      params: {
        q: "{{city}}",
        appid: "{{apiKey}}"
      },
      headers: {},
      body: null
    }
  },
  {
    id: 2,
    name: "Create User",
    method: "POST",
    endpoint: "/users/create",
    params: "name={{name}}, email={{email}}",
    config: {
      method: "POST",
      url: "https://api.example.com/users/create",
      params: {},
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        name: "{{name}}",
        email: "{{email}}"
      }
    }
  },
  {
    id: 3,
    name: "Update Product",
    method: "PUT",
    endpoint: "/products/{{id}}",
    params: "id={{id}}, data=JSON",
    config: {
      method: "PUT",
      url: "https://api.example.com/products/{{id}}",
      params: {},
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        id: "{{id}}",
        data: "{{data}}"
      }
    }
  }
]

export default function ApiCallManagement() {
  const [apiCalls, setApiCalls] = useState(initialApiCalls)
  const [searchTerm, setSearchTerm] = useState("")
  const [methodFilter, setMethodFilter] = useState("all")
  const [editingApiCall, setEditingApiCall] = useState(null)
  const [viewMode, setViewMode] = useState("table")

  const filteredApiCalls = apiCalls.filter(apiCall => 
    apiCall.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (methodFilter === "all" || apiCall.method === methodFilter)
  )

  const handleEdit = (apiCall) => {
    setEditingApiCall(apiCall)
  }

  const handleSaveEdit = (updatedApiCall) => {
    setApiCalls(apiCalls.map(call => call.id === updatedApiCall.id ? updatedApiCall : call))
    setEditingApiCall(null)
  }

  const handleUse = (apiCall) => {
    console.log("Using API call:", apiCall)
    // Here you would implement the logic to use this API call in your automation flow
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">API Call Management</h1>
      <div className="mb-4 flex items-center space-x-4">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Search API Calls
          </Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search API calls..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
        <Select value={viewMode} onValueChange={setViewMode}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="table">Table View</SelectItem>
            <SelectItem value="card">Card View</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsList className="hidden">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="card">Card View</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>API Name</TableHead>
                <TableHead>HTTP Method</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Parameters</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApiCalls.map((apiCall) => (
                <TableRow key={apiCall.id}>
                  <TableCell>{apiCall.name}</TableCell>
                  <TableCell>{apiCall.method}</TableCell>
                  <TableCell>{apiCall.endpoint}</TableCell>
                  <TableCell>{apiCall.params}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(apiCall)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit API Call</DialogTitle>
                            <DialogDescription>
                              Make changes to your API call here. Click save when you're done.
                            </DialogDescription>
                          </DialogHeader>
                          <ApiCallForm apiCall={editingApiCall} onSave={handleSaveEdit} />
                        </DialogContent>
                      </Dialog>
                      <Button variant="default" size="sm" onClick={() => handleUse(apiCall)}>
                        <Play className="mr-2 h-4 w-4" />
                        Use
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="card">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredApiCalls.map((apiCall) => (
              <Card key={apiCall.id}>
                <CardHeader>
                  <CardTitle>{apiCall.name}</CardTitle>
                  <CardDescription>Method: {apiCall.method}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p><strong>Endpoint:</strong> {apiCall.endpoint}</p>
                  <p><strong>Parameters:</strong> {apiCall.params}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => handleEdit(apiCall)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit API Call</DialogTitle>
                        <DialogDescription>
                          Make changes to your API call here. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <ApiCallForm apiCall={editingApiCall} onSave={handleSaveEdit} />
                    </DialogContent>
                  </Dialog>
                  <Button variant="default" onClick={() => handleUse(apiCall)}>
                    <Play className="mr-2 h-4 w-4" />
                    Use
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ApiCallForm({ apiCall, onSave }) {
  const [formData, setFormData] = useState(apiCall)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="method" className="text-right">
            Method
          </Label>
          <Select
            name="method"
            value={formData.method}
            onValueChange={(value) => setFormData(prevData => ({ ...prevData, method: value }))}
          >
            <SelectTrigger className="col-span-3">
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
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="endpoint" className="text-right">
            Endpoint
          </Label>
          <Input
            id="endpoint"
            name="endpoint"
            value={formData.endpoint}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="params" className="text-right">
            Parameters
          </Label>
          <Input
            id="params"
            name="params"
            value={formData.params}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  )
}