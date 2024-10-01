import { useEffect, useState } from 'react';

function useMultipleLocalStorage(keys: string[], initialValues: any[] = []): [any[], (key: string, value: any) => void] {
  const [storedValues, setStoredValues] = useState<any[]>(() => {
    if (typeof window === 'undefined') return initialValues;

    return keys.map((key, index) => {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValues[index];
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        return initialValues[index];
      }
    });
  });

  // Atualiza o localStorage quando storedValues mudar, mas evita loops infinitos
  useEffect(() => {
    if (!storedValues || storedValues.length === 0) return;

    keys.forEach((key, index) => {
      const newValue = JSON.stringify(storedValues[index]);
      const currentStoredValue = window.localStorage.getItem(key);

      // Só atualiza o localStorage se o valor for diferente
      if (currentStoredValue !== newValue) {
        window.localStorage.setItem(key, newValue);
        window.dispatchEvent(new CustomEvent(`local-storage-update-${key}`, { detail: newValue }));
      }
    });
  }, [keys, storedValues]); // Agora só depende de keys e storedValues para evitar loops

  // Escuta mudanças no localStorage de outras abas e componentes
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && keys.includes(event.key)) {
        const index = keys.indexOf(event.key);
        const newValue = event.newValue ? JSON.parse(event.newValue) : initialValues[index];

        setStoredValues(prevValues => {
          const newValues = [...prevValues];
          newValues[index] = newValue;
          return newValues;
        });
      }
    };

    const handleCustomEvent = (event: any) => {
      const key = event.type.replace('local-storage-update-', '');
      if (keys.includes(key)) {
        const index = keys.indexOf(key);
        const newValue = event.detail ? JSON.parse(event.detail) : initialValues[index];

        setStoredValues(prevValues => {
          const newValues = [...prevValues];
          newValues[index] = newValue;
          return newValues;
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    keys.forEach(key => window.addEventListener(`local-storage-update-${key}` as keyof WindowEventMap, handleCustomEvent));

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      keys.forEach(key => window.removeEventListener(`local-storage-update-${key}` as keyof WindowEventMap, handleCustomEvent));
    };
  }, [keys, initialValues]);

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
