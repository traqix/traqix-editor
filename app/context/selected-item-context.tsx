import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { TreeItem } from "@/app/(main)/(editor)/types";

// Definindo o tipo do contexto
interface SelectedItemContextType {
  selectedItem: TreeItem | null;
  setSelectedItem: (item: TreeItem | null) => void;
}

// Criando o contexto
const SelectedItemContext = createContext<SelectedItemContextType | undefined>(undefined);

// Provedor do contexto
export const SelectedItemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState<TreeItem | null>(null);

  return (
    <SelectedItemContext.Provider value={{ selectedItem, setSelectedItem }}>
      {children}
    </SelectedItemContext.Provider>
  );
};

// Hook para usar o contexto
export const useSelectedItem = () => {
  const context = useContext(SelectedItemContext);
  if (!context) {
    throw new Error('useSelectedItem must be used within a SelectedItemProvider');
  }
  return context;
};
