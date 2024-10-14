// import { TreeItem } from "@/app/(main)/(editor)/types";
// import { useEffect, useState } from "react";

// let initializedValues: TreeItem[] | null = null;

// function useTreeLocalStorage(
//   initialKeys: string[],
//   initialValues: any[] = []
// ): [TreeItem[], (key: string, value: any) => void, (key: string) => void] {
//   const [keys, setKeys] = useState<string[]>(initialKeys);
//   const [storedValuesLastUpdated, setStoredValuesLastUpdated] = useState<
//     number[]
//   >([]);
//   const [storedValues, setStoredValues] = useState<TreeItem[]>(() => {
//     // if (typeof window === "undefined") return initialValues;

//     console.log("RETURN 1111111111", initialKeys);

//     // Mapeia as chaves iniciais para buscar ou inicializar os valores
//     // Se já tivermos inicializado, retorna os valores armazenados
//     if (initializedValues) {
//       return initializedValues;
//     }

//     // Se não estiver no navegador, retorna os valores iniciais
//     if (typeof window === "undefined") return initialValues;

//     // Inicializa os valores uma única vez e guarda na variável de controle
//     initializedValues = initialKeys.map((key, index) => {
//       try {
//         if (!key || key === "") {
//           return initialValues[index];
//         }

//         const item = window.localStorage.getItem(`traqix_item_${key}`);
//         return item ? JSON.parse(item) : initialValues[index];
//       } catch (error) {
//         console.error(
//           `Erro ao ler o localStorage para "traqix_item_${key}":`,
//           error
//         );
//         return initialValues[index];
//       }
//     });

//     // Retorna os valores inicializados
//     return initializedValues;
//   });

//   useEffect(() => {
//     console.log("RETURN storedValuesLastUpdated", storedValuesLastUpdated);
//     console.log("RETURN storedValues", storedValues);
//     if (storedValues[0] == undefined) {
//       console.log("RETURN undefined", storedValues);
//     }
//     if (
//       !storedValues ||
//       storedValues.length === 0 ||
//       !storedValuesLastUpdated ||
//       storedValuesLastUpdated.length === 0
//     )
//       return;

//     keys.forEach((key, index) => {
//       console.log("VERIFY READ", key, index);
//       const newValue = JSON.stringify(storedValues[index]);
//       const currentStoredValue = window.localStorage.getItem(`traqix_item_${key}`);

//       if (
//         currentStoredValue !== newValue &&
//         (storedValuesLastUpdated[index] > storedValues[index]?.lastUpdate ||
//           !storedValuesLastUpdated[index])
//       ) {
//         if (!storedValues[index]) return;

//         const newValueToMod = { ...storedValues[index] }; //, lastUpdate: new Date().valueOf() };
//         const newValueToSave = JSON.stringify(newValueToMod);

//         console.log("WRITE LOCALT", key, newValueToSave);
//         window.localStorage.setItem(`traqix_item_${key}`, newValueToSave);

//         window.dispatchEvent(
//           new CustomEvent(`local-storage-update-${key}`, {
//             detail: newValueToSave,
//           })
//         );
//       }
//     });
//     console.log("3333333333 VERIFY READ keys", keys);
//   }, [storedValuesLastUpdated]);

//   useEffect(() => {
//     console.log("RETURN aaaaaaaaaaaaaaa", keys);
//     const handleStorageChange = (event: StorageEvent) => {
//       console.log("RETURN eeeeeeeeeeeeee", event);
//       const eventKey = event.key?.replace("traqix_item_", "");
//       if (eventKey && keys.includes(eventKey)) {
//         const index = keys.indexOf(eventKey);
//         const newValue = event.newValue
//           ? JSON.parse(event.newValue)
//           : initialValues[index];

//         console.log("setStoredValues", storedValues);
//         setStoredValues((prevValues) => {
//           const newValues = [...prevValues];
//           newValues[index] = newValue;
//           return newValues;
//         });
//         initializedValues = storedValues;

//         setStoredValuesLastUpdated((prevValues) => {
//           const newValues = [...prevValues];
//           newValues[index] = new Date().valueOf();
//           return newValues;
//         });
//       }
//     };

//     const handleCustomEvent = (event: any) => {
//       console.log("RETURN bbbbbbbbbbbbbb", event);
//       const key = event.type.replace("local-storage-update-", "");
//       if (keys.includes(key)) {
//         const index = keys.indexOf(key);
//         const newValue = event.detail
//           ? JSON.parse(event.detail)
//           : initialValues[index];

