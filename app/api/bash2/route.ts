import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';
import ivm from 'isolated-vm';

const execPromise = util.promisify(exec);

// Função para rodar um comando usando child_process e retornar o resultado
const runSystemCommand = async (command: string) => {
  const { stdout, stderr } = await execPromise(command);
  if (stderr) {
    throw new Error(`Erro na execução do comando: ${stderr}`);
  }
  return stdout.trim(); // Remove espaços em branco extras
};

// Função para rodar o comando no ambiente isolado
const runIsolatedCommand = async (systemOutput: string) => {
  const isolate = new ivm.Isolate({ memoryLimit: 8 });
  const context = await isolate.createContext();
  const jail = context.global;

  // Exponha o resultado do comando no ambiente isolado
  await jail.set('systemOutput', systemOutput, { copy: true });

  // Compile e execute o script no ambiente isolado
  const script = await isolate.compileScript(`
    (function() {
      return 'O resultado do comando no ambiente isolado é: ' + systemOutput;
    })()
  `);

  const result = await script.run(context);
  return result;
};

// Handler da rota POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { command } = body;

    if (!command) {
      return NextResponse.json({ error: 'Nenhum comando fornecido' }, { status: 400 });
    }

    // Executa o comando no sistema
    // const systemOutput = await runSystemCommand(command);

    // Executa o resultado do comando no ambiente isolado
    const isolatedResult = await runIsolatedCommand(command);

    // Retorna o resultado da execução no ambiente isolado
    return NextResponse.json({ result: isolatedResult });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
