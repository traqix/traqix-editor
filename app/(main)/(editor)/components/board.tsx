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
import ResizableExample from "@/components/resizable";
import { useEffect, useRef, useState } from "react";
import { EditorRight } from "./editor-right";
import type { TreeItem } from "@/app/(main)/(editor)/types";
import { handleUpdate } from "../utils/util";
import useMultipleLocalStorage from "@/hooks/use-multiple-local-storage";
import { usePathname } from "next/navigation";

export default function PlaygroundPage() {

  const pathname = usePathname()
  const basePath = pathname == '/' ? '' : pathname
  
  const [messageFromIframe, setMessageFromIframe] = useState<TreeItem | null>(
    null
  );

  const [selectedItem, setSelectedItem] = useState<TreeItem | null>(null);

  useEffect(() => {
    const handleReceiveMessage = (event: MessageEvent) => {
      // Aqui você pode adicionar verificações de origem se necessário
      if (event.origin === window.location.origin) {
        if (event.data?.data) {
          setMessageFromIframe(event.data.data); // Atualiza a mensagem recebida do iframe
        }
      }
    };

    window.addEventListener("message", handleReceiveMessage);

    return () => {
      window.removeEventListener("message", handleReceiveMessage);
    };
  }, []);

  useEffect(() => {
    setSelectedItem(messageFromIframe);
    sendMessageToIframe(messageFromIframe);
  }, [messageFromIframe]);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Função para enviar uma mensagem para o iframe
  const sendMessageToIframe = (message: TreeItem | null) => {
    if (iframeRef.current && message) {
      const iframeWindow = iframeRef.current.contentWindow;
      if (iframeWindow) {
        iframeWindow.postMessage({ data: message }, "*");
      }
    }
  };

  return (
    <div className="hiddenn h-full flex-col md:flex">
      <Tabs defaultValue="complete" className="h-full flex-1">
        <div className="containerr h-full">
          <div className="h-full w-full">
            <div className="grid h-full min-h-[calc(100vh-7rem)] items-stretch gap-6 md:grid-cols-[1fr_280px]">
              <div className="hiddenn h-full flex-col space-y-4 sm:flex md:order-2">
                <ScrollArea className="h-[calc(100vh-6rem)] px-4">
                  <div className="grid gap-2">
                    <HoverCard openDelay={200}>
                      <HoverCardTrigger asChild>
                        <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger value="complete">
                        <span className="sr-only">Complete</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="none"
                          className="h-5 w-5"
                        >
                          <rect
                            x="4"
                            y="3"
                            width="12"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="4"
                            y="7"
                            width="12"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="4"
                            y="11"
                            width="3"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="4"
                            y="15"
                            width="3"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="8.5"
                            y="11"
                            width="3"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="8.5"
                            y="15"
                            width="3"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="13"
                            y="11"
                            width="3"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                        </svg>
                      </TabsTrigger>
                      <TabsTrigger value="insert">
                        <span className="sr-only">Insert</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="none"
                          className="h-5 w-5"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M14.491 7.769a.888.888 0 0 1 .287.648.888.888 0 0 1-.287.648l-3.916 3.667a1.013 1.013 0 0 1-.692.268c-.26 0-.509-.097-.692-.268L5.275 9.065A.886.886 0 0 1 5 8.42a.889.889 0 0 1 .287-.64c.181-.17.427-.267.683-.269.257-.002.504.09.69.258L8.903 9.87V3.917c0-.243.103-.477.287-.649.183-.171.432-.268.692-.268.26 0 .509.097.692.268a.888.888 0 0 1 .287.649V9.87l2.245-2.102c.183-.172.432-.269.692-.269.26 0 .508.097.692.269Z"
                            fill="currentColor"
                          ></path>
                          <rect
                            x="4"
                            y="15"
                            width="3"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="8.5"
                            y="15"
                            width="3"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="13"
                            y="15"
                            width="3"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                        </svg>
                      </TabsTrigger>
                      <TabsTrigger value="edit">
                        <span className="sr-only">Edit</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="none"
                          className="h-5 w-5"
                        >
                          <rect
                            x="4"
                            y="3"
                            width="12"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="4"
                            y="7"
                            width="12"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="4"
                            y="11"
                            width="3"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="4"
                            y="15"
                            width="4"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="8.5"
                            y="11"
                            width="3"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          ></rect>
                          <path
                            d="M17.154 11.346a1.182 1.182 0 0 0-1.671 0L11 15.829V17.5h1.671l4.483-4.483a1.182 1.182 0 0 0 0-1.671Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  {/* <ModelSelector types={types} models={models} />
                  <TemperatureSelector defaultValue={[0.56]} />
                  <MaxLengthSelector defaultValue={[256]} />
                  <TopPSelector defaultValue={[0.9]} /> */}
                  <EditorRight
                    selectedItem={selectedItem}
                    onUpdate={handleUpdate}
                  />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>

              <div className="md:order-1 h-[calc(100vh-5.5rem)] ">
                <TabsContent value="complete" className="mt-0 p-0 h-full">
                  <ResizableExample
                    mode={"tablet"}
                    containerClassName={"p-0 h-full"}
                    contentClassName={
                      "border-[0.5px] border-tremor-background-emphasis/20 dark:border-tremor-background-emphasis/80 shadow-lg1 z-[50]"
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
                  </ResizableExample>
                </TabsContent>
                <TabsContent
                  value="insert"
                  className="mt-0 border-0 p-0 h-full"
                >
                  <div className="h-full flex flex-col space-y-4">
                    <div className="grid h-full grid-rows-2 gap-6 lg:grid-cols-2 lg:grid-rows-1">
                      <Textarea
                        placeholder="We're writing to [inset]. Congrats from OpenAI!"
                        className="h-full min-h-[300px] lg:min-h-[500px] xl:min-h-[500px]"
                      />
                      <div className="rounded-md border bg-muted"></div>
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
                <TabsContent value="edit" className="mt-0 border-0 p-0 h-full">
                  <div className="h-full flex flex-col space-y-4">
                    <div className="grid h-full gap-6 lg:grid-cols-2">
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-1 flex-col space-y-2">
                          <Label htmlFor="input">Input</Label>
                          <Textarea
                            id="input"
                            placeholder="We is going to the market."
                            className="flex-1 lg:min-h-[580px]"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="instructions">Instructions</Label>
                          <Textarea
                            id="instructions"
                            placeholder="Fix the grammar."
                          />
                        </div>
                      </div>
                      <div className="mt-[21px] min-h-[400px] rounded-md border bg-muted lg:min-h-[500px]" />
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
