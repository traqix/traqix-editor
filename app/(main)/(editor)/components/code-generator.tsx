import React, { useState } from "react";
import { TreeItem } from "../types";
import { useTree } from "@/components/context/tree-context";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const generateTSX = (
  item: TreeItem,
  getTree: (key: string) => TreeItem | undefined,
  indent: string = "  ", // Define o recuo padrão
  level: number = 0 // Nível de profundidade atual
): string => {
  const children = item.children
    ?.map((childId) => {
      const childItem = getTree(childId);
      if (childItem) {
        return generateTSX(childItem, getTree, indent, level + 1);
      }
      return null; // Se não encontrar o filho, retorna null
    })
    .filter(Boolean) as string[]; // Remove os nulls

  // Gera a string do código TSX para o item atual
  const props = item.props
    ? Object.entries(item.props)
        .map(([key, value]) => {
          return `${key}="${value}"`; // Converte as props para formato de string
        })
        .join(" ")
    : "";

  // Adiciona o recuo e formata o código
  const indentation = indent.repeat(level);

  if (item.type == "text") {
    return `${item.props?.content}`.trim();
  }

  return `${indentation}<${item.type} ${props}>
${children.length > 0 ? children.join("\n") : ""}
${indentation}</${item.type}>`.trim();
};

const generateHTML = (
  item: TreeItem,
  getTree: (key: string) => TreeItem | undefined,
  indent: string = "  ",
  level: number = 0
): string => {
  const children = item.children
    ?.map((childId) => {
      const childItem = getTree(childId);
      if (childItem) {
        return generateHTML(childItem, getTree, indent, level + 1);
      }
      return null; // Se não encontrar o filho, retorna null
    })
    .filter(Boolean) as string[]; // Remove os nulls

  // Gera a string do código HTML para o item atual
  const props = item.props
    ? Object.entries(item.props)
        .map(([key, value]) => {
          return `${key.replace('className', 'class')}="${value}"`; // Converte as props para formato de string
        })
        .join(" ")
    : "";

  const indentation = indent.repeat(level);

  if (item.type == "text") {
    return `${item.props?.content}`.trim();
  }

  return `${indentation}<${item.type} ${props}>
${children.length > 0 ? children.join("\n") : ""}
${indentation}</${item.type}>`.trim();
};

const CodeGenerator: React.FC<{ rootItem?: TreeItem }> = ({ rootItem }) => {
  const { getTree } = useTree();
  const [tsxCode, setTsxCode] = useState<string>("");
  const [htmlCode, setHtmlCode] = useState<string>("");

  const handleGenerateTSXCode = () => {
    if (rootItem) {
      const tsx = generateTSX(rootItem, getTree);
      setTsxCode(tsx);
    }
  };

  const handleGenerateHTMLCode = () => {
    if (rootItem) {
      const html = generateHTML(rootItem, getTree);
      setHtmlCode(html);
    }
  };

  return (
    <div>
      <Button onClick={handleGenerateTSXCode}>Gerar Código TSX</Button>
      <Textarea
        value={tsxCode}
        onChange={(e) => setTsxCode(e.target.value)}
        rows={10}
        cols={50}
        className="bg-foreground"
      />
      <Button onClick={handleGenerateHTMLCode}>Gerar Código HTML</Button>
      <Textarea
        value={htmlCode}
        onChange={(e) => setHtmlCode(e.target.value)}
        rows={10}
        cols={50}
        className="bg-foreground"
      />
    </div>
  );
};

export default CodeGenerator;
