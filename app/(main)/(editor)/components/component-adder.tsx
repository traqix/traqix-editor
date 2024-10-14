"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus, ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";

const componentOptions = [
  {
    id: "heading",
    name: "Heading",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "paragraph",
    name: "Paragraph",
    image: "/placeholder.svg?height=80&width=80",
  },
  { id: "image", name: "Image", image: "/placeholder.svg?height=80&width=80" },
  {
    id: "button",
    name: "Button",
    image: "/placeholder.svg?height=80&width=80",
  },
  { id: "list", name: "List", image: "/placeholder.svg?height=80&width=80" },
  {
    id: "section",
    name: "Section",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "section1",
    name: "Section",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "section2",
    name: "Section",
    image: "/placeholder.svg?height=80&width=80",
  },
];

export default function ComponentAdder() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedComponent, setSelectedComponent] = useState("");
  const [filter, setFilter] = useState("");
  const [config, setConfig] = useState({ content: "", children: 1 });

  const filteredOptions = componentOptions.filter((option) =>
    option.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSelectComponent = (id: string) => {
    setSelectedComponent(id);
    setCurrentStep(2);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleConfirm = () => {
    // Logic to add the component to the layout
    console.log("Adding component:", selectedComponent, "with config:", config);
    setIsOpen(false);
    setCurrentStep(1);
    setSelectedComponent("");
    setFilter("");
    setConfig({ content: "", children: 1 });
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-10"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Component
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[51] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <Card className="w-full max-w-4xl overflow-hidden">
            <div className="flex flex-col md:flex-row md:h-[32rem]">
              {/* Steps - Mobile */}
              <div className="md:hidden">
                <Tabs value={`${currentStep}`} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="1">Select</TabsTrigger>
                    <TabsTrigger value="2">Configure</TabsTrigger>
                    <TabsTrigger value="3">Confirm</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Steps - Desktop */}
              <div className="hidden md:block w-64 bg-gray-100 p-6">
                <h2 className="mb-6 text-xl font-semibold">Add Component</h2>
                <ol className="space-y-4">
                  <li
                    className={`flex items-center ${currentStep >= 1 ? "text-primary" : "text-gray-400"}`}
                  >
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-current">
                      1
                    </div>
                    Select
                  </li>
                  <li
                    className={`flex items-center ${currentStep >= 2 ? "text-primary" : "text-gray-400"}`}
                  >
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-current">
                      2
                    </div>
                    Configure
                  </li>
                  <li
                    className={`flex items-center ${currentStep >= 3 ? "text-primary" : "text-gray-400"}`}
                  >
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-current">
                      3
                    </div>
                    Confirm
                  </li>
                </ol>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6">
                <div className="relative h-2 w-full text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Select a Component
                    </h3>
                    <Input
                      type="text"
                      placeholder="Filter components..."
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="mb-4"
                    />
                    <ScrollArea className="h-[calc(100vh-16rem)] md:h-[21rem] ">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {filteredOptions.map((option) => (
                          <Button
                            key={option.id}
                            variant="outline"
                            className="flex flex-col items-center justify-center h-32 p-2"
                            onClick={() => handleSelectComponent(option.id)}
                          >
                            <Image
                              src={option.image}
                              alt={option.name}
                              width={80}
                              height={80}
                              className="mb-2"
                            />
                            <span className="text-sm">{option.name}</span>
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Configure {selectedComponent}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Input
                          id="content"
                          value={config.content}
                          onChange={(e) =>
                            setConfig({ ...config, content: e.target.value })
                          }
                          placeholder="Enter content..."
                        />
                      </div>
                      {selectedComponent === "section" && (
                        <div>
                          <Label htmlFor="children">Number of Children</Label>
                          <Input
                            id="children"
                            type="number"
                            min="1"
                            max="10"
                            value={config.children}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                children: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                      )}
                      {/* Add more configuration options based on the selected component */}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Confirm</h3>
                    <p>
                      You are about to add a new {selectedComponent} component
                      to your layout.
                    </p>
                    <p>Content: {config.content}</p>
                    {selectedComponent === "section" && (
                      <p>Number of children: {config.children}</p>
                    )}
                    <p>Please confirm to proceed.</p>
                  </div>
                )}

                <Separator className="my-6" />

                <div className="flex justify-between">
                  {currentStep > 1 && (
                    <>
                      <Button
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                      <Button
                        onClick={
                          currentStep === 3
                            ? handleConfirm
                            : () => setCurrentStep(currentStep + 1)
                        }
                      >
                        {currentStep === 3 ? "Confirm" : "Next"}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
