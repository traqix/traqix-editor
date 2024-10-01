import React, { useRef, useEffect } from 'react';

const IframeEditor: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      // Acessa o documento do iframe
      const iframeDocument = iframeRef.current.contentDocument;
      if (iframeDocument) {
        // Define o conteúdo HTML inicial do iframe
        iframeDocument.open();
        iframeDocument.write(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <style>
                /* Estilos aplicados apenas dentro do iframe */
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                }
                button {
                  background-color: #007bff;
                  color: white;
                  padding: 10px;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;
                  transition: background-color 0.3s;
                }
                button:hover {
                  background-color: #0056b3;
                }
              </style>
            </head>
            <body>
              <div id="root"></div>
            </body>
          </html>
        `);
        iframeDocument.close();
      }
    }
  }, []);

  const updateIframeContent = () => {
    if (iframeRef.current) {
      const iframeDocument = iframeRef.current.contentDocument;
      if (iframeDocument) {
        // Define o código HTML/JSX a ser renderizado dentro do iframe
        const root = iframeDocument.getElementById('root');
        if (root) {
          root.innerHTML = `
            <div>
              <h1>Este é um conteúdo dentro do iframe</h1>
              <button>Botão de Exemplo</button>
            </div>
          `;
        }
      }
    }
  };

  return (
    <div>
      <h1>Editor com iframe</h1>
      <button onClick={updateIframeContent} className="bg-green-500 text-white px-4 py-2 rounded">
        Atualizar iframe
      </button>
      {/* iframe onde o conteúdo será renderizado */}
      <iframe
        ref={iframeRef}
        style={{ width: '100%', height: '400px', border: '1px solid #ccc' }}
        sandbox="allow-scripts"
      />
    </div>
  );
};

export default IframeEditor;