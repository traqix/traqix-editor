"use client"

import { Button } from "@/components/ui/button";
import { Eye, Redo, Undo } from "lucide-react";
import { useState } from "react";
import type { TreeItem } from "@/app/(main)/(editor)/types";


import initialData from '@/components/preset-editor/initial-tree.json';
import useMultipleLocalStorage from "@/hooks/use-multiple-local-storage";
// import useLocalStorage from "@/hooks/use-local-storage";


export function HistoryControls() {

  const initialTree: TreeItem[] = initialData;
  const [tree, setTree] = useMultipleLocalStorage(["tx_current"], [initialTree])
  
  const [currentPage, setCurrentPage] = useState("Home");
  const [history, setHistory] = useState<Record<string, TreeItem[][]>>({
    Home: [initialTree],
  });
  const [historyIndex, setHistoryIndex] = useState<Record<string, number>>({
    Home: 0,
  });

  const [pageContent, setPageContent] = useState<Record<string, TreeItem[]>>({
    Home: initialTree,
  });

  const undo = () => {
    if (historyIndex[currentPage] > 0) {
      setHistoryIndex((prev) => ({
        ...prev,
        [currentPage]: prev[currentPage] - 1,
      }));
      const newTree = history[currentPage][historyIndex[currentPage] - 1];
      // setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
      setTree('tx_current', newTree);
    }
  };

  const redo = () => {
    if (historyIndex[currentPage] < history[currentPage].length - 1) {
      setHistoryIndex((prev) => ({
        ...prev,
        [currentPage]: prev[currentPage] + 1,
      }));
      const newTree = history[currentPage][historyIndex[currentPage] + 1];
      // setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
      setTree('tx_current', newTree);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={undo}
          disabled={historyIndex[currentPage] === 0}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={redo}
          disabled={
            historyIndex[currentPage] === history[currentPage].length - 1
          }
        >
          <Redo className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
