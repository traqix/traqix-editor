"use client";

import { AnimatePresence } from "framer-motion";
import { PreviewComponent } from "./preview-component";
// import useLocalStorage from "@/hooks/use-local-storage";
import { useEffect, useState } from "react";
import type { TreeItem } from "@/app/(main)/(editor)/types";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import initialData from "@/components/preset-editor/initial-tree.json";
import useMultipleLocalStorage from "@/hooks/use-multiple-local-storage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelectedItem } from "@/app/context/selected-item-context";

export function MainEditor() {
  const previewMode = "desktop";

  const initialTree: TreeItem[] = initialData;
  const [receiverDataFromTree, setReceiverDataFromTree] = useState(false);
  const { selectedItem, setSelectedItem } = useSelectedItem();
  // const [tree] = useLocalStorage('tree');

  useEffect(() => {
    // prevent loop send message
    if (!receiverDataFromTree) {
      sendMessageToParent(selectedItem);
    }
    setReceiverDataFromTree(false);
  }, [selectedItem]);

  const sendMessageToParent = (selectedItemPass: TreeItem | null) => {
    const message = { data: selectedItemPass };
    window.parent.postMessage(message, "*"); // Envia a mensagem para a página pai
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


  function onSelect(e: TreeItem) {
    setSelectedItem(e);
    console.log("onSelect");
  }

  function onMove() {
    console.log("onMove");
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

  const [tree] = useMultipleLocalStorage(
    ["tx_current"],
    [initialTree]
  );
  
  const [isClient, setIsClient] = useState(false); // Estado para saber se está no cliente

  useEffect(() => {
    setIsClient(true); // Indica que o componente foi montado no cliente
  }, []);

  if (!isClient || !tree[0]) {
    // Mostra o "Carregando" enquanto o cliente está sendo montado ou o localStorage não está pronto
    return <div>Carregando...</div>;
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
          <div className="rounded-md overflow-hidden">
            <AnimatePresence>
              {tree?.map((item: TreeItem, i: number) => (
                <PreviewComponent
                  key={`preview-${i}`}
                  item={item}
                  level={0}
                  selectedItemId={selectedItem?.id ?? null}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  addComponent={addComponent}
                  setLevelHovered={setLevelHovered}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </DndProvider>
    </ScrollArea>
  );
}
