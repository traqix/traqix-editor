import { TreeItem } from "@/app/(main)/(editor)/types";

export const removeOneChild = (
  tree: Record<string, TreeItem>, 
  parentId: string, 
  childId: string
): Record<string, TreeItem> => {
  const updatedTree = { ...tree };
  const parentItem = updatedTree[parentId];

  if (parentItem && parentItem.children) {
    updatedTree[parentId] = {
      ...parentItem,
      children: parentItem.children.filter(id => id !== childId),
    };
  }

  return updatedTree;
};

export const removeChildrens = (
  tree: Record<string, TreeItem>, 
  parentId: string
): Record<string, TreeItem> => {
  const updatedTree = { ...tree };

  const parentItem = updatedTree[parentId];
  if (!parentItem || !parentItem.children) return updatedTree;

  // Função recursiva para remover filhos
  const removeRecursively = (id: string) => {
    const item = updatedTree[id];
    if (item?.children) {
      item.children.forEach(childId => removeRecursively(childId));
    }
    delete updatedTree[id];
  };

  // Remove todos os filhos recursivamente
  parentItem.children.forEach(childId => removeRecursively(childId));

  // Atualiza o nó pai removendo os filhos
  updatedTree[parentId] = {
    ...parentItem,
    children: [],
  };

  return updatedTree;
};

export const insertAfter = (
  tree: Record<string, TreeItem>, 
  newItem: TreeItem, 
  targetId: string
): Record<string, TreeItem> => {
  const updatedTree = { ...tree, [newItem.id]: newItem };

  // Encontra o item pai do item de referência
  const parent = Object.values(updatedTree).find(item => item.children?.includes(targetId));
  if (!parent) return updatedTree;

  let children = parent.children ? [...parent.children] : [];
  const targetIndex = children.indexOf(targetId);

  // Remove o item caso já esteja na lista
  children = children.filter(id => id !== newItem.id);

  if (targetIndex !== -1) {
    children.splice(targetIndex + 1, 0, newItem.id); // Insere após o item de referência
    updatedTree[parent.id] = { ...parent, children };
  }

  return updatedTree;
};

export const insertBefore = (
  tree: Record<string, TreeItem>, 
  newItem: TreeItem, 
  targetId: string
): Record<string, TreeItem> => {
  const updatedTree = { ...tree, [newItem.id]: newItem };

  // Encontra o item pai do item de referência
  const parent = Object.values(updatedTree).find(item => item.children?.includes(targetId));
  if (!parent) return updatedTree;

  let children = parent.children ? [...parent.children] : [];
  const targetIndex = children.indexOf(targetId);

  // Remove o item caso já esteja na lista
  children = children.filter(id => id !== newItem.id);

  if (targetIndex !== -1) {
    children.splice(targetIndex, 0, newItem.id); // Insere antes do item de referência
    updatedTree[parent.id] = { ...parent, children };
  }

  return updatedTree;
};

export const insertInside = (
  tree: Record<string, TreeItem>, 
  newItem: TreeItem, 
  parentId: string
): Record<string, TreeItem> => {
  const updatedTree = { ...tree, [newItem.id]: newItem };

  const parentItem = updatedTree[parentId];
  if (parentItem && parentItem.allowsChildren) {
    let children = parentItem.children ? [...parentItem.children] : [];

    // Remove o item caso já esteja na lista
    children = children.filter(id => id !== newItem.id);

    // Adiciona o item no final
    children.push(newItem.id);

    updatedTree[parentId] = { ...parentItem, children };
  }

  return updatedTree;
};