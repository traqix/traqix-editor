"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { PopoverProps } from "@radix-ui/react-popover"

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

import useSWR from 'swr';

import { Preset } from "../data/presets"

interface PresetSelectorProps extends PopoverProps {
  presets: Preset[]
}

const fetcher = (url: string | URL | Request) => fetch(url).then(res => res.json());

export function PresetSelector({ presets, ...props }: PresetSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedPreset, setSelectedPreset] = React.useState<Preset>()
  const router = useRouter()

  const { data, error, isLoading } = useSWR('/traqix-editor/api/presets', fetcher);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar dados</div>;

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Load a preset..."
          aria-expanded={open}
          className="flex-1 justify-between md:max-w-[200px] lg:max-w-[300px]"
        >
          {selectedPreset ? selectedPreset.name : "Load a preset..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search presets..." />
          <CommandList>
            <CommandEmpty>No presets found.</CommandEmpty>
            <CommandGroup heading="Examples">
              {data?.map((preset: any) => (
                <CommandItem
                  key={preset.id}
                  onSelect={() => {
                    setSelectedPreset(preset)
                    setOpen(false)
                  }}
                >
                  {preset.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedPreset?.id === preset.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup className="pt-0">
              <CommandItem onSelect={() => router.push("/examples")}>
                More examples
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
