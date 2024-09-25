"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, Trash } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ClassSelector from "./class-selector";

const mutuallyExclusiveClasses = {
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
    // Justify Content (Horizontal alignment for flex/grid)
    "justify-start",
    "justify-end",
    "justify-center",
    "justify-between",
    "justify-around",
    "justify-evenly",
  ],

  align: [
    // Align Items (Vertical alignment for flex/grid)
    "items-start",
    "items-end",
    "items-center",
    "items-baseline",
    "items-stretch",
  ],

  selfAuto: [
    // Align Self (Applies to individual flex/grid items)
    "self-auto",
    "self-start",
    "self-end",
    "self-center",
    "self-stretch",
  ],

  placeItemsStart: [
    // Place Items (Combines both justify and align for grid only)
    "place-items-start",
    "place-items-end",
    "place-items-center",
    "place-items-stretch",
  ],

  content: [
    // Align Content (For grid and multi-line flex containers)
    "content-start",
    "content-end",
    "content-center",
    "content-between",
    "content-around",
    "content-evenly",
  ],

  spacing: [
    // Horizontal Spacing (applies gap between children in a flex/grid)
    "space-x-0",
    "space-x-1",
    "space-x-2",
    "space-x-3",
    "space-x-4",
    "space-x-5",
    "space-x-6",
    "space-x-8",
    "space-x-10",
    "space-x-12",
    "space-x-16",
    "space-x-20",
    "space-x-24",
    "space-x-28",
    "space-x-32",
    "space-x-40",
    "space-x-48",
    "space-x-56",
    "space-x-64",

    // Vertical Spacing
    "space-y-0",
    "space-y-1",
    "space-y-2",
    "space-y-3",
    "space-y-4",
    "space-y-5",
    "space-y-6",
    "space-y-8",
    "space-y-10",
    "space-y-12",
    "space-y-16",
    "space-y-20",
    "space-y-24",
    "space-y-28",
    "space-y-32",
    "space-y-40",
    "space-y-48",
    "space-y-56",
    "space-y-64",
  ],

  size: [
    // Width
    "w-0",
    "w-px",
    "w-0.5",
    "w-1",
    "w-1.5",
    "w-2",
    "w-2.5",
    "w-3",
    "w-3.5",
    "w-4",
    "w-5",
    "w-6",
    "w-7",
    "w-8",
    "w-9",
    "w-10",
    "w-11",
    "w-12",
    "w-14",
    "w-16",
    "w-20",
    "w-24",
    "w-28",
    "w-32",
    "w-36",
    "w-40",
    "w-44",
    "w-48",
    "w-52",
    "w-56",
    "w-60",
    "w-64",
    "w-72",
    "w-80",
    "w-96",
    "w-auto",
    "w-full",
    "w-screen",
    "w-min",
    "w-max",
    "w-fit",

    // Height
    "h-0",
    "h-px",
    "h-0.5",
    "h-1",
    "h-1.5",
    "h-2",
    "h-2.5",
    "h-3",
    "h-3.5",
    "h-4",
    "h-5",
    "h-6",
    "h-7",
    "h-8",
    "h-9",
    "h-10",
    "h-11",
    "h-12",
    "h-14",
    "h-16",
    "h-20",
    "h-24",
    "h-28",
    "h-32",
    "h-36",
    "h-40",
    "h-44",
    "h-48",
    "h-52",
    "h-56",
    "h-60",
    "h-64",
    "h-72",
    "h-80",
    "h-96",
    "h-auto",
    "h-full",
    "h-screen",
    "h-min",
    "h-max",
    "h-fit",
  ],
};

const predefinedClasses = [
  "text-center",
  "text-left",
  "text-right",
  "bg-red-500",
  "bg-blue-500",
];

