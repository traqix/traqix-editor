"use client";

import React, { useEffect } from "react";
import { EditorLayout } from "./editor-layout";
import { Button } from "@/components/ui/button";
import { Monitor, SunDimIcon } from "lucide-react";

const CanvasPage: React.FC = () => {

  useEffect(() => {
    // Verifica se o tema está salvo no localStorage e aplica ao carregar a página
    const savedTheme = window.localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.className = savedTheme;
    }
  }, []);

  // Função para alternar o tema entre "light" e "dark"
  function setChangeTheme() {
    const currentTheme = document.documentElement.className;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.className = newTheme;
    document.documentElement.style.colorScheme = newTheme;

    // Salva o tema no localStorage para manter ao recarregar
    // window.localStorage.setItem('theme', newTheme);
  }

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-2 right-2 z-10 opacity-50 hover:opacity-80"
        onClick={setChangeTheme}
      >
        <SunDimIcon className="h-4 w-4" />
      </Button>
      <EditorLayout />
    </div>
    );
};

export default CanvasPage;