//         console.log("setStoredValues", storedValues);
//         setStoredValues((prevValues) => {
//           const newValues = [...prevValues];
//           newValues[index] = newValue;
//           return newValues;
//         });

//         initializedValues = storedValues;

//         setStoredValuesLastUpdated((prevValues) => {
//           const newValues = [...prevValues];
//           newValues[index] = new Date().valueOf();
//           return newValues;
//         });
//       }
//     };

//     window.addEventListener("storage", handleStorageChange);
//     keys.forEach((key) =>
//       window.addEventListener(
//         `local-storage-update-${key}` as keyof WindowEventMap,
//         handleCustomEvent
//       )
//     );

//     console.log("RETURN cccccccccccccc");
//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//       keys.forEach((key) =>
//         window.removeEventListener(
//           `local-storage-update-${key}` as keyof WindowEventMap,
//           handleCustomEvent
//         )
//       );
//     };
//   }, [keys]);

//   const setValue = (key: string, value: any) => {
//     console.log("TTTRRRYYYY 55555");
//     if (!key || key == "") {
//       return;
//     }
//     setKeys((prevKeys) => {
//       if (!prevKeys.includes(key)) {
//         return [...prevKeys, key];
//       }
//       return prevKeys;
//     });

//     console.log("setStoredValues", storedValues);
//     setStoredValues((prevValues) => {
//       const newValues = [...prevValues];
//       const index = keys.indexOf(key);
//       if (index !== -1) {
//         newValues[index] = value;
//       } else {
//         newValues.push(value);
//       }
//       return newValues;
//     });
//     initializedValues = storedValues;

//     setStoredValuesLastUpdated((prevValues) => {
//       const newValues = [...prevValues];
//       const index = keys.indexOf(key);
//       const timestamp = new Date().valueOf();
//       if (index !== -1) {
//         newValues[index] = timestamp;
//       } else {
//         newValues.push(timestamp);
//       }
//       return newValues;
//     });
//     console.log("RETURN 4444444");
//   };

//   const removeKey = (key: string) => {
//     // Remove do localStorage
//     if (key != "root") {
//       console.log("removeKey AAAAAAAAA", key);
//       window.localStorage.removeItem(`traqix_item_${key}`);

//       // Remove a chave das stores de controle
//       setKeys((prevKeys) => prevKeys.filter((k) => k !== key));
//       console.log("setStoredValues", storedValues, keys);
//       setStoredValues((prevValues) => {
//         const newValues = [...prevValues];
//         const index = keys.indexOf(key);
//         if (index !== -1) {
//           newValues.splice(index, 1); // Remove o valor correspondente
//         }
//         return newValues;
//       });
//       initializedValues = storedValues;

//       setStoredValuesLastUpdated((prevValues) => {
//         const newValues = [...prevValues];
//         const index = keys.indexOf(key);
//         if (index !== -1) {
//           newValues.splice(index, 1);
//         }

//         return newValues;
//       });
//       console.log("RETURN 55555");
//     } else {
//       console.log(
//         "AAAAAAAAS SDASDASD",
//         key,
//         storedValues,
//         storedValuesLastUpdated
//       );
//       console.log("setStoredValues", storedValues);
//       setStoredValues((prevValues) => {
//         const newValues = [...prevValues];
//         const index = keys.indexOf(key);
//         if (index !== -1) {
//           console.log("AAAAAAAAS BBBBBBBB", newValues, {
//             ...newValues[index],
//             children: [],
//           });
//           newValues[index] = { ...newValues[index], children: [] };
//         }
//         return newValues;
//       });

//       initializedValues = storedValues;

//       setStoredValuesLastUpdated((prevValues) => {
//         const newValues = [...prevValues];
//         const index = keys.indexOf(key);
//         const timestamp = new Date().valueOf();
//         if (index !== -1) {
//           newValues[index] = timestamp;
//         } else {
//           newValues.push(timestamp);
//         }
//         return newValues;
//       });

//       console.log("AAAAAAAAS EEEEEEEEEEEEND");
//     }
//     console.log("RETURN 66666");
//   };

//   console.log("RETURN 7777");
//   return [storedValues, setValue, removeKey];
// }

// export default useTreeLocalStorage;
