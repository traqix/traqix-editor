"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChangeEvent, useState } from "react"

// Sugestões de classes
const classSuggestions = [
  { value: "bg-primary", label: "Primary" },
  { value: "bg-secondary", label: "Secondary" },
  { value: "success", label: "Success" },
  { value: "danger", label: "Danger" },
  { value: "warning", label: "Warning" },
  { value: "info", label: "Info" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  // Adicione mais classes conforme necessário
];

// Esquema de validação usando Zod
const classSchema = z.object({
  customClass: z.string().min(1, "Class name is required"),
});

type ClassForm = z.infer<typeof classSchema>;

interface EditorRightClassesProps {
  handleAddClass: any;
};

export function EditorRightClasses({ handleAddClass }: EditorRightClassesProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");
  const [inputValue, setInputValue] = useState('');
  
  const { register, handleSubmit, setValue: setFormValue, formState: { errors } } = useForm<ClassForm>({
    resolver: zodResolver(classSchema),
  });

  const [mostUsed, setMostUsed] = useState<string[]>(["primary", "success"]); // Exemplo de classes mais usadas
  const [newValueNotFind, setNewValueNotFind] = useState<string | undefined>()
  const [filteredSuggestions, setFilteredSuggestions] = useState<{ value: string; label: string }[]>([]);

  const handleAddClassLocal = (data: ClassForm) => {
    console.log("Added class:", data.customClass);
    setValue("");
    // Aqui você pode adicionar lógica para salvar a classe como "mais usada"
    if (!mostUsed.includes(data.customClass)) {
      setMostUsed(prev => [data.customClass, ...prev].slice(0, 10)); // Limita a 10 classes mais usadas
    }
    handleAddClass(data.customClass)
  };

  const handleChange = (value: string) => {
    setInputValue(value);
    const newValue = value;
    setNewValueNotFind(newValue)
    setValue(newValue);

    const suggestions = classSuggestions.filter((className) =>
      className.value.toLowerCase().includes(newValue.toLowerCase())
    );

    // Mantém apenas as 10 primeiras sugestões
    setFilteredSuggestions(suggestions.slice(0, 10));
    
    
  };

  return (
    <form onSubmit={handleSubmit(handleAddClassLocal)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {/* {value
              ? classSuggestions.find((className) => className.value === value)?.label
              : "Add custom class..."} */}
            Add custom class...
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder="Search class..."
              {...register("customClass")}
              onValueChange={(e) => handleChange(e)}
              aria-invalid={!!errors.customClass}
              aria-describedby={errors.customClass ? 'customClass-error' : undefined}
            />
            <CommandList>
              
              {inputValue && (
                <CommandGroup>
                  <div className="p-2 font-bold">Add class</div>
                  <CommandItem
                    key={`${inputValue}`}
                    value={inputValue}
                    onSelect={(currentValue) => {
                      handleAddClass(currentValue);
                      setOpen(false);
                    }}
                  >
                    {inputValue}
                  </CommandItem>
                </CommandGroup>
              )}
              

              {mostUsed.length > 0 && <div className="p-2 font-bold">Most Used</div>}
              {mostUsed.map((className) => (
                <CommandItem
                  key={className}
                  value={className}
                  onSelect={(currentValue) => {
                    handleAddClass(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === className ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {className}
                </CommandItem>
              ))}

              {filteredSuggestions.length > 0 && <div className="p-2 font-bold">Suggestions</div>}
              {filteredSuggestions.map((classSuggestion) => (
                <CommandItem
                  key={classSuggestion.value}
                  value={classSuggestion.value}
                  onSelect={(currentValue) => {
                    handleAddClass(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === classSuggestion.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {classSuggestion.label}
                </CommandItem>
              ))}

              {/* Exibir mensagem quando não houver sugestões, mas há um novo valor para adicionar */}
              {filteredSuggestions.length === 0 && !mostUsed.length && newValueNotFind && (
                <div className="p-2 text-gray-500">
                  No class found. Would you like to add <strong>{newValueNotFind}</strong>?
                </div>
              )}
            </CommandList>
          </Command>

        </PopoverContent>
      </Popover>
      {errors.customClass && (
        <span id="customClass-error" className="text-red-500">{errors.customClass.message}</span>
      )}
      <Button type="submit" className="mt-2">Add</Button>
    </form>
  );
}
