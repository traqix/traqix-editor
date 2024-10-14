import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  addComponent,
  addPresetSection,
  transformSectionToTreeItems,
} from "../utils/util";
import useSWR from "swr";
import type { TreeFull, TreeItem } from "@/app/(main)/(editor)/types";
// import { useCurrentTreeItem } from "@/storage/tree-item-storage";
import { Icons } from "@/components/icons";
import { useTree } from "@/components/context/tree-context";
// import useLocalStorage from "@/hooks/use-local-storage";

interface PresetControlsProps {
  treeRoot?: TreeItem;
  setTree: any;
}

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export function PresetControls() {
  const { data, error, isLoading } = useSWR("/api/presets", fetcher);
  const presetSections: TreeItem[] = data;

  const { getTree, setTree } = useTree();
  const treeRoot = getTree("root");

  function addPresetSection2(section: TreeFull[]) {
    const newsComponents = transformSectionToTreeItems(section);

    console.log("newsComponentsnewsComponents", newsComponents)

    let newComponents: TreeItem[] = []

    newsComponents.map((el: TreeItem, i: number) => {
      if (i < newsComponents.length-1) {
        newComponents.push(el)
        // setTree(el.id, el);
      }
    });

    // if (treeRoot) {
    //   treeRoot.children?.push(newsComponents[0].id);
    //   treeRoot.lastUpdate = new Date().valueOf();

    //   setTree("root", treeRoot);
    // }

    if (newComponents.length) {
      setTree(newComponents);
    }

    if (treeRoot) {
      addComponent(newsComponents[newsComponents.length-1], "root", "inside", treeRoot, setTree);
    }
  }

  if (isLoading) {
    return (
      <div className="relative inset-0 z-10 mt-10 flex h-[--container-height] w-full items-center justify-center gap-2 bg-background text-sm text-muted-foreground">
        <Icons.spinner className="h-4 w-4 animate-spin" />
        Loading...
      </div>
    );
  }
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
          {treeRoot &&
            presetSections?.map((section, i: number) => (
              <Button
                key={`section-add-${i}`}
                disabled={!treeRoot}
                onClick={() => addPresetSection2([section] as TreeFull[])}
              >
                {section.name}
              </Button>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
