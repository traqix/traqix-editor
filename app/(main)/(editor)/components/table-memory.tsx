"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  ArrowUp01,
  Calendar,
  CaseSensitive,
  Code,
  Edit2,
  List,
  Table2,
  Text,
  TextCursorInput,
  ToggleLeft,
  Trash2,
} from "lucide-react";
import { TableMemoryCreate } from "./table-memory-create";
import { useMemory } from "@/components/context/memory-context";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Função utilitária para carregar as variáveis da memória
const loadMemoryVariables = (getMemory: any) => {

  const keys = Object.keys(localStorage);
  try {
    const memoryVariables = keys
      .filter((key) => key.startsWith("traqix_mem_"))
      .map((key) => ({
        id: key,
        name: key.replace("traqix_mem_", ""),
        value: getMemory(key.replace('traqix_mem_', '')),
      }));

    return memoryVariables;
  } catch (e) {
    return [];
  }
};

export function DialogTableMemory() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<any | undefined>();
  const [variables, setVariables] = useState<
    { id: string; name: string; value: string | null }[]
  >([]);

  const { getMemory } = useMemory();

  useEffect(() => {
    // Carregar as variáveis da memória ao montar o componente
    setVariables(loadMemoryVariables(getMemory));
  }, []);

  const handleDelete = (id: string) => {
    localStorage.removeItem(id); // Remove da memória
    setVariables(loadMemoryVariables(getMemory)); // Atualiza o estado
  };

  const handleEdit = (value: any) => {
    const valueEdit = getMemory(value)
    setValue({
      name: value,
      value: valueEdit,
    });
    setOpen(true);
    // localStorage.removeItem(id); // Remove da memória
    // setVariables(loadMemoryVariables()); // Atualiza o estado
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg mx-auto"
          aria-label="API"
        >
          <Table2 className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-7xl max-h-[calc(100vh-16rem)]">
        <TableMemoryCreate open={open} value={value} setOpen={setOpen} />
        <DialogHeader>
          <DialogTitle>Valores da Memória</DialogTitle>
          <DialogDescription>
            Gerencie suas variáveis de memória aqui. Adicione, edite ou remova
            conforme necessário.
          </DialogDescription>
        </DialogHeader>
        
          <div className="grid gap-4 py-4">
            <div className="w-full max-w-6xl mx-auto md:min-h-96 flex flex-col justify-between">
              <ScrollArea className="max-h-[calc(100vh-36rem)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-5 max-w-10">#</TableHead>
                      <TableHead className="w-10">Action</TableHead>
                      <TableHead className="w-10">Type</TableHead>
                      <TableHead className="w-52">Name</TableHead>
                      <TableHead>Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {variables.length > 0 ? (
                      variables.map((variable, index) => (
                        <TableRow key={variable.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="flex gap-2">
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(variable.id)}
                              aria-label="Delete"
                              className="w-8 h-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="secondary"
                              size="icon"
                              onClick={() => handleEdit(variable.name)}
                              aria-label="Edit"
                              className="w-8 h-8"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                          <TableCell className="">
                            <div>
                              <div>
                                {variable.value?.type == "number" ? (
                                  <ArrowUp01 />
                                ) : (
                                  ""
                                )}
                                {variable.value?.type == "string" ? (
                                  <CaseSensitive />
                                ) : (
                                  ""
                                )}
                                {variable.value?.type == "array" ? <List /> : ""}
                                {variable.value?.type == "boolean" ? (
                                  <ToggleLeft />
                                ) : (
                                  ""
                                )}
                                {variable.value?.type == "json" ? <Code /> : ""}
                                {variable.value?.type == "date" ? <Calendar /> : ""}
                              </div>
                              <div className="font-light">{getMemory(variable.name)?.type}</div>
                            </div>
                          </TableCell>
                          <TableCell>{variable.name}</TableCell>
                          <TableCell>{JSON.stringify(getMemory(variable.name)?.value) ?? ""}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          Nenhuma variável encontrada na memória.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" /> 
              </ScrollArea>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              setValue(undefined);
              setOpen(true);
            }}
          >
            Create Variables
          </Button>
          <Button type="submit">Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
