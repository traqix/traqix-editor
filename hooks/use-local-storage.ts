// import { useState, useEffect } from 'react';

// function useLocalStorage(key: string, initialValue?: any) {
//   // Obtenha o valor inicial do localStorage, ou use o valor inicial padrão
//   const [storedValue, setStoredValue] = useState(() => {
//     try {
//       const item = window.localStorage.getItem(key);
//       return item ? JSON.parse(item) : initialValue;
//     } catch (error) {
//       console.error(error);
//       return initialValue;
//     }
//   });

//   // Atualiza o localStorage sempre que o estado `storedValue` mudar
//   useEffect(() => {
//     try {
//       window.localStorage.setItem(key, JSON.stringify(storedValue));
//        window.dispatchEvent(new Event('storage'));
//     } catch (error) {
//       console.error(error);
//     }
//   }, [key, storedValue]);

//   // Efeito para escutar mudanças no localStorage
//   useEffect(() => {
//     const handleStorageChange = (event: StorageEvent) => {
//       console.log("BBBBBBBBB", event.key, key)
//       if (event.key === key) {
//         console.log("AAAAAAAAAAAAAAAE EEEE", event.key, key)
//         // Atualiza o estado se o valor do localStorage mudar
//         setStoredValue(event.newValue ? JSON.parse(event.newValue) : initialValue);
//       }
//     };

//     // Adiciona o listener para o evento storage
//     window.addEventListener('storage', handleStorageChange);

//     // Limpeza do listener ao desmontar
//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, []);

//   return [storedValue, setStoredValue];
// }

// export default useLocalStorage;
