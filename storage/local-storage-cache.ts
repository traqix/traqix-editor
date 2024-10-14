export interface ICache {
    set(key: string, data: string): Promise<void> | void;
    get(key: string): Promise<string | null> | string | null;
  }
  
  export class LocalStorageCache implements ICache {
  
    name: string;
    cache: { [key: string]: string } = {};
  
    constructor(name: string) {
      this.name = name;
    }
  
    set(data: string): void {
      const key = this.name;
      this.cache[key] = data;
  
      try {
        localStorage.setItem(key, JSON.stringify(data)); // btoa(JSON.stringify(data))); // BASE64
      }
      catch (ex) {
        // local storage is unavailable
      }
    }
  
    get(): string | null {
      const key = this.name;
      const textData: string = this.cache[key];
      if (textData) {
        return textData;
      }
  
      try {
        const textDataString: string | null = localStorage.getItem(key);
        if (textDataString) {
          const textData: string = JSON.parse(textDataString); // JSON.parse(atob(textDataString)); // BASE64
  
          if (textData) {
            this.cache[key] = textData;
            return textData;
          }
        }
      }
      catch (ex) {
        // local storage is unavailable or invalid cache value in localstorage
        // console.log('error:', ex);
      }
  
      return null;
    }
  }
  
  export const LocalStorageCache2 = new LocalStorageCache('swrcache');
  export const AsymmetricStorage = new LocalStorageCache('asymmetric');
  export const ContactsStorage = new LocalStorageCache('contactsStorage');