export default class StorageService<T> {
    private storageKey: string;
  
    constructor(storageKey: string) {
      this.storageKey = storageKey;
    }
  
    // Pega todos os dados armazenados
    getCurrent(): T[] {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    }

    // Pega todos os dados armazenados
    getAll(): T[] {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    }
  
    // Salva um novo item
    save(item: T): void {
      const currentData = this.getAll();
      currentData.push(item);
      localStorage.setItem(this.storageKey, JSON.stringify(currentData));
    }
  
    // Atualiza um item baseado em um ID ou outro identificador
    update(id: number, updatedItem: Partial<T>): void {
      const currentData = this.getAll();
      const updatedData = currentData.map(item =>
        (item as any).id === id ? { ...item, ...updatedItem } : item
      );
      localStorage.setItem(this.storageKey, JSON.stringify(updatedData));
    }
  
    // Remove um item por ID
    remove(id: number): void {
      const currentData = this.getAll();
      const filteredData = currentData.filter(item => (item as any).id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredData));
    }
  
    // Limpa todo o armazenamento
    clear(): void {
      localStorage.removeItem(this.storageKey);
    }
  }
  