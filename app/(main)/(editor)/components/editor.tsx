"use client";

import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
// import { AccountSwitcher } from "@/app/(main)/(editor)/components/account-switcher"
// import { EditorDisplay } from "@/app/(main)/(editor)/components/editor-display"
import { EditorList } from "@/app/(main)/(editor)/components/editor-left";
import { Nav } from "@/app/(main)/(editor)/components/nav";
import { type Editor } from "@/app/(main)/(editor)/data";
import { PresetSelector } from "@/app/(main)/(editor)/components/preset-selector";
import { PresetSave } from "@/app/(main)/(editor)/components/preset-save";
import { CodeViewer } from "@/app/(main)/(editor)/components/code-viewer";
import { PresetShare } from "@/app/(main)/(editor)/components/preset-share";
import { PresetActions } from "@/app/(main)/(editor)/components/preset-actions";
import PlaygroundPage from "./board";
import { ResponsiveControl } from "./responsive-control";
import { ThemeSwitch } from "./theme-switch";
import { HistoryControls } from "./history-controls";

// import useLocalStorage from "@/hooks/use-local-storage";
import { PresetControls } from "./preset-controls";
import { useState } from "react";

export function Editor() {
  const defaultLayout = [3.6, 7.7, 48];
  const navCollapsedSize = 3.6;
  const [isCollapsed, setIsCollapsed] = useState(false);

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
            isCollapsed &&
              "min-w-[49px] transition-all duration-300 ease-in-out pt-2"
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
          <Nav
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
          />
        </ResizablePanel>

        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={defaultLayout[1]}
          minSize={14}
          maxSize={22}
        >
          <Tabs defaultValue="all">
            <div className="flex items-center p-4">
              <h1 className="text-xl font-bold">TRAQIX</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All editor
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Unread
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
              <EditorList key={`eddd`} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              {/* <EditorList key={`easd`} /> */}
              VVVV
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={48}>
          <div className="containerr flex flex-col items-start justify-between space-y-2 p-4 sm:flex-row sm:items-center sm:space-y-0 md:h-[64px]">
            <h2 className="text-lg font-semibold">Playground</h2>
            <div className="ml-auto hidden md:flex w-full space-x-2 sm:justify-end">
              <ThemeSwitch />
              <ResponsiveControl />
              <PresetControls />
              <PresetSelector presets={[]} />
              <PresetSave />
              <HistoryControls />
              <div className="hidden space-x-2 md:flex">
                <CodeViewer />
                <PresetShare />
              </div>
              <PresetActions />
            </div>
          </div>

          {/* <EditorDisplay
            editor={mails.find((item) => item.id === editor.selected) || null}
          /> */}
          <PlaygroundPage />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
