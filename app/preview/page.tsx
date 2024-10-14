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
      <EditorLayout />
    </div>
    );
};

export default CanvasPage;
