"use client";

import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// import { MaxLengthSelector } from "../../editor2/components/maxlength-selector";
// import { ModelSelector } from "../../editor2/components/model-selector";
// import { TemperatureSelector } from "../../editor2/components/temperature-selector";
// import { TopPSelector } from "../../editor2/components/top-p-selector";
// import { models, types } from "../../editor2/data/models";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ResizableComponent from "@/components/resizable";
import { useEffect, useRef, useState } from "react";
import { EditorRight } from "./editor-right";
import type { TreeItem } from "@/app/(main)/(editor)/types";
import { usePathname } from "next/navigation";
import TextareaForm from "./textarea-form";
import { useTree } from "@/components/context/tree-context";
import { ResponsiveControl } from "./responsive-control";
import {
  BotIcon,
  CodeXmlIcon,
  Monitor,
  MonitorSmartphone,
  Smartphone,
  StoreIcon,
  Tablet,
} from "lucide-react";
import { HistoryControls } from "./history-controls";
import { applyRawCode, convertTreeItemToTreeFull, handleRawCodeChange } from "../utils/util";
import CodeGenerator from "./code-generator";
import VmIsolated from "./vm";

interface MainEditorProps {
  selectedItem?: TreeItem;
}

export default function MainEditor({ selectedItem }: MainEditorProps) {
  const pathname = usePathname();
  const basePath = pathname == "/" ? "" : pathname;
  const [modeResponsive, setModeResponsive] = useState<string | undefined>(undefined);

  const changeModeResponsive = (mode: string) => {
    setModeResponsive(mode)
    setTimeout(() => {
      setModeResponsive(undefined)
    }, 1000);
  }
  
  const { getTree, setTree } = useTree();
  const treeRoot = getTree("root")

  const [rawCode,  setRawCode] = useState("")
  const [generatedCode, setGeneratedCode] = useState("");
  
  useEffect(() => {
    if (treeRoot){
      setRawCode(JSON.stringify(convertTreeItemToTreeFull(treeRoot, getTree), null, 2))
      setGeneratedCode(JSON.stringify(treeRoot, null, 2));
    }
  }, [treeRoot])

  useEffect(() => {
    sendMessageToIframe(selectedItem);
  }, [selectedItem]);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Função para enviar uma mensagem para o iframe
  const sendMessageToIframe = (message: TreeItem | undefined) => {
    if (iframeRef.current && message) {
      const iframeWindow = iframeRef.current.contentWindow;
      if (iframeWindow) {
        iframeWindow.postMessage({ data: message }, "*");
      }
    }
  };

  return (
    <div className="hiddenn h-full flex-col md:flex pl-4">
      <Tabs defaultValue="complete" className="h-full flex-1">
        <div className="containerr h-full">
          <div className="h-full w-full">
            <div className="grid h-full min-h-[calc(100vh-7rem)] items-stretch gap-6 md:grid-cols-[1fr_280px]">
              <div className="hiddenn h-full flex-col space-y-4 sm:flex md:order-2">
                <ScrollArea className="h-[calc(100vh-6rem)] px-4">
                  <div className="grid grid-cols-2 gap-1">
                    <div>
                      <HoverCard openDelay={200}>
                        <HoverCardTrigger asChild>
                          <span className="text-sm font-light opacity-50 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Preview
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent
                          className="w-[320px] text-sm"
                          side="left"
                        >
                          Choose the interface that best suits your task. You
                          can provide: a simple prompt to complete, starting and
                          ending text to insert a completion within, or some
                          text with instructions to edit it.
                        </HoverCardContent>
                      </HoverCard>
                      <div className="grid gap-2 grid-flow-col justify-stretch bg-muted/50 p-2 border-[0.5px] rounded-lg overflow-hidden">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-9 h-9"
                          onClick={() => changeModeResponsive("desktop")}
                        >
                          <Monitor className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-9 h-9"
                          onClick={() => changeModeResponsive("tablet")}
                        >
                          <Tablet className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-9 h-9"
                          onClick={() => changeModeResponsive("mobile")}
                        >
                          <Smartphone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <HoverCard openDelay={200}>
                        <HoverCardTrigger asChild>
                          <span className="text-sm font-light opacity-50 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            History
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent
                          className="w-[320px] text-sm"
                          side="left"
                        >
                          Choose the interface that best suits your task. You
                          can provide: a simple prompt to complete, starting and
                          ending text to insert a completion within, or some
                          text with instructions to edit it.
                        </HoverCardContent>
                      </HoverCard>
                      <div className="grid gap-2 grid-flow-col justify-stretch bg-muted/50 p-2 border-[0.5px] rounded-lg overflow-hidden">
                        <HistoryControls />
                      </div>
                    </div>
                  </div>
                  <div className="flex">

                    <VmIsolated />
                  </div>
                  <div className="grid gap-2 bg-green-500/0 mt-4">
                    <HoverCard openDelay={200}>
                      <HoverCardTrigger asChild>
                        <span className="text-sm font-light opacity-50 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Mode
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent
                        className="w-[320px] text-sm"
                        side="left"
                      >
                        Choose the interface that best suits your task. You can
                        provide: a simple prompt to complete, starting and
                        ending text to insert a completion within, or some text
                        with instructions to edit it.
                      </HoverCardContent>
                    </HoverCard>
                    <TabsList className="grid grid-cols-4">
                      <TabsTrigger value="complete">
                        <div className="opacity-60 hover:opacity-100 w-full flex justify-center">
                          <span className="sr-only">Complete</span>
                          <MonitorSmartphone className="" size={16} />
                        </div>
                      </TabsTrigger>
                      <TabsTrigger value="insert">
                        <div className="opacity-60 hover:opacity-100 w-full flex justify-center">
                          <span className="sr-only">Insert</span>
                          <CodeXmlIcon className="" size={16} />
                        </div>
                      </TabsTrigger>
                      <TabsTrigger value="edit">
                        <span className="sr-only">AI</span>
                        <BotIcon size={16} />
                      </TabsTrigger>
                      <TabsTrigger value="market">
                        <span className="sr-only">Market</span>
                        <StoreIcon size={16} />
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  {/* <ModelSelector types={types} models={models} />
                  <TemperatureSelector defaultValue={[0.56]} />
                  <MaxLengthSelector defaultValue={[256]} />
                  <TopPSelector defaultValue={[0.9]} /> */}
                  <EditorRight selectedItem={selectedItem} setTree={setTree} />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>

              <div className="md:order-1 h-[calc(100vh-5.5rem)] ">
                <TabsContent value="complete" className="mt-0 p-0 h-full">
                  <ResizableComponent
                    mode={modeResponsive}
                    containerClassName={"p-0 h-full"}
                    contentClassName={
                      "border-[0.5px] border-tremor-background-emphasis/20 dark:border-tremor-background-emphasis/80 shadow-lg1 z-[1]"
                    }
                    paddingClassName={""}
                  >
                    <div className="flex h-full flex-col space-y-4">
                      <iframe
                        ref={iframeRef}
                        src={`${basePath}/canvas`}
                        width={"100%"}
                        height={"100%"}
                      ></iframe>
                    </div>
                  </ResizableComponent>
                </TabsContent>
                <TabsContent
                  value="insert"
                  className="mt-0 border-0 p-0 h-full"
                >
                  <div className="h-full flex flex-col space-y-4">
                    <TextareaForm />
                  </div>
                </TabsContent>
                <TabsContent value="edit" className="mt-0 border-0 p-0 h-full">
                  <div className="h-full flex flex-col space-y-4">
                    <div className="grid h-full gap-6 lg:grid-cols-2">
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-1 flex-col space-y-2">
                          <Label htmlFor="input">Input</Label>
                          <Textarea
                            value={rawCode}
                            onChange={handleRawCodeChange}
                            placeholder="Paste your raw JSON code here..."
                            className="min-h-96 h-[648px] ring-offset-0"
                          />
                          <Button onClick={applyRawCode}>Apply Raw Code</Button>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="instructions">Instructions</Label>
                          <Textarea
                            id="instructions"
                            placeholder="Fix the grammar."
                          />
                        </div>
                      </div>
                      <div className="mt-[21px] min-h-[400px] rounded-md border bg-muted lg:min-h-[500px]">
                        <pre className="p-4 bg-gray-800 text-white rounded-lg overflow-x-auto h-full">
                          <code>
                            <CodeGenerator rootItem={treeRoot} />
                          </code>
                        </pre>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button>Submit</Button>
                      <Button variant="secondary">
                        <span className="sr-only">Show history</span>
                        <CounterClockwiseClockIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
