"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { TreeItem } from "@/app/(main)/(editor)/types"; // Ajuste o caminho conforme necessário

interface TreeContextType {
  storedValues: TreeItem[];
  setTree: (items: TreeItem[]) => void; // Agora aceita múltiplos itens
  removeTree: (key: string) => void;
  getTree: (key: string) => TreeItem | undefined;
  onTreeChange: any;
  undo: any;
  redo: any;
}

const TreeContext = createContext<TreeContextType | undefined>(undefined);

let initializedValues: TreeItem[] | null = null;

export const TreeProvider: React.FC<{
  children: React.ReactNode;
  initialKeys: string[];
  initialValues: TreeItem[];
}> = ({ children, initialKeys, initialValues }) => {
  const [keys, setKeys] = useState<string[]>(initialKeys);
  const [storedValuesLastUpdated, setStoredValuesLastUpdated] = useState<
    number[]
  >([]);
  const [storedValues, setStoredValues] = useState<TreeItem[]>(() => {
    if (initializedValues) {
      return initializedValues;
    }

    if (typeof window === "undefined") return initialValues;

    initializedValues = initialKeys.map((key, index) => {
      try {
        const item = window.localStorage.getItem(`traqix_item_${key}`);
        return item ? JSON.parse(item) : initialValues[index];
      } catch (error) {
        console.error(
          `Erro ao ler o localStorage para "traqix_item_${key}":`,
          error
        );
        return initialValues[index];
      }
    });

    return initializedValues;
  });

  const [changeCallbacks, setChangeCallbacks] = useState<
    ((updatedItem: TreeItem) => void)[]
  >([]);

  // Pilhas para undo e redo
  const [undoStack, setUndoStack] = useState<TreeItem[][]>([]); // Agora guarda grupos de TreeItem[]
  const [redoStack, setRedoStack] = useState<TreeItem[][]>([]);

  // Atualizar o localStorage quando o storedValues ou storedValuesLastUpdated mudar
  useEffect(() => {
    keys.forEach((key, index) => {
      try {
        const newValue = JSON.stringify(storedValues[index]);
        const currentStoredValue = window.localStorage.getItem(
          `traqix_item_${key}`
        );
        const currentStoredItem = currentStoredValue
          ? JSON.parse(currentStoredValue)
          : null;

        // Verifica se existe um item armazenado e se o lastUpdate do novo valor é maior
        if (
          (!currentStoredValue ||
            (currentStoredItem &&
              storedValues[index].lastUpdate > currentStoredItem.lastUpdate)) &&
          newValue
        ) {
          console.log("SET ITEM WRITE", key, newValue);
          window.localStorage.setItem(`traqix_item_${key}`, newValue);
          window.dispatchEvent(
            new CustomEvent(`local-storage-update-${key}`, { detail: newValue })
          );
        }
      } catch (e) {
        return null;
      }
    });
  }, [storedValuesLastUpdated]);


  // Listener para eventos de mudança no localStorage
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      const eventKey = event.key?.replace("traqix_item_", "");

      if (eventKey) {
        const newValue = event.newValue ? JSON.parse(event.newValue) : undefined;
        const index = keys.indexOf(eventKey);

        if (index !== -1 && newValue) {
          setStoredValues((prevValues) => {
            const newValues = [...prevValues];
            newValues[index] = newValue;
            return newValues;
          });
        } else if (!keys.includes(eventKey) && newValue) {
          setKeys((prevKeys) => [...prevKeys, eventKey]);
          setStoredValues((prevValues) => [...prevValues, newValue]);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [keys]);


  const setTree = (items: TreeItem | TreeItem[]) => {
    if (!items) return;

    // Garantir que estamos lidando com um array de TreeItem
    const itemsArray = Array.isArray(items) ? items : [items];

    // Verifica se estamos recebendo objetos TreeItem
    if (
      !itemsArray.every(
        (item) => item && typeof item === "object" && "id" in item
      )
    ) {
      console.error("Esperado objetos TreeItem, mas recebeu:", itemsArray);
      return;
    }

    console.log("Items a serem processados (TreeItem):", itemsArray);

    // Captura o estado anterior dos itens que serão modificados
    const previousItems: TreeItem[] = itemsArray.map((item) => {
      const index = keys.indexOf(item.id);
      return index !== -1 ? storedValues[index] : { ...item, lastUpdate: 0 };
    });

    // Atualiza os valores armazenados
    setStoredValues((prevValues) => {
      const newValues = [...prevValues];
      const timestamp = Date.now(); // Obtém o timestamp atual

      itemsArray.forEach((item) => {
        const index = keys.indexOf(item.id);
        console.log("SET KEY FINDDD IN", item.id, keys);

        if (index !== -1) {
          // Se o item já existe, atualiza
          console.log(`Atualizando item existente: ${item.id}`);
          newValues[index] = { ...item, lastUpdate: timestamp }; // Atualiza o valor existente
        } else {
          // Se o item não existe, adiciona
          console.log(
            `Adicionando novo item: ${item.id} index ${newValues.length}`
          );
          newValues.push({ ...item, lastUpdate: timestamp }); // Adiciona novo

          // Também precisa adicionar a chave ao array de chaves
          setKeys((prevKeys) => {
            // Verifica se a chave já existe antes de adicionar
            if (!prevKeys.includes(item.id)) {
              console.log("SET KEY 11111111111111", item.id, prevKeys);
              return [...prevKeys, item.id]; // Atualiza as chaves
            }
            return prevKeys; // Retorna as chaves inalteradas
          });
        }
      });

      console.log("Novos valores armazenados:", newValues);
      return newValues; // Retorna os novos valores
    });

    // Atualiza os timestamps dos itens
    setStoredValuesLastUpdated((prevValues) => {
      const newValues = [...prevValues];
      const timestamp = Date.now();

      itemsArray.forEach((item) => {
        console.log(`Atualizando setStoredValuesLastUpdated: ${item.id}`);
        const index = keys.indexOf(item.id);
        if (index !== -1) {
          newValues[index] = timestamp; // Atualiza o timestamp do item existente
        } else {
          newValues.push(timestamp); // Adiciona novo timestamp
        }
      });

      return newValues; // Retorna os novos timestamps
    });

    // Adiciona o estado anterior à pilha de undo
    setUndoStack((prev) => {
      console.log("Adicionando ao undoStack:", previousItems);
      return [...prev, previousItems];
    });

    // Limpa a pilha de redo ao fazer uma nova alteração
    setRedoStack([]);
    console.log("Limpeza do redoStack feita.");

    
  };

  const removeTree = (key: string) => {
    console.log(`Iniciando a remoção do item com a chave: ${key}`);

    // 1. Armazenar o estado anterior
    const previousState = storedValues.map((item) => ({ ...item }));

    // 2. Remover o item do localStorage
    window.localStorage.removeItem(`traqix_item_${key}`);
    console.log(`Item removido do localStorage: traqix_item_${key}`);

    // 3. Atualizar as chaves, removendo a chave que foi removida
    setKeys((prevKeys) => {
      const updatedKeys = prevKeys.filter((k) => k !== key);
      console.log(`Chaves atualizadas (após remoção):`, updatedKeys);
      return updatedKeys; // Retorna as chaves atualizadas
    });

    // 4. Atualizar os valores armazenados, removendo o valor associado à chave
    setStoredValues((prevValues) => {
      const index = keys.indexOf(key);
      if (index !== -1) {
        // Cria uma nova array sem o item removido
        const newValues = prevValues.filter((_, i) => i !== index);
        console.log(`Valores armazenados atualizados (após remoção):`, newValues);
        return newValues; // Retorna os novos valores armazenados
      }
      console.log(`Chave não encontrada em storedValues. Nenhum valor removido.`);
      return prevValues; // Retorna os valores inalterados se a chave não foi encontrada
    });

    // 5. Atualizar os timestamps, removendo o timestamp associado à chave
    setStoredValuesLastUpdated((prevValues) => {
      const index = keys.indexOf(key);
      if (index !== -1) {
        // Cria uma nova array sem o timestamp do item removido
        const newValues = prevValues.filter((_, i) => i !== index);
        console.log(`Timestamps atualizados (após remoção):`, newValues);
        return newValues; // Retorna os novos timestamps
      }
      console.log(`Chave não encontrada em storedValuesLastUpdated. Nenhum timestamp removido.`);
      return prevValues; // Retorna os timestamps inalterados se a chave não foi encontrada
    });

    // 6. Armazenar o estado anterior na pilha de undo
    setUndoStack((prev) => [...prev, previousState]);

    // 7. Limpar a pilha de redo
    setRedoStack([]);

    console.log(`Remoção do item com a chave: ${key} concluída.`);
  };


  const getTree = (key: string): TreeItem | undefined => {
    const index = keys.indexOf(key);
  
    if (index !== -1 && storedValues[index] !== undefined) {
      return storedValues[index];
    }
  
    const itemFromLocalStorage = window.localStorage.getItem(`traqix_item_${key}`);
  
    if (itemFromLocalStorage) {
      try {
        const parsedItem = JSON.parse(itemFromLocalStorage);
        const currentTimestamp = new Date().valueOf();
  
        // Se o item não estiver na lista de chaves, adicionamos apenas ao localStorage
        if (index === -1) {
          // Atualiza apenas o localStorage para evitar renderizações em loop
          console.log("Adicionando item ao localStorage, mas não ao estado imediatamente.");
          return parsedItem;
        } else {
          // Se o item está no estado, verificamos se o dado localStorage é mais recente
          const existingItem = storedValues[index];
          if (parsedItem.lastUpdate > existingItem.lastUpdate) {
            const newValues = [...storedValues];
            newValues[index] = parsedItem;
            setStoredValues(newValues);
  
            const newLastUpdated = [...storedValuesLastUpdated];
            newLastUpdated[index] = currentTimestamp;
            setStoredValuesLastUpdated(newLastUpdated);
          }
        }
  
        return parsedItem;
      } catch (e) {
        console.error(`Erro ao analisar item do localStorage para a chave: ${key}`, e);
        return undefined;
      }
    }
  
    return undefined;
  };  

  const onTreeChange = useCallback(
    (callback: (updatedItem: TreeItem) => void) => {
      setChangeCallbacks((prev) => [...prev, callback]);
      return () =>
        setChangeCallbacks((prev) => prev.filter((cb) => cb !== callback));
    },
    []
  );

  const undo = useCallback(() => {
    if (undoStack.length > 0) {
      // Remove o último estado da pilha de undo
      const lastTransaction = undoStack.pop()!;
  
      // Armazena o estado atual na pilha de redo, fazendo uma cópia profunda do storedValues
      const currentItems = storedValues.map((item) => ({ ...item }));
      setRedoStack((prev) => [...prev, currentItems]);
  
      // Restaura o estado anterior (os itens da transação desfeita)
      setStoredValues(lastTransaction);
  
      // Atualiza o localStorage para refletir o estado anterior
      lastTransaction.forEach((item) => {
        window.localStorage.setItem(`traqix_item_${item.id}`, JSON.stringify(item));
      });
  
      // Remove do localStorage os itens que não estão mais no estado restaurado
      storedValues.forEach((item) => {
        if (!lastTransaction.find((lastItem) => lastItem.id === item.id)) {
          window.localStorage.removeItem(`traqix_item_${item.id}`);
        }
      });
  
      // Atualiza os timestamps de acordo com o estado restaurado
      const newLastUpdated = lastTransaction.map(() => Date.now());
      setStoredValuesLastUpdated(newLastUpdated);
  
      console.log("Undo realizado com sucesso.", lastTransaction);
    } else {
      console.log("Nenhuma alteração para desfazer.");
    }
  }, [undoStack, storedValues]);
  
  const redo = useCallback(() => {
    if (redoStack.length > 0) {
      const lastTransaction = redoStack.pop()!;
  
      // Armazena o estado atual na pilha de undo
      const currentItems = storedValues.map((item) => ({ ...item }));
      setUndoStack((prev) => [...prev, currentItems]);
  
      // Restaura o estado refazido
      setStoredValues(lastTransaction);
  
      // Atualiza o localStorage para refletir o estado refazido
      lastTransaction.forEach((item) => {
        window.localStorage.setItem(`traqix_item_${item.id}`, JSON.stringify(item));
      });
  
      // Atualiza os timestamps
      const newLastUpdated = lastTransaction.map(() => Date.now());
      setStoredValuesLastUpdated(newLastUpdated);
    } else {
      console.log("Nenhuma alteração para refazer.");
    }
  }, [redoStack, storedValues]);  

  return (
    <TreeContext.Provider
      value={{
        storedValues,
        setTree,
        removeTree,
        getTree,
        onTreeChange,
        undo,
        redo,
      }}
    >
      {children}
    </TreeContext.Provider>
  );
};

export const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("useTree must be used within a TreeProvider");
  }
  return context;
};
