import { useState } from 'react';

const VmIsolated = () => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');

  const runCommand = async () => {
    try {
      const response = await fetch('/api/bash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });

      const data = await response.json();
      if (response.ok) {
        setOutput(data.output);
      } else {
        setOutput(`Erro: ${data.error}`);
      }
    } catch (error) {
      setOutput(`Erro de conexão: ${error}`);
    }
  };

  return (
    <div className="container">
      <h1>Execute Comandos Bash</h1>
      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="Digite um comando Bash"
      />
      <button onClick={runCommand}>Executar</button>
      <pre>{output}</pre>
    </div>
  );
};

export default VmIsolated;
