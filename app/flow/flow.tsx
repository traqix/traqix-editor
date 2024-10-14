"use client"

import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import {
  Bot,
  Search,
  SquareTerminal,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import { AccountSwitcher } from "@/app/(main)/(editor)/components/account-switcher"
// import { EditorDisplay } from "@/app/(main)/(editor)/components/editor-display"
import { EditorLeft } from "@/app/(main)/(editor)/components/editor-left";

// import useLocalStorage from "@/hooks/use-local-storage";
import { useEffect, useState } from "react";
import { useTree } from "@/components/context/tree-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TreeItem } from '../(main)/(editor)/types'
import { DialogTableMemory } from '../(main)/(editor)/components/table-memory'
import EditWorkFlow from './edit-workflow';
import EnhancedAutomationSystem from './enhanced-automation-system';
import { ReactFlowProvider } from 'reactflow';

// import initialData from "@/components/preset-editor/initial-tree.json";
// import { Icons } from "@/components/icons";

export default function Flow() {
  
  const defaultLayout = [3.6, 8.5, 48];
  const navCollapsedSize = 3.6;
  const [isCollapsed, setIsCollapsed] = useState(false);

  // const initialTreeRoot: TreeItem[] = initialData;

  // console.log("ININITNITNITNTI ", initialTreeRoot)
  // const init: TreeItem = {...initialTreeRoot[0], lastUpdate: new Date().valueOf()}

  const { getTree, setTree } = useTree();
  const treeRoot = getTree('root')

  const [modeResponsive, setModeResponsive] = useState('desktop')

  const [messageFromIframe, setMessageFromIframe] = useState<TreeItem | undefined>(undefined);
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(undefined);
  const [selectedItem, setSelectedItem] = useState<TreeItem | undefined>(undefined);

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
    setSelectedItemId(messageFromIframe?.id ?? undefined)
    // sendMessageToIframe(messageFromIframe);
  }, [messageFromIframe]);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:editor=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-screen items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={12}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          }}
          onResize={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`;
          }}
          className={cn(
            "bg-muted dark:bg-dark-tremor-background-subtle",
            isCollapsed && "min-w-[49px] transition-all duration-300 ease-in-out"
          )}
        >
          {/* <div
            className={cn(
              "flex h-[49px] items-center justify-center",
              isCollapsed ? "h-[49px]" : "px-2"
            )}
          >
            <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} />
          </div>
          <Separator /> */}
          {/* <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Inbox",
                label: "128",
                icon: Inbox,
                variant: "secondary",
              },
              {
                title: "Drafts",
                label: "9",
                icon: File,
                variant: "ghost",
              },
              {
                title: "Sent",
                label: "",
                icon: Send,
                variant: "ghost",
              },
              {
                title: "Junk",
                label: "23",
                icon: ArchiveX,
                variant: "ghost",
              },
              {
                title: "Trash",
                label: "",
                icon: Trash2,
                variant: "ghost",
              },
              {
                title: "Archive",
                label: "",
                icon: Archive,
                variant: "ghost",
              },
            ]}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Social",
                label: "972",
                icon: Users2,
                variant: "ghost",
              },
              {
                title: "Updates",
                label: "342",
                icon: AlertCircle,
                variant: "ghost",
              },
              {
                title: "Forums",
                label: "128",
                icon: MessagesSquare,
                variant: "ghost",
              },
              {
                title: "Shopping",
                label: "8",
                icon: ShoppingCart,
                variant: "ghost",
              },
              {
                title: "Promotions",
                label: "21",
                icon: Archive,
                variant: "ghost",
              },
            ]}
          /> */}
          <div className="mx-auto">
            <div className="border-b dark:border-tremor-background-emphasis p-4 text-center">
              <Button variant="outline" size="icon" aria-label="Home" className="bg-gradient-to-tr from-yellow-500 via-green-500 to-blue-500">
                <h1 className="font-bold text-3xl relative -right-1 h-full top-0.5">
                  T<small className="-left-1.5 relative text-[1rem]">x</small>
                </h1>
              </Button>
            </div>
            <nav className="grid gap-1 p-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg mx-auto w-full "
                      aria-label="Playground"
                    >
                      <SquareTerminal className="size-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={5}>
                  Playground
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/flow"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg mx-auto w-full border-[0.5px] dark:border-tremor-background-emphasis bg-background/20"
                      aria-label="Models"
                    >
                      <Bot className="size-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={5}>
                  Models
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTableMemory />
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg mx-auto"
                    aria-label="API"
                    
                  >
                    <Table2 className="size-5" />
                  </Button> */}
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={5}>
                  API
                </TooltipContent>
              </Tooltip>
              {/* <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg mx-auto"
                    aria-label="Documentation"
                  >
                    <Book className="size-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={5}>
                  Documentation
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg mx-auto"
                    aria-label="Settings"
                  >
                    <Settings2 className="size-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={5}>
                  Settings
                </TooltipContent>
              </Tooltip> */}
            </nav>
            {/* <nav className="mt-auto grid gap-1 p-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-auto rounded-lg mx-auto"
                    aria-label="Help"
                  >
                    <LifeBuoy className="size-5" />
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
                    className="mt-auto rounded-lg mx-auto"
                    aria-label="Account"
                  >
                    <SquareUser className="size-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={5}>
                  Account
                </TooltipContent>
              </Tooltip>
            </nav> */}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />
        {/* <ResizablePanel
          defaultSize={defaultLayout[1]}
          minSize={14}
          maxSize={22}
          className="bg-background"
        >
          <Tabs defaultValue="all">
            <div className="flex items-center p-4">
              <h1 className="text-xl font-bold">TRAQIX</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Layers
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Pages
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="bg-backgroundd/95 p-4 pt-0 backdrop-blur supports-[backdrop-filter]:bg-backgroundd/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <EditorLeft key={`eddd`} treeRoot={treeRoot} selectedItemId={selectedItemId} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              {/* <EditorLeft key={`easd`} /> * /}
              VVVV
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle /> */}
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={48}>
          {/* <div className="containerr flex flex-col items-start justify-between space-y-2 p-4 sm:flex-row sm:items-center sm:space-y-0 md:h-[64px]">
            <h2 className="text-lg font-semibold">Flow</h2>
            
          </div> */}

          <div className="min-h-screen bg-background">

            <DndProvider backend={HTML5Backend}>
              {/* <EditWorkFlow /> */}
              <ReactFlowProvider>
                <EnhancedAutomationSystem />
              </ReactFlowProvider>
            </DndProvider>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}

//     <div className="min-h-screen bg-background">

//       <DndProvider backend={HTML5Backend}>
//         <FlowDiagram />
//       </DndProvider>
//     </div>
//   )
// }