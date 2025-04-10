export function getWebviewContent(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PureGPT</title>
    </head>
    <body>
      <h2>PureGPT</h2>
      <textarea id="input" rows="4" style="width: 100%;"></textarea>
      <button id="send">Ask</button>
      <pre id="response" style="white-space: pre-wrap;"></pre>

      <script>
        const vscode = acquireVsCodeApi();
        document.getElementById('send').addEventListener('click', () => {
          const input = document.getElementById('input').value;
          vscode.postMessage({ command: 'ask', text: input });
        });

        window.addEventListener('message', event => {
          const message = event.data;
          if (message.command === 'response') {
            document.getElementById('response').textContent = message.text;
          }
        });
      </script>
    </body>
    </html>
  `;
}
