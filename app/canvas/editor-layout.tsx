"use client";

import { AnimatePresence } from "framer-motion";
import { PreviewComponent } from "./preview-component";
import { useEffect, useState } from "react";
import type { TreeItem } from "@/app/(main)/(editor)/types";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelectedItem } from "@/app/context/selected-item-context";
import { Icons } from "@/components/icons";
import { onMove } from "../(main)/(editor)/utils/util";
import { useTree } from "@/components/context/tree-context";

export function EditorLayout() {
  const previewMode = "desktop";

  const [receiverDataFromTree, setReceiverDataFromTree] = useState(false);
  const { selectedItem, setSelectedItem } = useSelectedItem();

  useEffect(() => {
    // prevent loop send message
    if (!receiverDataFromTree) {
      sendMessageToParent(selectedItem);
    }
    setReceiverDataFromTree(false);
  }, [selectedItem]);

  const sendMessageToParent = (selectedItemPass: TreeItem | null) => {
    const message = { data: selectedItemPass };
    try {
      window.parent.postMessage(message, "*"); // Envia a mensagem para a página pai
    } catch (e) {
      console.log("err", e);
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (event: MessageEvent) => {
      // Aqui você pode adicionar verificações de origem se necessário
      if (event.origin === window.location.origin) {
        if (event.data?.data) {
          setReceiverDataFromTree(true);
          setSelectedItem(event.data.data); // Atualiza a mensagem recebida do iframe
        }
      }
    };

    window.addEventListener("message", handleReceiveMessage);

    return () => {
      window.removeEventListener("message", handleReceiveMessage);
    };
  }, []);

  // window.addEventListener('message', function(event) {
  //   // console.log("Message received from the parent: " + event.data); // Message received from parent
  //   // setSelectedItem(event.data.data)
  // });

  const {getTree, setTree} = useTree();

  const tree = getTree('root')

  function onSelect(e: TreeItem) {
    setSelectedItem(e);
    console.log("onSelect");
  }

  function handleMove(sourceId: string, targetId: string, position: "before" | "after" | "inside") {
    onMove(sourceId, targetId, position, tree, setTree)
  }

  function onRemove() {
    console.log("onRemove");
  }

  function onUpdate() {
    console.log("onUpdate");
  }

  function addComponent() {
    console.log("addComponent");
  }

  function setLevelHovered() {
    console.log("setLevelHovered");
  }

  
  const [isClient, setIsClient] = useState(false); // Estado para saber se está no cliente

  useEffect(() => {
    setIsClient(true); // Indica que o componente foi montado no cliente
  }, []);

  if (!isClient || !tree) {
    return (
      <div className="relative inset-0 z-10 mt-10 flex h-[--container-height] w-full items-center justify-center gap-2 bg-background text-sm text-muted-foreground">
        <Icons.spinner className="h-4 w-4 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <ScrollArea className="h-screen">
      <DndProvider backend={HTML5Backend}>
        <div
          className={`w-full h-screen mx-auto bg-white dark:bg-black p-0.5 transition-all duration-300 ease-in-out ${
            previewMode === "desktop"
              ? "max-w-full"
              : previewMode === "tablet"
              ? "max-w-2xl"
              : "max-w-sm"
          }`}
        >
          {/* <div className="fixed top-0">
            =={JSON.stringify(tree)}==
          </div> */}
          <div className="rounded-md overflow-hidden">
            <AnimatePresence>
              {/* {tree?.map((item: TreeItem, i: number) => ( */}
                <PreviewComponent
                  key={`preview-root`}
                  itemId={`root`}
                  level={0}
                  selectedItemId={selectedItem?.id ?? null}
                  onSelect={onSelect}
                  onMove={handleMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  setLevelHovered={setLevelHovered}
                />
              {/* ))} */}
            </AnimatePresence>
          </div>
        </div>
      </DndProvider>
    </ScrollArea>
  );
}
