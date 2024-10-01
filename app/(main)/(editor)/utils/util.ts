import type { TreeItem } from "@/app/(main)/(editor)/types";

import traverse from "@babel/traverse";
import { parse } from "@babel/parser";
import {
  ARTICLE_ACCEPTED_COMPONENTS,
  ASIDE_ACCEPTED_COMPONENTS,
  AUDIO_ACCEPTED_COMPONENTS,
  BLOCKQUOTE_ACCEPTED_COMPONENTS,
  BUTTON_ACCEPTED_COMPONENTS,
  DETAILS_ACCEPTED_COMPONENTS,
  DIV_ACCEPTED_COMPONENTS,
  FOOTER_ACCEPTED_COMPONENTS,
  FORM_ACCEPTED_COMPONENTS,
  H1_ACCEPTED_COMPONENTS,
  H2_ACCEPTED_COMPONENTS,
  H3_ACCEPTED_COMPONENTS,
  H4_ACCEPTED_COMPONENTS,
  H5_ACCEPTED_COMPONENTS,
  H6_ACCEPTED_COMPONENTS,
  HEADER_ACCEPTED_COMPONENTS,
  IFRAME_ACCEPTED_COMPONENTS,
  IMG_ACCEPTED_COMPONENTS,
  INPUT_ACCEPTED_COMPONENTS,
  LI_ACCEPTED_COMPONENTS,
  NAV_ACCEPTED_COMPONENTS,
  NOSCRIPT_ACCEPTED_COMPONENTS,
  OL_ACCEPTED_COMPONENTS,
  P_ACCEPTED_COMPONENTS,
  SCRIPT_ACCEPTED_COMPONENTS,
  SECTION_ACCEPTED_COMPONENTS,
  SELECT_ACCEPTED_COMPONENTS,
  SOURCE_ACCEPTED_COMPONENTS,
  STYLE_ACCEPTED_COMPONENTS,
  SUMMARY_ACCEPTED_COMPONENTS,
  TEXTAREA_ACCEPTED_COMPONENTS,
  TRACK_ACCEPTED_COMPONENTS,
  UL_ACCEPTED_COMPONENTS,
  VIDEO_ACCEPTED_COMPONENTS,
} from "./accepted-components";
import {
  TREE_ARTICLE_ACCEPTED_COMPONENTS,
  TREE_ASIDE_ACCEPTED_COMPONENTS,
  TREE_AUDIO_ACCEPTED_COMPONENTS,
  TREE_BLOCKQUOTE_ACCEPTED_COMPONENTS,
  TREE_BUTTON_ACCEPTED_COMPONENTS,
  TREE_DETAILS_ACCEPTED_COMPONENTS,
  TREE_DIV_ACCEPTED_COMPONENTS,
  TREE_FOOTER_ACCEPTED_COMPONENTS,
  TREE_FORM_ACCEPTED_COMPONENTS,
  TREE_H1_ACCEPTED_COMPONENTS,
  TREE_H2_ACCEPTED_COMPONENTS,
  TREE_H3_ACCEPTED_COMPONENTS,
  TREE_H4_ACCEPTED_COMPONENTS,
  TREE_H5_ACCEPTED_COMPONENTS,
  TREE_H6_ACCEPTED_COMPONENTS,
  TREE_HEADER_ACCEPTED_COMPONENTS,
  TREE_IFRAME_ACCEPTED_COMPONENTS,
  TREE_IMG_ACCEPTED_COMPONENTS,
  TREE_INPUT_ACCEPTED_COMPONENTS,
  TREE_LI_ACCEPTED_COMPONENTS,
  TREE_NAV_ACCEPTED_COMPONENTS,
  TREE_NOSCRIPT_ACCEPTED_COMPONENTS,
  TREE_OL_ACCEPTED_COMPONENTS,
  TREE_P_ACCEPTED_COMPONENTS,
  TREE_SCRIPT_ACCEPTED_COMPONENTS,
  TREE_SECTION_ACCEPTED_COMPONENTS,
  TREE_SELECT_ACCEPTED_COMPONENTS,
  TREE_SOURCE_ACCEPTED_COMPONENTS,
  TREE_STYLE_ACCEPTED_COMPONENTS,
  TREE_SUMMARY_ACCEPTED_COMPONENTS,
  TREE_TEXTAREA_ACCEPTED_COMPONENTS,
  TREE_TRACK_ACCEPTED_COMPONENTS,
  TREE_UL_ACCEPTED_COMPONENTS,
  TREE_VIDEO_ACCEPTED_COMPONENTS,
} from "./accepted-components-tree";
import useMultipleLocalStorage from "@/hooks/use-multiple-local-storage";
// import useLocalStorage from "@/hooks/use-local-storage";
// import { useCurrentTreeItem } from "@/storage/tree-item-storage";

