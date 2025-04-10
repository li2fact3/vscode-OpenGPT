import * as vscode from 'vscode';
import { getWebviewContent } from './webview';
import { sendMessageToGPT } from './openai';

export function activate(context: vscode.ExtensionContext) {
  const provider = new GPTSidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('puregpt.sidebar', provider)
  );
}

class GPTSidebarProvider implements vscode.WebviewViewProvider {
  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.html = getWebviewContent();

    webviewView.webview.onDidReceiveMessage(async (message) => {
      if (message.command === 'ask') {
        const response = await sendMessageToGPT(message.text);
        webviewView.webview.postMessage({ command: 'response', text: response });
      }
    });
  }
} 

export function deactivate() {}
