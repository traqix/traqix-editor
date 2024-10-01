// import { useEffect, useState } from "react";
// import StorageService from "@/services/storage-service";
// import type { TreeItem } from "@/app/(main)/(editor)/types";

// class TreeItemStorage extends StorageService<TreeItem> {
//   private currentKey = `tx_current`; // Chave para armazenar o item sendo editado

//   // Obtém o item que está sendo editado (current)
//   getCurrent(): TreeItem | null {
//     const currentData = localStorage.getItem(this.currentKey);
//     return currentData ? JSON.parse(currentData) : null;
//   }

//   // Define o item que está sendo editado (current) e atualiza o localStorage
//   setCurrent(item: TreeItem): void {
//     localStorage.setItem(this.currentKey, JSON.stringify(item));
//   }

//   // Limpa o item atual
//   clearCurrent(): void {
//     localStorage.removeItem(this.currentKey);
//   }
// }

// // Instância do armazenamento para TreeItems
// const treeItemStorage = new TreeItemStorage('treeItems');

// // Hook para usar o TreeItemStorage e monitorar alterações
// export const useCurrentTreeItem = () => {
//   const [currentItem, setCurrentItem] = useState<TreeItem | null>(treeItemStorage.getCurrent());

//   // Atualiza o localStorage sempre que o estado `currentItem` mudar
//   useEffect(() => {
//     try {
//       console.log("DDDDDDD", currentItem)
//       window.localStorage.setItem(treeItemStorage.currentKey, JSON.stringify(currentItem));
//     } catch (error) {
//       console.error(error);
//     }
//   }, [currentItem]);

//   // Efeito para escutar mudanças no localStorage de outras abas
//   useEffect(() => {
//     const handleStorageChange = (event: StorageEvent) => {
//       if (event.key === treeItemStorage.currentKey) {
//         setCurrentItem(event.newValue ? JSON.parse(event.newValue) : null);
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);

//     // Limpeza do listener ao desmontar
//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, []);

//   return { currentItem, setCurrent: setCurrentItem, clearCurrent: treeItemStorage.clearCurrent };
// };
