// import StorageService from './StorageService';
// import { Page } from './types';

import type { TreeItem } from "@/app/(main)/(editor)/types";
import StorageService from "@/services/storage-service";

// Cria uma instância do serviço de armazenamento para usuários
const pageStorage = new StorageService<TreeItem>('tree2');

// Exportar funções reutilizáveis para manipular o armazenamento de usuários
export const getCurrentPage = (): TreeItem[] => pageStorage.getCurrent();
export const getPages = (): TreeItem[] => pageStorage.getAll();
export const addPage = (item: TreeItem): void => pageStorage.save(item);
export const updatePage = (id: number, updatedItem: Partial<TreeItem>): void => pageStorage.update(id, updatedItem);
export const deletePage = (id: number): void => pageStorage.remove(id);
