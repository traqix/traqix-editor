import { NextResponse } from 'next/server';
import ivm from 'isolated-vm';

// Função para executar um script JavaScript dentro de isolated-vm
const runScriptInIsolatedVM = async (script: string) => {
  const isolate = new ivm.Isolate({ memoryLimit: 8 });
  const context = await isolate.createContext();
  const jail = context.global;

  // Compile and run the script
  const compiledScript = await isolate.compileScript(script);
  const result = await compiledScript.run(context);

  return result;
};

// Handler da rota API
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { script } = body;

    if (!script) {
      return NextResponse.json({ error: 'Nenhum script fornecido' }, { status: 400 });
    }

    // Executa o script no ambiente isolado
    const result = await runScriptInIsolatedVM(script);

    // Retorna o resultado da execução no ambiente isolado
    return NextResponse.json({ result: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
