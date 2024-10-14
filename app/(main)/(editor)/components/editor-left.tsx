import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
// import useLocalStorage from "@/hooks/use-local-storage";
// import { Separator } from "@/components/ui/separator"
// import { useCurrentTreeItem } from "@/storage/tree-item-storage"
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TreeNode } from "./tree-node";
import type { TreeItem } from "@/app/(main)/(editor)/types";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Icons } from "@/components/icons";
import Component from "@/block/chart-area-axes";
import ComponentAdder from "./component-adder";

interface EditorLeftProps {
  selectedItemId?: string
  treeRoot?: TreeItem;
}

export function EditorLeft({ selectedItemId, treeRoot }: EditorLeftProps) {
  // const [mail, setEditor] = useEditor()
  const [isClient, setIsClient] = useState(false); // Estado para saber se está no cliente

  useEffect(() => {
    setIsClient(true); // Indica que o componente foi montado no cliente
  }, []);


  if (!isClient || !treeRoot) {
    return (
      <div className="relative inset-0 z-10 flex h-[--container-height] w-full items-center justify-center gap-2 bg-background text-sm text-muted-foreground">
        <Icons.spinner className="h-4 w-4 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!treeRoot) {
    return <>Error</>
  }

  return (
    <div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="flex flex-col p-4 pt-0 mb-10 mt-1">
          <DndProvider backend={HTML5Backend}>
            <AnimatePresence>
              {/* {tree?.map((item: TreeItem, i: number) => ( */}
                <TreeNode
                  position={0}
                  totalChilds={1}
                  key={`tree-node-tx-current`}
                  itemId={"root"}
                  parent={treeRoot}
                  level={0}
                  selectedItemId={selectedItemId}
                />
              {/* ))} */}
            </AnimatePresence>
          </DndProvider>
          {/* {items.map((item) => (
            <button
              key={item.id}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border dark:border-dark-tremor-content-subtle px-3 py-1 text-left text-sm transition-all hover:bg-accent",
                mail.selected === item.id && "bg-muted"
              )}
              onClick={() =>
                setEditor({
                  ...mail,
                  selected: item.id,
                })
              }
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{item.name}</div>
                    {!item.read && (
                      <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  {/* <div
                    className={cn(
                      "ml-auto text-xs",
                      mail.selected === item.id
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {formatDistanceToNow(new Date(item.date), {
                      addSuffix: true,
                    })}
                  </div> * /}
                </div>
                {/* <div className="text-xs font-medium">{item.subject}</div> * /}
              </div>
              {/* <div className="line-clamp-2 text-xs text-muted-foreground">
                {item.text.substring(0, 300)}
              </div>
              {item.labels.length ? (
                <div className="flex items-center gap-2">
                  {item.labels.map((label) => (
                    <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                      {label}
                    </Badge>
                  ))}
                </div>
              ) : null} * /}
            </button>
          ))} */}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <ComponentAdder />
    </div>
  )
}

// function getBadgeVariantFromLabel(
//   label: string
// ): ComponentProps<typeof Badge>["variant"] {
//   if (["work"].includes(label.toLowerCase())) {
//     return "default"
//   }

//   if (["personal"].includes(label.toLowerCase())) {
//     return "outline"
//   }

//   return "secondary"
// }
