// import { TreeItem } from '@/app/(main)/(editor)/types';
// import { useEffect, useState } from 'react';

// function useTreeLocalStorage(initialKeys: string[], initialValues: any[] = []): [TreeItem[], (key: string, value: any) => void] {
//   const [keys, setKeys] = useState<string[]>(initialKeys); // Agora `keys` é uma state que pode ser atualizada dinamicamente
//   const [storedValuesLastUpdated, setStoredValuesLastUpdated] = useState<number[]>([])
//   const [storedValues, setStoredValues] = useState<TreeItem[]>(() => {
//     if (typeof window === 'undefined') return initialValues;

//     return initialKeys.map((key, index) => {
//       try {
//         // console.log("RRRRRRREEEEEEEAAAAAAAAADDDDDDDDDDD initialKeys", key)
//         const item = window.localStorage.getItem(`traqix_item_${key}`);
//         return item ? JSON.parse(item) : initialValues[index] || ""; // Retorna valor vazio caso não exista
//       } catch (error) {
//         console.error(`Error reading localStorage key "traqix_item_${key}":`, error);
//         return initialValues[index] || "";
//       }
//     });
//   });

//   // Atualiza o localStorage quando storedValues mudar
//   useEffect(() => {
//     if (!storedValues || storedValues.length === 0) return;

//     keys.forEach((key, index) => {
//       const newValue = JSON.stringify(storedValues[index]);
//       console.log("RRRRRRREEEEEEEAAAAAAAAADDDDDDDDDDD", key, storedValuesLastUpdated[index], storedValues[index].lastUpdate, storedValuesLastUpdated[index] > storedValues[index].lastUpdate)
//       const currentStoredValue = window.localStorage.getItem(`traqix_item_${key}`);

//       if (currentStoredValue !== newValue && storedValuesLastUpdated[index] > storedValues[index].lastUpdate || !currentStoredValue) {
//         if(!storedValues[index]) {
//           return;
//         }
//         const newDateLastUpdated = new Date().valueOf()
//         setStoredValuesLastUpdated(prevValues => {
//           const newValues = [...prevValues];
//           newValues[index] = newDateLastUpdated
//           return newValues;
//         });

//         let newValueToMod = storedValues[index]

//         newValueToMod.lastUpdate = newDateLastUpdated;
        
//         const newValueToSave = JSON.stringify(newValueToMod);
//         console.log("WWWWWWRRRRRRRRRIIIIIITTTTEEEEEE EEEEEEEEE", key, newValueToSave)
//         window.localStorage.setItem(`traqix_item_${key}`, newValueToSave);
//         //setTimeout(() => {
//           window.dispatchEvent(new CustomEvent(`local-storage-update-${key}`, { detail: newValueToSave }));
//         //}, 100);
//       } else {
//         // console.log("NOOTTTTTTTTT EEEEEEEEE", key, newValue)
//       }
//     });
//   }, [keys, storedValues]); // Agora depende de keys e storedValues para monitoramento dinâmico
//   // }, [keys, storedValues]); // Agora depende de keys e storedValues para monitoramento dinâmico

//   // Escuta mudanças no localStorage de outras abas e componentes
//   useEffect(() => {
//     const handleStorageChange = (event: StorageEvent) => {
//       const eventKey = event.key?.replace('traqix_item_', '');
//       if (eventKey && keys.includes(eventKey)) {
//         const index = keys.indexOf(eventKey);
//         const newValue = event.newValue ? JSON.parse(event.newValue) : initialValues[index];

//         setStoredValues(prevValues => {
//           const newValues = [...prevValues];
//           newValues[index] = newValue;
//           return newValues;
//         });

//         setStoredValuesLastUpdated(prevValues => {
//           const newValues = [...prevValues];
//           newValues[index] = new Date().valueOf();
//           return newValues;
//         });
//       }
//     };

//     const handleCustomEvent = (event: any) => {
//       const key = event.type.replace('local-storage-update-', '');
//       if (keys.includes(key)) {
//         const index = keys.indexOf(key);
//         const newValue = event.detail ? JSON.parse(event.detail) : initialValues[index];

//         setStoredValues(prevValues => {
//           const newValues = [...prevValues];
//           newValues[index] = newValue;
//           return newValues;
//         });

//         setStoredValuesLastUpdated(prevValues => {
//           const newValues = [...prevValues];
//           newValues[index] = new Date().valueOf();
//           return newValues;
//         });
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
//     keys.forEach(key => window.addEventListener(`local-storage-update-${key}` as keyof WindowEventMap, handleCustomEvent));

//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//       keys.forEach(key => window.removeEventListener(`local-storage-update-${key}` as keyof WindowEventMap, handleCustomEvent));
//     };
//   }, [keys]); // Monitora alterações na lista `keys`

//   // Função para atualizar o valor de uma chave específica
//   const setValue = (key: string, value: any) => {
//     setKeys((prevKeys) => {
//       if (!prevKeys.includes(key)) {
//         // Adiciona dinamicamente a nova chave à lista de `keys`
//         return [...prevKeys, key];
//       }
//       return prevKeys;
//     });

//     setStoredValues((prevValues) => {
//       const index = keys.indexOf(key);
//       const newValues = [...prevValues];

//       if (index !== -1) {
//         // Se o index já existe, atualiza o valor
//         newValues[index] = value;
//       } else {
//         // Se o index não existe, adiciona o novo valor correspondente
//         if (value){
//           newValues.push(value);
//         }
//       }

//       return newValues;
//     });


//     setStoredValuesLastUpdated(prevValues => {
//       const index = keys.indexOf(key);
//       const newValues = [...prevValues];

//       if (index !== -1) {
//         // Se o index já existe, atualiza o valor
//         newValues[index] = new Date().valueOf();
//       } else {
//         // Se o index não existe, adiciona o novo valor correspondente
//         newValues.push(new Date().valueOf());
//       }

//       return newValues;
//     });
//   };

//   return [storedValues, setValue];
// }

// export default useTreeLocalStorage;
