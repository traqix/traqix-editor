import { NextResponse } from 'next/server';

// Verifique se você está no ambiente Node.js
const isServer = typeof window === 'undefined';

if (isServer) {
  const ivm = require('isolated-vm'); // Somente importa no lado do servidor
}

// Função auxiliar para rodar scripts de forma isolada
const runIsolatedCommand = async (command: string) => {
  if (!isServer) {
    throw new Error('`isolated-vm` só pode ser executado no lado do servidor.');
  }

  const ivm = require('isolated-vm');
  const isolate = new ivm.Isolate({ memoryLimit: 8 }); // Limita a memória a 8 MB
  const context = await isolate.createContext();
  const jail = context.global;

  // Expor 'command' no ambiente isolado
  await jail.set('command', command);

  const script = await isolate.compileScript(`
    (function() {
      const allowedCommands = ['ls', 'pwd', 'echo'];
      if (allowedCommands.includes(command.split(' ')[0])) {
        return 'Comando permitido: ' + command;
      } else {
        return 'Comando não permitido!';
      }
    })()
  `);

  const result = await script.run(context);
  return result;
};

// API handler para métodos POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { command } = body;

    if (!command) {
      return NextResponse.json({ error: 'Nenhum comando fornecido' }, { status: 400 });
    }

    const result = await runIsolatedCommand(command);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
