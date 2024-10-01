import { useEffect, useState } from 'react';

function useMultipleLocalStorage(keys: string[], initialValues: any[] = []): any[] {
  const [storedValues, setStoredValues] = useState<any[]>(() => {
    return keys.map((key, index) => {
      try {
        if (typeof window !== 'undefined') {
          const item = window.localStorage.getItem(key);
          return item ? JSON.parse(item) : initialValues[index];
        }
        
        return []
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        return initialValues[index];
      }
    });
  });

  // Atualiza o localStorage e emite um evento sempre que os valores armazenados mudarem
  useEffect(() => {
    keys.forEach((key, index) => {
      const newValue = JSON.stringify(storedValues[index]);
      // Verifica se o valor a ser armazenado é diferente do atual
      if (window.localStorage.getItem(key) !== newValue) {
        window.localStorage.setItem(key, newValue);
        window.dispatchEvent(new CustomEvent(`local-storage-update-${key}`, { detail: newValue }));
      }
    });
  }, [keys, storedValues]);

  // Efeito para escutar mudanças no localStorage de outras abas e componentes
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && keys.includes(event.key)) {
        const index = keys.indexOf(event.key);
        const newValue = event.newValue ? JSON.parse(event.newValue) : initialValues[index];
        
        // Verifica se o novo valor é diferente do atual antes de atualizar o estado
        if (JSON.stringify(storedValues[index]) !== JSON.stringify(newValue)) {
          setStoredValues(prevValues => {
            const newValues = [...prevValues];
            newValues[index] = newValue;
            return newValues;
          });
        }
      }
    };

    const handleCustomEvent = (event: CustomEvent) => {
      const key = event.type.replace('local-storage-update-', '');
      if (keys.includes(key)) {
        const index = keys.indexOf(key);
        const newValue = event.detail ? JSON.parse(event.detail) : initialValues[index];
        
        // Verifica se o novo valor é diferente do atual antes de atualizar o estado
        if (JSON.stringify(storedValues[index]) !== JSON.stringify(newValue)) {
          setStoredValues(prevValues => {
            const newValues = [...prevValues];
            newValues[index] = newValue;
            return newValues;
          });
        }
      }
    };

    // Adiciona listeners para o evento `storage` e eventos customizados
    window.addEventListener('storage', handleStorageChange);
    // keys.forEach(key => window.addEventListener(`local-storage-update-${key}`, handleCustomEvent));

    // Limpeza ao desmontar o componente
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      // keys.forEach(key => window.removeEventListener(`local-storage-update-${key}`, handleCustomEvent));
    };
  }, [keys, initialValues, storedValues]);

  // Função para atualizar o valor de uma chave específica
  const setValue = (key: string, value: any) => {
    const index = keys.indexOf(key);
    if (index !== -1) {
      setStoredValues(prevValues => {
        const newValues = [...prevValues];
        newValues[index] = value;
        return newValues;
      });
    }
  };

  return [storedValues, setValue];
}

export default useMultipleLocalStorage;
