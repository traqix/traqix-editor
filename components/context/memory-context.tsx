"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface MemoryContextType {
  storedValues: Record<string, any>; // Para armazenar valores genéricos
  setMemory: (key: string, value: any) => void; // Define um valor na memória
  removeMemory: (key: string) => void; // Remove um valor da memória
  getMemory: (key: string) => any; // Obtém um valor da memória
  storedValuesLastUpdated: number[]; // Rastreia os timestamps das últimas atualizações
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export const MemoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedValues, setStoredValues] = useState<Record<string, any>>({});
  const [storedValuesLastUpdated, setStoredValuesLastUpdated] = useState<number[]>([]);
  const [keys, setKeys] = useState<string[]>(Object.keys(storedValues)); // Para rastrear as chaves existentes no estado

  const setMemory = useCallback((key: string, value: any) => {
    const timestamp = Date.now(); // Obtém o timestamp atual

    setStoredValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));

    // Atualiza os timestamps
    setStoredValuesLastUpdated((prevValues) => {
      const index = Object.keys(prevValues).indexOf(key);
      const newValues = [...prevValues];

      if (index !== -1) {
        newValues[index] = timestamp; // Atualiza timestamp existente
      } else {
        newValues.push(timestamp); // Adiciona novo timestamp
      }

      return newValues;
    });

    // Armazena no localStorage
    window.localStorage.setItem(`traqix_mem_${key}`, JSON.stringify(value));
    console.log(`Stored value set for key: ${key}`);
  }, []);

  const removeMemory = useCallback((key: string) => {
    setStoredValues((prevValues) => {
      const { [key]: _, ...rest } = prevValues; // Remove o valor
      return rest;
    });

    setStoredValuesLastUpdated((prevValues) => {
      const index = Object.keys(prevValues).indexOf(key);
      if (index !== -1) {
        const newValues = [...prevValues];
        newValues.splice(index, 1); // Remove o timestamp
        return newValues;
      }
      return prevValues; // Retorna inalterado se não encontrado
    });

    window.localStorage.removeItem(`traqix_mem_${key}`); // Remove do localStorage
    console.log(`Removed stored value for key: ${key}`);
  }, []);

  const getMemory = useCallback((key: string): any => {
    const value = storedValues[key];

    if (value !== undefined) {
      return value;
    }

    const itemFromLocalStorage = window.localStorage.getItem(`traqix_mem_${key}`);
    if (itemFromLocalStorage) {
      try {
        const parsedItem = JSON.parse(itemFromLocalStorage);
        return parsedItem;
      } catch (e) {
        console.error(`Error parsing item from localStorage for key: ${key}`, e);
        return undefined;
      }
    }

    return undefined; // Retorna indefinido se não encontrado
  }, [storedValues]);

  // Listener para eventos de mudança no localStorage
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      const eventKey = event.key;

      if (eventKey) {
        try {
          const newValue = event.newValue ? JSON.parse(event.newValue) : undefined;

          if (newValue !== undefined) {
            setStoredValues((prevValues) => ({
              ...prevValues,
              [eventKey]: newValue,
            }));

            // Atualiza o timestamp para a chave alterada
            setStoredValuesLastUpdated((prevValues) => {
              const newValues = [...prevValues];
              const index = Object.keys(prevValues).indexOf(eventKey);
              const timestamp = Date.now(); // Obtém o novo timestamp

              if (index !== -1) {
                newValues[index] = timestamp; // Atualiza o timestamp existente
              } else {
                newValues.push(timestamp); // Adiciona um novo timestamp
              }

              return newValues;
            });
          }
        } catch (e) {
          console.log('eee', e)
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Propaga as mudanças nos valores armazenados para os componentes
  useEffect(() => {
    const handleStoredValuesChange = () => {
      setKeys(Object.keys(storedValues)); // Atualiza as chaves
    };

    handleStoredValuesChange();
  }, [storedValues]);

  return (
    <MemoryContext.Provider
      value={{
        storedValues,
        setMemory,
        removeMemory,
        getMemory,
        storedValuesLastUpdated, // Passa os timestamps
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
};

export const useMemory = () => {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error("useMemory must be used within a MemoryProvider");
  }
  return context;
};
