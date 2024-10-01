import { promises as fs } from "fs";
import path from "path";
import type { TreeItem } from "@/app/(main)/(editor)/types";
import { NextRequest, NextResponse } from "next/server";

// export const runtime = "edge"

export async function GET(_req: NextRequest, res: NextResponse) {
  const jsonDirectory = path.join(process.cwd(), "/components/preset-editor");

  try {
    // Lê todos os arquivos JSON na pasta
    const filenames = await fs.readdir(jsonDirectory);

    const jsonFiles = filenames.filter((file) => file.endsWith(".json"));

    const sections: TreeItem[] = [];

    // Lê o conteúdo de cada arquivo JSON
    for (const file of jsonFiles) {
      const filePath = path.join(jsonDirectory, file);
      const fileContents = await fs.readFile(filePath, "utf8");

      sections.push(...JSON.parse(fileContents));
    }

    // Retorna os dados dos JSONs
    return new Response(JSON.stringify(sections), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.log("Error creating order.", err);
  }
}
