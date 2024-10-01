import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { addPresetSection } from "../utils/util";
import useSWR from "swr";
import type { TreeItem } from "@/app/(main)/(editor)/types";
// import { useCurrentTreeItem } from "@/storage/tree-item-storage";
import useMultipleLocalStorage from "@/hooks/use-multiple-local-storage";
// import useLocalStorage from "@/hooks/use-local-storage";

const fetcher = (url: string | URL | Request) => fetch(url).then(res => res.json());

export function PresetControls() {

  const [_tree, setTree] = useMultipleLocalStorage(['tx_current'], [null]);
  const { data, error, isLoading } = useSWR('/traqix-editor/api/presets', fetcher);
  const presetSections: TreeItem[] = data

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar dados</div>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Preset Section</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Preset Section</DialogTitle>
          <DialogDescription>
            Choose a preset section to add to your layout.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 grid-cols-3">
          {presetSections?.map((section) => (
            <Button key={section.id} onClick={() => setTree("tx_current", section)}>
              {section.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