export const getAcceptedComponentsTree = (component: string) => {
  if (component === "TREE_DIV") {
    return Object.values(TREE_DIV_ACCEPTED_COMPONENTS);
  // } else if (component === "TREE_TEXT") {
  //   return Object.values(TREE_TEXT_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_HEADER") {
    return Object.values(TREE_HEADER_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_SECTION") {
    return Object.values(TREE_SECTION_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_ARTICLE") {
    return Object.values(TREE_ARTICLE_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_ASIDE") {
    return Object.values(TREE_ASIDE_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_FOOTER") {
    return Object.values(TREE_FOOTER_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_NAV") {
    return Object.values(TREE_NAV_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_FORM") {
    return Object.values(TREE_FORM_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_P") {
    return Object.values(TREE_P_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_BLOCKQUOTE") {
    return Object.values(TREE_BLOCKQUOTE_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_H1") {
    return Object.values(TREE_H1_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_H2") {
    return Object.values(TREE_H2_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_H3") {
    return Object.values(TREE_H3_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_H4") {
    return Object.values(TREE_H4_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_H5") {
    return Object.values(TREE_H5_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_H6") {
    return Object.values(TREE_H6_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_UL") {
    return Object.values(TREE_UL_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_OL") {
    return Object.values(TREE_OL_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_LI") {
    return Object.values(TREE_LI_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_IMG") {
    return Object.values(TREE_IMG_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_BUTTON") {
    return Object.values(TREE_BUTTON_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_INPUT") {
    return Object.values(TREE_INPUT_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_TEXTAREA") {
    return Object.values(TREE_TEXTAREA_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_SELECT") {
    return Object.values(TREE_SELECT_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_AUDIO") {
    return Object.values(TREE_AUDIO_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_VIDEO") {
    return Object.values(TREE_VIDEO_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_SOURCE") {
    return Object.values(TREE_SOURCE_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_TRACK") {
    return Object.values(TREE_TRACK_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_SCRIPT") {
    return Object.values(TREE_SCRIPT_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_NOSCRIPT") {
    return Object.values(TREE_NOSCRIPT_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_IFRAME") {
    return Object.values(TREE_IFRAME_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_STYLE") {
    return Object.values(TREE_STYLE_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_DETAILS") {
    return Object.values(TREE_DETAILS_ACCEPTED_COMPONENTS);
  } else if (component === "TREE_SUMMARY") {
    return Object.values(TREE_SUMMARY_ACCEPTED_COMPONENTS);
  }
  // Adicione aqui outras verificações conforme necessário
  return [];
};



export const getAcceptedComponents = (component: string) => {
  if (component === "DIV") {
    return Object.values(DIV_ACCEPTED_COMPONENTS);
  // } else if (component === "TEXT") {
  //   return Object.values(TEXT_ACCEPTED_COMPONENTS);
  } else if (component === "HEADER") {
    return Object.values(HEADER_ACCEPTED_COMPONENTS);
  } else if (component === "SECTION") {
    return Object.values(SECTION_ACCEPTED_COMPONENTS);
  } else if (component === "ARTICLE") {
    return Object.values(ARTICLE_ACCEPTED_COMPONENTS);
  } else if (component === "ASIDE") {
    return Object.values(ASIDE_ACCEPTED_COMPONENTS);
  } else if (component === "FOOTER") {
    return Object.values(FOOTER_ACCEPTED_COMPONENTS);
  } else if (component === "NAV") {
    return Object.values(NAV_ACCEPTED_COMPONENTS);
  } else if (component === "FORM") {
    return Object.values(FORM_ACCEPTED_COMPONENTS);
  } else if (component === "P") {
    return Object.values(P_ACCEPTED_COMPONENTS);
  } else if (component === "BLOCKQUOTE") {
    return Object.values(BLOCKQUOTE_ACCEPTED_COMPONENTS);
  } else if (component === "H1") {
    return Object.values(H1_ACCEPTED_COMPONENTS);
  } else if (component === "H2") {
    return Object.values(H2_ACCEPTED_COMPONENTS);
  } else if (component === "H3") {
    return Object.values(H3_ACCEPTED_COMPONENTS);
  } else if (component === "H4") {
    return Object.values(H4_ACCEPTED_COMPONENTS);
  } else if (component === "H5") {
    return Object.values(H5_ACCEPTED_COMPONENTS);
  } else if (component === "H6") {
    return Object.values(H6_ACCEPTED_COMPONENTS);
  } else if (component === "UL") {
    return Object.values(UL_ACCEPTED_COMPONENTS);
  } else if (component === "OL") {
    return Object.values(OL_ACCEPTED_COMPONENTS);
  } else if (component === "LI") {
    return Object.values(LI_ACCEPTED_COMPONENTS);
  } else if (component === "IMG") {
    return Object.values(IMG_ACCEPTED_COMPONENTS);
  } else if (component === "BUTTON") {
    return Object.values(BUTTON_ACCEPTED_COMPONENTS);
  } else if (component === "INPUT") {
    return Object.values(INPUT_ACCEPTED_COMPONENTS);
  } else if (component === "TEXTAREA") {
    return Object.values(TEXTAREA_ACCEPTED_COMPONENTS);
  } else if (component === "SELECT") {
    return Object.values(SELECT_ACCEPTED_COMPONENTS);
  } else if (component === "AUDIO") {
    return Object.values(AUDIO_ACCEPTED_COMPONENTS);
  } else if (component === "VIDEO") {
    return Object.values(VIDEO_ACCEPTED_COMPONENTS);
  } else if (component === "SOURCE") {
    return Object.values(SOURCE_ACCEPTED_COMPONENTS);
  } else if (component === "TRACK") {
    return Object.values(TRACK_ACCEPTED_COMPONENTS);
  } else if (component === "SCRIPT") {
    return Object.values(SCRIPT_ACCEPTED_COMPONENTS);
  } else if (component === "NOSCRIPT") {
    return Object.values(NOSCRIPT_ACCEPTED_COMPONENTS);
  } else if (component === "IFRAME") {
    return Object.values(IFRAME_ACCEPTED_COMPONENTS);
  } else if (component === "STYLE") {
    return Object.values(STYLE_ACCEPTED_COMPONENTS);
  } else if (component === "DETAILS") {
    return Object.values(DETAILS_ACCEPTED_COMPONENTS);
  } else if (component === "SUMMARY") {
    return Object.values(SUMMARY_ACCEPTED_COMPONENTS);
  }
  // Adicione aqui outras verificações conforme necessário
  return [];
};

export const onMove = (
  draggedId: string,
  targetId: string,
  position: string
) => {
  // const newTree = JSON.parse(JSON.stringify(pageContent[currentPage]));
  // const findAndRemove = (items: TreeItem[]): TreeItem | null => {
  //   for (let i = 0; i < items.length; i++) {
  //     if (items[i].id === draggedId) {
  //       return items.splice(i, 1)[0];
  //     }
  //     if (items[i].children) {
  //       const found = findAndRemove(items[i].children!);
  //       if (found) return found;
  //     }
  //   }
  //   return null;
  // };
  // const draggedItem = findAndRemove(newTree);
  // if (!draggedItem) return;
  // const findAndInsert = (items: TreeItem[]) => {
  //   for (let i = 0; i < items.length; i++) {
  //     const currentItem = items[i] ?? { allowsChildren: false, children: [] };
  //     if (currentItem.id === targetId) {
  //       if (currentItem.allowsChildren) {
  //         if (!currentItem.children) currentItem.children = [];
  //         currentItem.children.push(draggedItem);
  //       } else {
  //         items.splice(i + 1, 0, draggedItem);
  //       }
  //       return true;
  //     }
  //     if (currentItem.children && findAndInsert(currentItem.children)) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };
  // findAndInsert(newTree);
  // setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
  // setTree(newTree);
  // addToHistory(newTree);
};

export const onRemove = (id: string) => {
  // const newTree = JSON.parse(JSON.stringify(pageContent[currentPage]));
  // const removeItem = (items: TreeItem[]) => {
  //   for (let i = 0; i < items.length; i++) {
  //     if (items[i].id === id) {
  //       items.splice(i, 1);
  //       return true;
  //     }
  //     if (items[i].children && removeItem(items[i].children!)) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };
  // removeItem(newTree);
  // setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
  // setTree(newTree);
  // addToHistory(newTree);
};

export const onRename = (id: string, newName: string) => {
  // const newTree = JSON.parse(JSON.stringify(pageContent[currentPage]));
  // const renameItem = (items: TreeItem[]) => {
  //   for (let i = 0; i < items.length; i++) {
  //     if (items[i].id === id) {
  //       items[i].name = newName;
  //       return true;
  //     }
  //     if (items[i].children && renameItem(items[i].children!)) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };
  // renameItem(newTree);
  // setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
  // setTree(newTree);
  // addToHistory(newTree);
};

export const addToHistory = (newTree: TreeItem[]) => {
  // setHistory((prev) => {
  //   const newHistory = { ...prev };
  //   if (!newHistory[currentPage]) {
  //     newHistory[currentPage] = [];
  //   }
  //   newHistory[currentPage] = [
  //     ...newHistory[currentPage].slice(0, historyIndex[currentPage] + 1),
  //     newTree,
  //   ];
  //   return newHistory;
  // });
  // setHistoryIndex((prev) => ({
  //   ...prev,
  //   [currentPage]: (prev[currentPage] || 0) + 1,
  // }));
};

export const handleUpdate = (id: string, updates: Partial<TreeItem>, tree: TreeItem[], setTree: any) => {
  const updateItem = (items: TreeItem[]): TreeItem[] => {
    return items.map((item) => {
      if (item.id === id) {
        // Retorna uma nova versão do item atualizado
        return { ...item, ...updates };
      }

      // Se houver filhos, recursivamente tenta atualizá-los
      if (item.children && item.children.length > 0) {
        return { ...item, children: updateItem(item.children) };
      }

      // Retorna o item original se ele não foi modificado
      return item;
    });
  };

  // Cria uma nova árvore com a atualização
  const newTree = updateItem(tree);

  console.log("newTree", newTree)
  setTree('tx_current', newTree[0]);
  // setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
  // addToHistory(newTree);
  return
};

export const undo = () => {
  // if (historyIndex[currentPage] > 0) {
  //   setHistoryIndex((prev) => ({
  //     ...prev,
  //     [currentPage]: prev[currentPage] - 1,
  //   }));
  //   const newTree = history[currentPage][historyIndex[currentPage] - 1];
  //   setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
  //   setTree(newTree);
  // }
};

export const redo = () => {
  // if (historyIndex[currentPage] < history[currentPage].length - 1) {
  //   setHistoryIndex((prev) => ({
  //     ...prev,
  //     [currentPage]: prev[currentPage] + 1,
  //   }));
  //   const newTree = history[currentPage][historyIndex[currentPage] + 1];
  //   setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
  //   setTree(newTree);
  // }
};

export const exportJSON = () => {
  // const json = JSON.stringify(pageContent, null, 2);
  // const blob = new Blob([json], { type: "application/json" });
  // const url = URL.createObjectURL(blob);
  // const a = document.createElement("a");
  // a.href = url;
  // a.download = "layout.json";
  // a.click();
  // URL.revokeObjectURL(url);
  // setToastMessage("Layout exported successfully");
  // setShowToast(true);
};

export const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
  // const file = e.target.files?.[0];
  // if (file) {
  //   const reader = new FileReader();
  //   reader.onload = (event) => {
  //     try {
  //       const json = JSON.parse(event.target?.result as string);
  //       setPageContent(json);
  //       setPages(Object.keys(json));
  //       setCurrentPage(Object.keys(json)[0]);
  //       setTree(json[Object.keys(json)[0]]);
  //       setHistory(
  //         Object.fromEntries(
  //           Object.entries(json).map(([page, content]) => [page, [content]])
  //         ) as Record<string, TreeItem[][]>
  //       );
  //       setHistoryIndex(
  //         Object.fromEntries(Object.keys(json).map((page) => [page, 0]))
  //       );
  //       setToastMessage("Layout imported successfully");
  //       setShowToast(true);
  //     } catch (error) {
  //       console.error("Error parsing JSON:", error);
  //       setToastMessage("Error importing layout");
  //       setShowToast(true);
  //     }
  //   };
  //   reader.readAsText(file);
  // }
};

export const addComponent = (component: TreeItem, parentId?: string) => {
  // const newTree = JSON.parse(JSON.stringify(pageContent[currentPage]));
  // const newComponent = { ...component, id: Date.now().toString() };
  // if (parentId) {
  //   const addToParent = (items: TreeItem[]) => {
  //     for (let i = 0; i < items.length; i++) {
  //       const currentItem = items[i] ?? { allowsChildren: false, children: [] };
  //       if (currentItem.id === parentId) {
  //         if (!currentItem.children) currentItem.children = [];
  //         currentItem.children.push(newComponent);
  //         return true;
  //       }
  //       if (currentItem.children && addToParent(currentItem.children)) {
  //         return true;
  //       }
  //     }
  //     return false;
  //   };
  //   addToParent(newTree);
  // } else {
  //   newTree.push(newComponent);
  // }
  // setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
  // setTree(newTree);
  // addToHistory(newTree);
  // setToastMessage("Component added successfully");
  // setShowToast(true);
};

export const addPresetSection = (section: TreeItem) => {
  // const { currentItem, setCurrent } = useCurrentTreeItem();
  // setCurrent(null)
  // const [tree, setTree] = useLocalStorage("tree")
  // const newTree = tree;
  // const newSection = section;
  // newSection.id = Date.now().toString();
  // const updateIds = (item: TreeItem) => {
  //   item.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  //   if (item.children) {
  //     item.children.forEach(updateIds);
  //   }
  // };
  // updateIds(newSection);
  // newTree.push(newSection);
  // console.log("AAAAAAAAA", newSection)
  // // setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
  // setTree(newTree);
  // addToHistory(newTree);
  // setToastMessage("Preset section added successfully");
  // setShowToast(true);
};

export const handleRawCodeTsxChange = (
  e: React.ChangeEvent<HTMLTextAreaElement>
) => {
  // setRawCodeTsx(e?.target.value);
};

export const handleRawCodeTsxClear = () => {
  // setRawCodeTsx("");
  // const newTree = initialTree;
  // setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
  // setTree(newTree);
  // addToHistory(newTree);
  // setToastMessage("Preset section added successfully");
  // setShowToast(true);
};

export const handleRawCodeChange = (
  e: React.ChangeEvent<HTMLTextAreaElement>
) => {
  // setRawCode(e.target.value);
};

// export function tsxToJson(): TreeItem[] {
//   let idCounter = 0;

//   function parseElement(element: string): TreeItem | null {
//     const selfClosingTagMatch = element.match(/^<(\w+)([^>]*?)\/>/s);
//     const tagMatch = element.match(/^<(\w+)([^>]*?)>/s);

//     if (!tagMatch && !selfClosingTagMatch) return null;

//     const tagName = (selfClosingTagMatch || tagMatch)![1];
//     const attributesString = (selfClosingTagMatch || tagMatch)![2];

//     const item: TreeItem = {
//       id: `item-${idCounter++}`,
//       name: tagName,
//       type: tagName,
//       props: parseAttributes(attributesString),
//       children: [],
//       content: '',
//       allowsChildren: !selfClosingTagMatch,  // Se for self-closing, não permite filhos
//     };

//     if (selfClosingTagMatch) {
//       console.log("selfClosingTagMatch", selfClosingTagMatch)
//       return item; // Self-closing tags são retornadas para serem tratadas como filhos
//     }

//     // Lida com tags normais (não self-closing)
//     let remaining = element.slice(tagMatch![0].length);
//     const closeTagIndex = findClosingTag(remaining, tagName);

//     if (closeTagIndex !== -1) {
//       const content = remaining.slice(0, closeTagIndex);
//       const [parsedChildren, remainingText] = parseChildren(content);

//       // Atribui os filhos corretamente
//       item.children = parsedChildren;

//       // Define o conteúdo textual, caso não haja filhos
//       if (!parsedChildren.length) {
//         item.content = content.replace(/<.*?>/gs, '').trim();
//       } else {
//         item.content = remainingText.replace(/.*?>/gs, '').trim();
//       }
//     }

//     return item;
//   }

//   function findClosingTag(content: string, tagName: string): number {
//     let depth = 1;
//     let index = 0;
//     const openRegex = new RegExp(`<${tagName}[\\s>]`, 'g');
//     const closeRegex = new RegExp(`</${tagName}>`, 'g');

//     while (depth > 0 && index < content.length) {
//       openRegex.lastIndex = closeRegex.lastIndex = index;
//       const openMatch = openRegex.exec(content);
//       const closeMatch = closeRegex.exec(content);

//       if (!closeMatch) return -1;

//       if (openMatch && openMatch.index < closeMatch.index) {
//         depth++;
//         index = openMatch.index + 1;
//       } else {
//         depth--;
//         if (depth === 0) return closeMatch.index;
//         index = closeMatch.index + 1;
//       }
//     }

//     return -1;
//   }

//   function parseAttributes(attributesString: string): Record<string, any> {
//     const attributes: Record<string, any> = {};
//     const attrRegex = /(\w+)=["']([^"']*?)["']/g;
//     let attrMatch: RegExpExecArray | null;

//     while ((attrMatch = attrRegex.exec(attributesString)) !== null) {
//       attributes[attrMatch[1]] = attrMatch[2] || true;
//     }

//     return attributes;
//   }

//   function parseChildren(content: string): [TreeItem[], string] {
//     const children: TreeItem[] = [];
//     let remaining = content.trim();
//     let remainingText = '';

//     while (remaining.length > 0) {
//       if (remaining.startsWith('<')) {
//         const parsed = parseElement(remaining);
//         if (parsed) {
//           children.push(parsed);
//           if (!parsed.allowsChildren) {
//             // Se a tag não permite filhos, avançamos para o próximo
//             const nextTagStart = remaining.indexOf('<', 1);
//             remaining = nextTagStart !== -1 ? remaining.slice(nextTagStart).trim() : '';
//           } else {
//             const endIndex = findClosingTag(remaining.slice(parsed.name.length + 2), parsed.name);
//             if (endIndex !== -1) {
//               remaining = remaining.slice(endIndex + parsed.name.length + 3).trim();
//             } else {
//               break;
//             }
//           }
//         } else {
//           const nextTagStart = remaining.indexOf('<', 1);
//           remaining = nextTagStart !== -1 ? remaining.slice(nextTagStart).trim() : '';
//         }
//       } else {
//         const nextTagStart = remaining.indexOf('<');
//         if (nextTagStart !== -1) {
//           remainingText = remaining.slice(0, nextTagStart).trim();
//           remaining = remaining.slice(nextTagStart).trim();
//         } else {
//           remainingText = remaining.trim();
//           break;
//         }
//       }
//     }

//     return [children, remainingText];
//   }

//   const [parsedTree, _] = parseChildren(rawCodeTsx);
//   return setTree(parsedTree);
// }

export function tsxToJson() {
  // function parseTsx(tsxCode: string): string {
  //   let coooo = 0;
  //   function tsxStringToJson(tsxString: string): object {
  //     if (typeof tsxString !== "string") {
  //       throw new TypeError("Input must be a string");
  //     }
  //     // console.log("tsxString", tsxString)
  //     const ast = parse(tsxString, {
  //       sourceType: "module",
  //       plugins: ["jsx", "typescript"],
  //     });
  //     const result: any = [];
  //     let level = 0;
  //     traverse(ast, {
  //       JSXElement(path: any) {
  //         level = level + 1;
  //         if (level > 1) {
  //           return false;
  //         }
  //         const { openingElement, children } = path.node;
  //         const type = openingElement.name.name;
  //         const props: Record<string, any> = {};
  //         // Captura os atributos do elemento
  //         openingElement.attributes.forEach((attr: any) => {
  //           if (attr.type === "JSXAttribute") {
  //             props[attr.name.name] = attr.value
  //               ? attr.value.type === "StringLiteral"
  //                 ? attr.value.value
  //                 : null
  //               : true;
  //           }
  //         });
  //         // Captura todos os filhos
  //         const childElements = children
  //           .map((child: any) => {
  //             if (child.type === "JSXText") {
  //               const contentNew = child.value.trim();
  //               if (contentNew != "") {
  //                 return [
  //                   {
  //                     id:
  //                       Date.now().toString() +
  //                       Math.random().toString(36).substr(2, 9),
  //                     name: "Text",
  //                     type: "text",
  //                     allowsChildren: false,
  //                     children: [],
  //                     props: {
  //                       content: contentNew,
  //                     },
  //                   },
  //                 ]; //child.value.trim(); // Captura texto
  //               }
  //               return null;
  //             } else if (child.type === "JSXElement") {
  //               console.log("child", child.openingElement.name.name);
  //               if (child.openingElement.name.name == "h2") {
  //                 console.log(child);
  //               }
  //               return tsxStringToJson(generator(child).code); // Gera o código do elemento filho
  //             }
  //             return null; // Ignore outros tipos, se necessário
  //           })
  //           .filter(Boolean); // Remove valores nulos
  //         const childElementsAdd: TreeItem[] = [];
  //         childElements.map((el: any) => {
  //           childElementsAdd.push(el[0]);
  //         });
  //         if (type == "code") {
  //           props["content"] = tsxString.substring(8, tsxString.length - 9);
  //           console.log("AAA", props);
  //         }
  //         result.push({
  //           id: Math.random().toString(36).substr(2, 9), // Gera um ID aleatório
  //           name: type,
  //           type,
  //           props,
  //           allowsChildren: true,
  //           children: childElementsAdd,
  //         });
  //       },
  //     });
  //     return result;
  //   }
  //   const jsonString = JSON.stringify(tsxStringToJson(tsxCode), null, 2);
  //   return jsonString ?? "[]";
  // }
  // const newTree = JSON.parse(parseTsx(rawCodeTsx));
  // setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
  // setTree(newTree);
  // addToHistory(newTree);
  // setToastMessage("Preset section added successfully");
  // setShowToast(true);
}

export const applyRawCode = () => {
  // try {
  //   const parsedCode = JSON.parse(rawCode);
  //   setPageContent((prev) => ({ ...prev, [currentPage]: parsedCode }));
  //   setTree(parsedCode);
  //   addToHistory(parsedCode);
  //   setToastMessage("Raw code applied successfully");
  //   setShowToast(true);
  // } catch (error) {
  //   console.error("Error parsing raw code:", error);
  //   setToastMessage("Error applying raw code");
  //   setShowToast(true);
  // }
};

export const handleAddPage = (pageName: string) => {
  // if (!pages.includes(pageName)) {
  //   setPages((prev) => [...prev, pageName]);
  //   setPageContent((prev) => ({
  //     ...prev,
  //     [pageName]: [
  //       {
  //         id: "1",
  //         name: "Page Container",
  //         type: "div",
  //         allowsChildren: true,
  //         children: [],
  //       },
  //     ],
  //   }));
  //   setHistory((prev) => ({
  //     ...prev,
  //     [pageName]: [
  //       [
  //         {
  //           id: "1",
  //           name: "Page Container",
  //           type: "div",
  //           allowsChildren: true,
  //           children: [],
  //         },
  //       ],
  //     ],
  //   }));
  //   setHistoryIndex((prev) => ({ ...prev, [pageName]: 0 }));
  //   setCurrentPage(pageName);
  // }
};

export const handleSelectPage = (pageName: string) => {
  // setCurrentPage(pageName);
  // setTree(pageContent[pageName]);
};
