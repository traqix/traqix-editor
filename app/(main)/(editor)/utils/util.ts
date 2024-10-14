import type { Position, TreeFull, TreeItem } from "@/app/(main)/(editor)/types";

import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generator from "@babel/generator";

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
import { Children } from "react";

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

export const onMove3 = (
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

export const onDuplicate = (targetId: string, tree: TreeItem, setTree: any) => {
  const duplicateItemWithNewIds = (
    root: TreeItem,
    targetId: string
  ): TreeItem => {
    // Cria uma cópia do nó raiz para evitar mutações
    const newRoot: TreeItem = { ...root };

    // Função auxiliar para gerar um novo ID
    const generateNewId = (): string => {
      return `id_${Math.random().toString(36).substr(2, 9)}`; // Gera um ID único
    };

    // Função para clonar um item e seus filhos, atribuindo novos IDs
    const cloneItem = (item: TreeItem): TreeItem => {
      const newItem: TreeItem = { ...item, id: generateNewId() }; // Clona o item com novo ID
      if (item.children) {
        newItem.children = item.children.map(cloneItem); // Clona os filhos recursivamente
      }
      return newItem;
    };

    // Verifica se o nó raiz tem filhos
    if (newRoot.children) {
      // Verifica se o item a ser duplicado está na raiz
      const indexInRoot = newRoot.children.findIndex(
        (child) => child.id === targetId
      );

      if (indexInRoot !== -1) {
        const itemToDuplicate = newRoot.children[indexInRoot];
        const newItem = cloneItem(itemToDuplicate); // Duplicata com novos IDs
        newRoot.children.splice(indexInRoot + 1, 0, newItem); // Adiciona a duplicata como próximo irmão
        return newRoot; // Retorna a árvore atualizada
      } else {
        // Se não encontrado na raiz, verifica nos filhos
        for (let i = 0; i < newRoot.children.length; i++) {
          const child = newRoot.children[i];
          const childIndex = child.children
            ? child.children.findIndex((c: { id: string }) => c.id === targetId)
            : -1;

          if (childIndex !== -1 && child.children) {
            const itemToDuplicate = child.children[childIndex];
            const newItem = cloneItem(itemToDuplicate); // Duplicata com novos IDs
            child.children.splice(childIndex + 1, 0, newItem); // Adiciona a duplicata como próximo irmão
            break; // Sai do loop após duplicar o item
          }
        }
      }
    }

    // Retorna a árvore atualizada
    return newRoot;
  };

  const updatedTree = duplicateItemWithNewIds(tree, targetId); // Chama a função para duplicar o item

  console.log("updatedTree", updatedTree);
  setTree("root", updatedTree); // Atualiza o estado da árvore com a nova árvore
};

export const onMove4 = (
  treeMoved: TreeItem,
  parent: TreeItem | null, // Pode ser null se for para a raiz
  target: TreeItem,
  position: "before" | "after" | "inside",
  setTree: any
) => {
  console.log("===========onMove", parent);

  let changedTreeItems: TreeItem[] = [];
  if (parent?.children) {
    console.log("PARENT CHILDREN", parent);
    const movedIndex = parent.children.findIndex((id) => id === treeMoved.id);
    if (movedIndex !== -1) {
      parent.children.splice(movedIndex, 1);
      changedTreeItems.push({
        ...parent,
        lastUpdate: new Date().valueOf(),
        children: parent.children,
      });
      console.log("PARENT CHILDREN SAVE", {
        ...parent,
        children: parent.children,
      });
    }
  }

  // Atualizar o item treeMoved com o novo parentId
  delete treeMoved["parent"];
  const updatedTreeMoved: TreeItem = {
    ...treeMoved,
    parentId: target.id,
    lastUpdate: new Date().valueOf(),
  };

  changedTreeItems.push(updatedTreeMoved);

  // Determinar onde inserir o item movido no target
  let updatedTarget: TreeItem = {
    ...target,
    lastUpdate: new Date().valueOf(),
    children: target.children || [],
  };

  if (position === "before" || position === "after") {
    const targetParent = parent; // O parent do target será o novo parent de treeMoved
    if (targetParent?.children) {
      let targetIndex = targetParent.children.findIndex(
        (id) => id === target.id
      );
      if (position === "after") {
        targetIndex += 1;
      }
      targetParent.children.splice(targetIndex, 0, treeMoved.id);
      changedTreeItems.push({
        ...targetParent,
        lastUpdate: new Date().valueOf(),
        children: targetParent.children,
      });
    }
  } else if (position === "inside" && target.allowsChildren) {
    if (!updatedTarget.children?.includes(treeMoved.id)) {
      updatedTarget.children?.push(treeMoved.id);
      changedTreeItems.push(updatedTarget); // Atualiza o target com o novo filho
    }
  }

  if (changedTreeItems) {
    setTree(changedTreeItems);
  }

  return;
};

export const onMoveChildren = (
  targetId: string,
  direction: "up" | "down",
  tree: TreeItem,
  setTree: any
) => {
  const moveItem = (
    root: TreeItem,
    targetId: string,
    direction: "up" | "down"
  ): TreeItem => {
    // Cria uma cópia do nó raiz para evitar mutações
    const newRoot: TreeItem = { ...root };

    // Verifica se o nó raiz tem filhos
    if (newRoot.children) {
      // Verifica se o item a ser movido está na raiz
      const indexInRoot = newRoot.children.findIndex(
        (child) => child.id === targetId
      );

      if (indexInRoot !== -1) {
        // O item foi encontrado na lista de filhos do nó raiz
        const [itemToMove] = newRoot.children.splice(indexInRoot, 1); // Remove o item da lista
        const newIndex = direction === "up" ? indexInRoot - 1 : indexInRoot + 1;

        // Verifica os limites do array antes de adicionar o item
        if (newIndex >= 0 && newIndex <= newRoot.children.length) {
          newRoot.children.splice(newIndex, 0, itemToMove); // Insere o item na nova posição
        }
      } else {
        // Se não encontrado na raiz, verifica nos filhos
        for (let i = 0; i < newRoot.children.length; i++) {
          const child = newRoot.children[i];
          const childIndex = child.children
            ? child.children.findIndex((c: { id: string }) => c.id === targetId)
            : -1;

          if (childIndex !== -1 && child.children) {
            // O item foi encontrado entre os filhos
            const [itemToMove] = child.children.splice(childIndex, 1); // Remove o item da lista de filhos
            const newIndex =
              direction === "up" ? childIndex - 1 : childIndex + 1;

            // Verifica os limites do array antes de adicionar o item
            if (newIndex >= 0 && newIndex <= child.children.length) {
              child.children.splice(newIndex, 0, itemToMove); // Insere o item na nova posição
            }
            break; // Sai do loop após mover o item
          }
        }
      }
    }

    // Retorna a árvore atualizada
    return newRoot;
  };

  const updatedTree = moveItem(tree, targetId, direction); // Chama a função para mover o item

  console.log("updatedTree", updatedTree);
  setTree("root", updatedTree); // Atualiza o estado da árvore com a nova árvore
};

export const onRemove = (
  tree: TreeItem,
  parent: TreeItem,
  setTree: any,
  removeTree: any
) => {
  if (tree.id == "root") {
    for (;;) {
      let totalFind = 0;
      for (var i = 0, len = localStorage.length; i < len; ++i) {
        const nameKey = localStorage.key(i);
        if (nameKey && nameKey.startsWith("treeItem_id_")) {
          removeTree(nameKey);
          localStorage.removeItem(nameKey);
          totalFind += 1;
        }
      }
      if (totalFind == 0) {
        break;
      }
    }
    setTree({ ...tree, children: [], lastUpdate: new Date().valueOf() });

    return;
  }

  const removeItem = (tree: TreeItem, parent: TreeItem) => {
    // const newRoot: TreeItem = { ...root };

    if (!tree) {
      return;
    }

    if (parent?.children) {
      const movedIndex = parent.children.findIndex((id) => id === tree.id);
      if (movedIndex !== -1) {
        const newParentChildren = parent.children.filter(
          (id) => id !== tree.id
        );
        setTree({
          ...parent,
          lastUpdate: new Date().valueOf(),
          children: newParentChildren,
        });
      }
    }

    if (tree.children) {
      tree.children.map((child) => {
        removeTree(child);
        // if (child.id !== id) {
        //   const updatedChild = removeItem(child, id);
        //   if (updatedChild) acc.push(updatedChild);
        // }
        // return acc;
      });
    }

    removeTree(tree.id);
  };

  removeItem(tree, parent);

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

export const handleUpdate = (
  id: string,
  updates: Partial<TreeItem>,
  tree: TreeItem[],
  setTree: any
) => {
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

  console.log("newTree", newTree);
  setTree("root", newTree[0]);
  // setPageContent((prev) => ({ ...prev, [currentPage]: newTree }));
  // addToHistory(newTree);
  return;
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

const generateNewId = (): string => {
  const randomPart = Math.random().toString(36).substr(2, 9);
  const timestampPart = Date.now().toString(36); // Adiciona parte do timestamp para mais entropia
  return `id_${randomPart}_${timestampPart}`;
};

export const addComponent = (
  newItem: TreeItem,
  targetId: string,
  position: Position,
  tree: TreeItem,
  setTree: any
) => {
  console.log("ININININTT ADDDDDD COMPONNNN");

  const addItem = (
    root: TreeItem,
    newItem: TreeItem,
    targetId: string,
    position: Position
  ): TreeItem[] => {
    const newRoot: TreeItem = { ...root };
    const cloneNewItem = {
      ...newItem,
      parentId: targetId,
      id: generateNewId(),
      lastUpdate: new Date().valueOf(),
    };

    console.log("INIT SET TREE", cloneNewItem.id);
    // setTree(cloneNewItem.id, cloneNewItem);
    console.log("END SET TREE");

    if (newRoot.id === targetId) {
      if (position === "before") {
        // IMPLEMENTS
        console.log("SET ITEM BEFORE 1111111111");
        return [
          cloneNewItem,
          {
            ...newRoot,
            children: [cloneNewItem.id, ...(newRoot.children || [])],
            lastUpdate: new Date().valueOf(),
          },
        ];
      } else if (position === "after") {
        console.log("SET ITEM after 1111111111");
        // IMPLEMENTS
        return [
          cloneNewItem,
          {
            ...newRoot,
            children: [...(newRoot.children || []), cloneNewItem.id],
            lastUpdate: new Date().valueOf(),
          },
        ];
      } else if (position === "inside") {
        console.log("SET ITEM inside 1111111111");
        return [
          cloneNewItem,
          {
            ...newRoot,
            children: [...(newRoot.children || []), cloneNewItem.id],
            lastUpdate: new Date().valueOf(),
          },
        ];
      }
    }

    // if (newRoot.children) {
    //   for (let i = 0; i < newRoot.children.length; i++) {
    //     const child = newRoot.children[i];
    //     const [aaaa] = suseTreeLocalStorage([child])

    //     const updatedChild = addItem(aaaa as unknown as TreeItem, newItem, targetId, position);
    //     setTree(updatedChild.id, updatedChild)
    //     newRoot.children[i] = updatedChild.id;
    //   }
    // }

    return [cloneNewItem, newRoot];
  };

  const updatedTree = addItem(tree, newItem, targetId, position);

  console.log("addComponent", updatedTree);
  setTree(updatedTree);
  console.log("EEEEEEEEEEEEEEENDDDDDDDDD ADDDDDD COMPONNNN");
};

export const transformTreeFullToTreeItem = (
  treeFull: TreeFull,
  idMap: Map<string, TreeItem>
): TreeItem => {
  const newId = generateNewId();

  // Recursivamente transformar os filhos e gerar novos IDs
  const transformedChildrenIds = treeFull.children
    ? treeFull.children.map((child) => {
        const transformedChild = transformTreeFullToTreeItem(child, idMap);
        return transformedChild.id; // Pegamos o novo ID gerado
      })
    : [];

  // Cria o novo TreeItem
  const newTreeItem: TreeItem = {
    ...treeFull,
    id: newId, // Substitui o ID original por um novo ID
    children: transformedChildrenIds, // Lista de novos IDs dos filhos
  };

  // Mapeia o novo TreeItem pelo seu novo ID
  idMap.set(newId, newTreeItem);

  return newTreeItem;
};

// Função principal para transformar a seção de TreeFull[] em TreeItem[]
export const transformSectionToTreeItems = (
  section: TreeFull[]
): TreeItem[] => {
  const idMap = new Map<string, TreeItem>(); // Armazena os novos TreeItems mapeados pelos seus IDs

  section.forEach((item) => transformTreeFullToTreeItem(item, idMap));

  // Retorna todos os TreeItems gerados no mapa
  return Array.from(idMap.values());
};

export const addPresetSection = (
  section: TreeFull[],
  tree: TreeItem,
  setTree: any
) => {
  // const addItemToRoot = (root: TreeItem, section: TreeFull[], setTree: any): TreeItem[] => {
  //   const newsComponents = transformSectionToTreeItems(section)

  //   return newsComponents;
  // };

  // const newsComponents = addItemToRoot(tree, section, setTree);

  const newsComponents = transformSectionToTreeItems(section);

  newsComponents.map((el: TreeItem, i: number) => {
    setTree(el.id, el);
    // if (i == 0) {
    //   tree.children?.push(el.id);
    // }
  });

  tree.children?.push(newsComponents[0].id);
  tree.lastUpdate = new Date().valueOf();

  console.log("updatedTree", tree, newsComponents[0]);

  setTree("root", tree);
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

export function tsxToJson(
  rawCodeTsx: string,
  treeRoot: TreeItem,
  setTree: any
) {
  function parseTsx(tsxCode: string): string {
    let coooo = 0;
    function tsxStringToJson(tsxString: string): object {
      if (typeof tsxString !== "string") {
        throw new TypeError("Input must be a string");
      }
      // console.log("tsxString", tsxString)
      const ast = parse(tsxString, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });
      const result: any = [];
      let level = 0;
      traverse(ast, {
        JSXElement(path: any) {
          level = level + 1;
          if (level > 1) {
            return false;
          }
          const { openingElement, children } = path.node;
          const type = openingElement.name.name;
          const props: Record<string, any> = {};
          // Captura os atributos do elemento
          openingElement.attributes.forEach((attr: any) => {
            if (attr.type === "JSXAttribute") {
              props[attr.name.name] = attr.value
                ? attr.value.type === "StringLiteral"
                  ? attr.value.value
                  : null
                : true;
            }
          });
          // Captura todos os filhos
          const childElements = children
            .map((child: any) => {
              if (child.type === "JSXText") {
                const contentNew = child.value.trim();
                if (contentNew != "") {
                  return [
                    {
                      id:
                        Date.now().toString() +
                        Math.random().toString(36).substr(2, 9),
                      name: "Text",
                      type: "text",
                      allowsChildren: false,
                      children: [],
                      props: {
                        content: contentNew,
                      },
                    },
                  ];
                  // return child.value.trim(); // Captura texto
                }
                return null;
              } else if (child.type === "JSXElement") {
                console.log("child", child.openingElement.name.name);
                if (child.openingElement.name.name == "h2") {
                  console.log(child);
                }
                return tsxStringToJson(generator(child).code); // Gera o código do elemento filho
              }
              return null; // Ignore outros tipos, se necessário
            })
            .filter(Boolean); // Remove valores nulos
          const childElementsAdd: TreeItem[] = [];
          childElements.map((el: any) => {
            childElementsAdd.push(el[0]);
          });
          if (type == "code") {
            props["content"] = tsxString.substring(8, tsxString.length - 9);
            console.log("AAA", props);
          }
          result.push({
            id: Math.random().toString(36).substr(2, 9), // Gera um ID aleatório
            name: type,
            type,
            props,
            allowsChildren: true,
            children: childElementsAdd,
          });
        },
      });
      return result;
    }
    const jsonString = JSON.stringify(tsxStringToJson(tsxCode), null, 2);
    return jsonString ?? "[]";
  }
  const newsComponents = transformSectionToTreeItems(
    JSON.parse(parseTsx(rawCodeTsx)) as TreeFull[]
  );

  console.log("newsComponents", newsComponents);
  let newComponents: TreeItem[] = [];

  newsComponents.map((el: TreeItem, i: number) => {
    newComponents.push(el);
  });

  if (treeRoot) {
    treeRoot.children?.push(newsComponents[newsComponents.length - 1].id);
    treeRoot.lastUpdate = new Date().valueOf();

    newComponents.push(treeRoot);
  }

  setTree(newComponents);

  // addPresetSection(newTree, tree, setTree);
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

// NEWS FEATURES

// Função debounce
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const updateClassName = (
  tree: TreeItem,
  updates: Partial<TreeItem>,
  setTree: any
) => {
  const updateItem = (item: TreeItem): TreeItem => {
    return { ...item, ...updates };
  };

  const newTree = updateItem(tree);

  setTree([newTree]);
};

export const convertTreeItemToTreeFull = (
  treeItem: TreeItem,
  getTree: (key: string) => TreeItem | undefined
): TreeFull => {
  const children = treeItem.children
    ? (treeItem.children
        .map((childId) => {
          const childItem = getTree(childId);
          return childItem
            ? convertTreeItemToTreeFull(childItem, getTree)
            : null;
        })
        .filter((child) => child !== null) as TreeFull[])
    : [];

  const { lastUpdate, ...treeItemProps} = treeItem
  
  return {
    ...treeItemProps,
    children,
  };
};

export const onMove = (
  treeMovedId: string,  // ID do item arrastado
  targetId: string,     // ID do item alvo
  position: "before" | "after" | "inside", // Posição do item em relação ao alvo
  getTree: any, // Função que retorna o TreeItem completo pelo ID
  setTree: any, // Função que atualiza a árvore no localStorage
) => {
  console.log("===========onMove", treeMovedId, targetId);

  // Recupera o TreeItem movido e o alvo
  const treeMoved = getTree(treeMovedId);
  const target = getTree(targetId);
  if (!treeMoved || !target) return; // Verifica se ambos existem

  // Cria uma cópia da árvore atual a partir do estado localStorage
  const updatedTree: Record<string, TreeItem> = {
    [treeMovedId]: treeMoved,
    [targetId]: target,
    ...(treeMoved.parentId ? { [treeMoved.parentId]: getTree(treeMoved.parentId) } : {})
  };

  let parentOfMoved: TreeItem | undefined = treeMoved.parentId ? updatedTree[treeMoved.parentId] : undefined;

  // 1. Remover treeMoved de seu pai atual (se houver)
  if (parentOfMoved && parentOfMoved.children) {
    const movedIndex = parentOfMoved.children.findIndex(id => id === treeMovedId);
    if (movedIndex !== -1) {
      parentOfMoved.children.splice(movedIndex, 1); // Remove o item movido da lista de filhos do pai atual
      updatedTree[parentOfMoved.id] = {
        ...parentOfMoved,
        lastUpdate: new Date().valueOf(),
        children: parentOfMoved.children,
      };
    }
  }

  // 2. Atualizar o parentId do item movido
  updatedTree[treeMovedId] = {
    ...treeMoved,
    parentId: position === "inside" ? targetId : target.parentId, // Atualiza o parentId
    lastUpdate: new Date().valueOf(),
  };

  // 3. Determinar onde inserir o item movido no novo local
  if (position === "before" || position === "after") {
    // Movendo antes ou depois do target, atualiza o pai do target
    const targetParentId = target.parentId;
    const targetParent = targetParentId ? getTree(targetParentId) : undefined;
    
    if (targetParent?.children) {
      let targetIndex = targetParent.children.findIndex(id => id === targetId);
      if (position === "after") {
        targetIndex += 1; // Inserir após o item-alvo
      }
      targetParent.children.splice(targetIndex, 0, treeMovedId); // Insere o item movido
      if (targetParentId) {
        updatedTree[targetParentId] = {
          ...targetParent,
          lastUpdate: new Date().valueOf(),
          children: targetParent.children,
        };
      }
    }
  } else if (position === "inside" && target.allowsChildren) {
    // Movendo para dentro do target
    const updatedTarget = {
      ...target,
      children: target.children ? [...target.children, treeMovedId] : [treeMovedId],
      lastUpdate: new Date().valueOf(),
    };
    updatedTree[targetId] = updatedTarget; // Atualiza o alvo com o novo filho
  }

  // 4. Atualizar a árvore no localStorage
  const treeItemsArray: TreeItem[] = Object.values(updatedTree);
  
  setTree(treeItemsArray);
};

export const convertValueTreeItem = (getMemory: any, tree?: TreeItem) => {
  if (!tree) return undefined

  if (!tree.props?.content && !tree.props?.content?.startsWith('traqix_mem_')) {
    return tree
  }
 
  if (tree.props?.content?.startsWith('traqix_mem_')) {
    let newContent = ''
    try {
      newContent = getMemory(tree.props?.content.replace('traqix_mem_', ''))['value']
    } catch (e) {
      newContent = '###'
      console.log('err', e)
    }
    return {...tree, props: { ...tree.props, content:  newContent, value:  newContent }}
  }

  return tree

}