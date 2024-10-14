"use client";

import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SelectContent } from "@radix-ui/react-select";
import { Textarea } from "@/components/ui/textarea";

// Definição do schema de validação com Zod
const schema = z.object({
  key: z.string().nonempty("A chave é obrigatória"),
  value: z.string().nullable(), // .nonempty("O valor é obrigatório"),
  variableType: z.enum(["number", "string", "json", "boolean", "array"], {
    required_error: "Por favor, selecione o tipo da variável",
  }),
});

// Tipo inferido a partir do schema
type FormData = z.infer<typeof schema>;

interface TableMemoryCreateProps {
  open: boolean;
  setOpen: any;
  value?: any;
}

// Componente do formulário
export function TableMemoryCreate({
  open,
  setOpen,
  value,
}: TableMemoryCreateProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);

  // Usando React Hook Form com validação do Zod
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    setDialogOpen(open);
    if (value) {
      try {
        setValue("key", value.name);
        setValue("value", value.value.value);
        setValue("variableType", value.value.type);
      } catch (e) {
        console.log("err", e);
      }
      return;
    }
    setValue("key", "");
    setValue("value", "");
    setValue("variableType", "string");
  }, [open]);

  useEffect(() => {
    if (!isDialogOpen) {
      setOpen(false);
    }
  }, [isDialogOpen]);

  // Função de submit
  const onSubmit = (data: FormData) => {
    const { key, value, variableType } = data;

    // Armazenar a variável na memória (localStorage)
    window.localStorage.setItem(
      `traqix_mem_${key}`,
      JSON.stringify({ type: variableType, value: value })
    );

    // Fechar o diálogo após o submit
    setDialogOpen(false);

    // Log para depuração
    console.log("Variável salva:", { key, value });
  };

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={setDialogOpen}>
      {/* <Dialog.Trigger asChild>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          Criar Variável
        </button>
      </Dialog.Trigger> */}
      <Dialog.Portal>
        <Dialog.Overlay className="z-[51] bg-black bg-opacity-50 fixed inset-0" />
        <Dialog.Content className="z-[52] fixed bg-white p-6 rounded-md shadow-lg w-96 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Dialog.Title className="text-lg font-bold">
            Criar Variável na Memória
          </Dialog.Title>

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Chave da Variável
              </label>
              <Input
                type="text"
                {...register("key")}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
              {errors.key && (
                <p className="text-red-500 text-sm">{errors.key.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="variableType"
                className="block text-sm font-medium text-gray-700"
              >
                Tipo da Variável
              </label>

              <Select
                value={getValues("variableType")}
                onValueChange={(value) => {
                  setValue(
                    "variableType",
                    value as "string" | "number" | "boolean" | "array" | "json"
                  ); // Atualiza o valor do form com react-hook-form
                }}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="array">Array</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>

              {errors.variableType && (
                <p className="text-red-500 text-sm">
                  {errors.variableType.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Valor da Variável
              </label>
              <Textarea
                {...register("value")}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
              {errors.value && (
                <p className="text-red-500 text-sm">{errors.value.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Dialog.Close asChild>
                <Button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                >
                  Cancelar
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Criar
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
