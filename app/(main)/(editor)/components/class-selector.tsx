import { Button } from "@/components/ui/button";
import React, { useState } from "react";

type LayoutTypes =
  | "flex"
  | "grid"
  | "block"
  | "inline-block"
  | "hidden"
  | "table";
type TailwindClassTypes = {
  layout: string[];
  justify: string[];
  alignItems: string[];
  alignContent: string[];
  alignSelf: string[];
  spacing: string[];
  width: string[];
  height: string[];
};

const tailwindClasses: TailwindClassTypes = {
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
    "space-x-0",
    "space-x-1",
    "space-x-2",
    "space-y-0",
    "space-y-1",
    "space-y-2",
  ],
  width: ["w-1/2", "w-full", "w-auto", "w-screen"],
  height: ["h-1/2", "h-full", "h-auto", "h-screen"],
};

const layoutDependencies: Record<LayoutTypes, string[] | never[]> = {
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
      setSelectedLayout(null);
      handleRemoveClass(layout);
    } else {
      setSelectedLayout(layout);
      handleAddClass(layout);
    }
  };

  const handleReset = () => {
    setSelectedClasses([]);
    setSelectedLayout(null);
    setDisabledClasses([]);
  };

  const getFilteredClasses = () => {
    if (!selectedLayout) return {};

    if (!selectedLayout || !(selectedLayout in layoutDependencies)) return {};

    const applicableClasses =
      layoutDependencies[selectedLayout as LayoutTypes] || [];
    const filtered = applicableClasses.reduce((acc, key) => {
      if (key in tailwindClasses) {
        acc[key] = tailwindClasses[key as keyof TailwindClassTypes] || [];
      }
      return acc;
    }, {} as Partial<Record<string, any>>);

    return filtered;
  };

  const handleDisableConflictingClasses = (selectedClass: string) => {
    const conflicts = Object.keys(tailwindClasses).reduce((acc, key) => {
      const classKey = key as keyof TailwindClassTypes;
      if (tailwindClasses[classKey].includes(selectedClass)) {
        acc = [...acc, ...tailwindClasses[classKey]];
      }
      return acc;
    }, [] as string[]);

    setDisabledClasses((prevDisabled) => [...prevDisabled, ...conflicts]);
  };

  const handleEnableConflictingClasses = (deselectedClass: string) => {
    const conflicts = Object.keys(tailwindClasses).reduce((acc, key) => {
      const classKey = key as keyof TailwindClassTypes;
      if (tailwindClasses[classKey].includes(deselectedClass)) {
        acc = [...acc, ...tailwindClasses[classKey]];
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
            variant={selectedLayout === layout ? "default" : "outline"}
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
                {classes.map((className: string) => (
                  <Button
                    key={className}
                    onClick={() =>
                      selectedClasses.includes(className)
                        ? handleRemoveClass(className)
                        : handleAddClass(className)
                    }
                    disabled={disabledClasses.includes(className)}
                    variant={
                      selectedClasses.includes(className)
                        ? "default"
                        : "outline"
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