const LayoutBuilder = (props: { classes: any; handleAddClass: any; handleRemoveClass: any; }) => {
  // const [classes, setClasses] = useState<string[]>([]);
  const [customClass, setCustomClass] = useState<string>("");

  const { classes, handleAddClass, handleRemoveClass } = props

  // const handleAddClass = (newClass: string) => {
  //   const conflictGroup = Object.values(mutuallyExclusiveClasses).find(
  //     (group) => group.includes(newClass)
  //   );

  //   if (conflictGroup) {
  //     setClasses((prev) =>
  //       prev.filter((cls) => !conflictGroup.includes(cls)).concat(newClass)
  //     );
  //   } else {
  //     setClasses([...classes, newClass]);
  //   }
  // };

  // const handleRemoveClass = (removeClass: string) => {
  //   setClasses(classes.filter((cls) => cls !== removeClass));
  // };

  const handleManualClass = () => {
    if (customClass && !classes.includes(customClass)) {
      handleAddClass(customClass);
      setCustomClass("");
    }
  };

  const renderClassOptions = (
    options: string[],
    title: string,
    groupName: keyof typeof mutuallyExclusiveClasses
  ) => (
    <div className="space-y-2">
      <Label>{title}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = classes.includes(option);
          const isDisabled = mutuallyExclusiveClasses[groupName].some(
            (cls) => classes.includes(cls) && cls !== option
          );

          return (
            <Button
              key={option}
              variant={isActive ? "secondary" : "outline"}
              size="sm"
              onClick={() =>
                isActive ? handleRemoveClass(option) : handleAddClass(option)
              }
              disabled={isDisabled}
              className={isDisabled ? "hidden opacity-50 cursor-not-allowed" : ""}
            >
              {option}
            </Button>
          );
        })}
      </div>
    </div>
  );

  const renderSizeSliders = () => (
    <div className="space-y-4">
      {Object.entries({
        padding: [0, 10],
        margin: [0, 10],
        width: [0, 100],
        height: [0, 100],
      }).map(([property, [min, max]]) => (
        <div key={property}>
          <Label>{property}</Label>
          {/* <Slider
            min={min}
            max={max}
            step={1}
            value={Number(classes.find(cls => cls.startsWith(property))?.split('-')[1] || 0)}
            onChange={(value) => handleAddClass(`${property}-${value}`)}
          /> */}
        </div>
      ))}
    </div>
  );

  function ComboBox(props: { data: any[]; }) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? props.data?.find((framework: string) => framework === value)
              : "Select framework..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {props.data?.map((framework: string) => (
                  <CommandItem
                    key={framework}
                    value={framework}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === framework ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {framework}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  const renderAutocomplete = () => (
    <div className="space-y-2">
      <Label>Autocomplete Classes</Label>
      {/* <Select
        options={predefinedClasses.filter((option) => !classes.includes(option))}
        onChange={handleAddClass}
        placeholder="Select a class"
      /> */}
    </div>
  );

  const availableClasses = [
    "flex",
    "grid",
    "block",
    "inline-block",
    "hidden",
    "justify-center",
    "justify-start",
    "items-center",
    "items-start",
    "w-1/2",
    "w-full",
    "h-1/2",
    "h-full",
  ];

  const variants = ["dark", "light", "md", "lg", "xs", "sm", "hover", "focus"];

  const Autocomplete2 = () => {
    const [inputValue, setInputValue] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedVariant, setSelectedVariant] = useState('');
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const [addedClasses, setAddedClasses] = useState<string[]>([]);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
  
      const filtered = availableClasses.filter(option =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    };
  
    const handleSelectClass = (className: string) => {
      setSelectedClass(className);
      setFilteredOptions([]);
      setInputValue(className);
    };
  
    const handleSelectVariant = (variant: string) => {
      setSelectedVariant(variant);
    };
  
    const handleAddClass = () => {
      if (selectedClass) {
        const combinedClass = selectedVariant ? `${selectedVariant}:${selectedClass}` : selectedClass;
        setAddedClasses([...addedClasses, combinedClass]);
        setInputValue('');
        setSelectedClass('');
        setSelectedVariant('');
      }
    };
  
    const handleRemoveClass = (index: number) => {
      setAddedClasses(addedClasses.filter((_, i) => i !== index));
    };
  
    return (
      <div className="relative w-full max-w-xs">
        {/* Input de seleção de classes Tailwind */}
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Digite uma classe Tailwind..."
          className="w-full"
        />
  
        {/* Dropdown das classes filtradas */}
        {filteredOptions.length > 0 && (
          <ul className="absolute z-10 mt-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg shadow-md">
            {filteredOptions.map(option => (
              <li
                key={option}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectClass(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
  
        {/* Dropdown para selecionar variantes */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mt-2 w-full">
              {selectedVariant || 'Selecione uma variante'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {variants.map(variant => (
              <DropdownMenuItem key={variant} onClick={() => handleSelectVariant(variant)}>
                {variant}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
  
        {/* Botão para adicionar a classe */}
        <div className="mt-4 flex justify-between items-center">
          <Button variant="default" onClick={handleAddClass} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar classe
          </Button>
        </div>
  
        {/* Lista de classes adicionadas */}
        <div className="mt-4">
          {addedClasses.length > 0 && (
            <ul className="space-y-2">
              {addedClasses.map((addedClass, index) => (
                <li key={index} className="flex justify-between items-center p-2 border rounded-lg">
                  <span>{addedClass}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveClass(index)}>
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-8">
      <ClassSelector />

      {/* {renderClassOptions(
        mutuallyExclusiveClasses.layout,
        "Layout Options",
        "layout"
      )}
      {renderClassOptions(
        mutuallyExclusiveClasses.justify,
        "justify Options",
        "justify"
      )}
      {renderClassOptions(
        mutuallyExclusiveClasses.align,
        "align Options",
        "align"
      )}
      {renderClassOptions(
        mutuallyExclusiveClasses.selfAuto,
        "selfAuto Options",
        "selfAuto"
      )}
      {renderClassOptions(
        mutuallyExclusiveClasses.placeItemsStart,
        "placeItemsStart Options",
        "placeItemsStart"
      )}
      {renderClassOptions(
        mutuallyExclusiveClasses.content,
        "content Options",
        "content"
      )}
      {renderClassOptions(
        mutuallyExclusiveClasses.spacing,
        "Spacing Options",
        "spacing"
      )}
      {renderClassOptions(
        mutuallyExclusiveClasses.size,
        "Size Options",
        "size"
      )} */}

      {/* Sliders para Tamanho */}

      {/* {renderSizeSliders()} */}

      {/* Entrada Manual */}
      
      {/* <div className="space-y-2">
        <Label>Manual Class</Label>
        <Input
          placeholder="Add custom class"
          value={customClass}
          onChange={(e) => setCustomClass(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleManualClass()}
        />
        <Button onClick={handleManualClass}>Add Class</Button>
      </div> */}
      
      <Autocomplete2 />
      
      {/* Autocomplete */}
      {/* {renderAutocomplete()} */}
    </div>
  );
};

export default LayoutBuilder;
