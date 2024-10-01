import { atom, useAtom } from "jotai"

import { Editor, mails } from "@/app/(main)/(editor)/data"

type Config = {
  selected: Editor["id"] | null
}

const configAtom = atom<Config>({
  selected: mails[0].id,
})

export function useEditor() {
  return useAtom(configAtom)
}
