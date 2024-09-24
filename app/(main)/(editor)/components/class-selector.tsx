import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const tailwindClasses = {
  layout: [
    "flex",
    "inline-flex",
    "grid",
    "inline-grid",
    "block",
    "inline-block",
    "hidden",
    "table",
    "inline-table",
    "flow-root",
  ],
  justify: [
    "justify-start",
    "justify-end",
    "justify-center",
    "justify-between",
    "justify-around",
    "justify-evenly",
  ],
  alignItems: [
    "items-start",
    "items-end",
    "items-center",
    "items-baseline",
    "items-stretch",
  ],
  alignContent: [
    "content-start",
    "content-end",
    "content-center",
    "content-between",
    "content-around",
    "content-evenly",
  ],
  alignSelf: [
    "self-auto",
    "self-start",
    "self-end",
    "self-center",
    "self-stretch",
  ],
  spacing: [
    "space-x-0", "space-x-1", "space-x-2", "space-y-0", "space-y-1", "space-y-2",
  ],
  width: [
    "w-1/2", "w-full", "w-auto", "w-screen",
  ],
  height: [
    "h-1/2", "h-full", "h-auto", "h-screen",
  ],
};

// Classes compatíveis com layouts
const layoutDependencies = {
  flex: ["justify", "alignItems", "alignSelf", "spacing"],
  grid: ["justify", "alignItems", "alignContent", "spacing"],
  block: [],
  "inline-block": [],
  hidden: [],
  table: [],
};

const ClassSelector = () => {
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [disabledClasses, setDisabledClasses] = useState<string[]>([]);

  const handleAddClass = (className: string) => {
    if (!selectedClasses.includes(className)) {
      setSelectedClasses((prevClasses) => [...prevClasses, className]);
      handleDisableConflictingClasses(className);
    }
  };

  const handleRemoveClass = (className: string) => {
    setSelectedClasses((prevClasses) =>
      prevClasses.filter((cls) => cls !== className)
    );
    handleEnableConflictingClasses(className);
  };

  const handleLayoutSelection = (layout: string) => {
    if (selectedLayout === layout) {
      // Deselecionar layout
      setSelectedLayout(null);
      handleRemoveClass(layout);
    } else {
      // Selecionar layout
      setSelectedLayout(layout);
      handleAddClass(layout);
    }
  };

  const handleReset = () => {
    setSelectedClasses([]);
    setSelectedLayout(null);
    setDisabledClasses([]);
  };

  // Filtrar classes com base no layout
  const getFilteredClasses = () => {
    if (!selectedLayout) return {};

    const applicableClasses = layoutDependencies[selectedLayout] || [];
    const filtered = applicableClasses.reduce((acc, key) => {
      acc[key] = tailwindClasses[key] || [];
      return acc;
    }, {} as Record<string, string[]>);

    return filtered;
  };

  const handleDisableConflictingClasses = (selectedClass: string) => {
    // Desabilita classes da mesma categoria
    const conflicts = Object.keys(tailwindClasses).reduce((acc, key) => {
      if (tailwindClasses[key].includes(selectedClass)) {
        acc = [...acc, ...tailwindClasses[key]];
      }
      return acc;
    }, [] as string[]);

    setDisabledClasses((prevDisabled) => [...prevDisabled, ...conflicts]);
  };

  const handleEnableConflictingClasses = (deselectedClass: string) => {
    // Reabilita classes anteriormente desabilitadas
    const conflicts = Object.keys(tailwindClasses).reduce((acc, key) => {
      if (tailwindClasses[key].includes(deselectedClass)) {
        acc = [...acc, ...tailwindClasses[key]];
      }
      return acc;
    }, [] as string[]);

    setDisabledClasses((prevDisabled) =>
      prevDisabled.filter((cls) => !conflicts.includes(cls))
    );
  };

  const filteredClasses = getFilteredClasses();

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        {/* Layout Selection */}
        {tailwindClasses.layout.map((layout) => (
          <Button
            key={layout}
            onClick={() => handleLayoutSelection(layout)}
            variant={selectedLayout === layout ? "primary" : "outline"}
          >
            {layout}
          </Button>
        ))}
      </div>

      {/* Mostrar classes dependentes do layout */}
      {Object.keys(filteredClasses).length > 0 && (
        <div>
          {Object.entries(filteredClasses).map(([category, classes]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold">{category}</h3>
              <div className="flex space-x-2 flex-wrap">
                {classes.map((className) => (
                  <Button
                    key={className}
                    onClick={() =>
                      selectedClasses.includes(className)
                        ? handleRemoveClass(className)
                        : handleAddClass(className)
                    }
                    disabled={disabledClasses.includes(className)}
                    variant={
                      selectedClasses.includes(className) ? "primary" : "outline"
                    }
                  >
                    {className}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Classes Selecionadas */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Classes Selecionadas</h3>
        <div className="flex space-x-2 flex-wrap">
          {selectedClasses.map((className) => (
            <Button
              key={className}
              onClick={() => handleRemoveClass(className)}
              variant="destructive"
            >
              {className}
            </Button>
          ))}
        </div>
      </div>

      {/* Botão para resetar classes */}
      <div className="mt-4 space-x-2">
        <Button onClick={handleReset} variant="destructive">
          Resetar
        </Button>
      </div>
    </div>
  );
};

export default ClassSelector;
