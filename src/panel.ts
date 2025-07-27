import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function showSettingsPanel(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    'debugSoundSettings',
    'Debug Sound Settings',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
    }
  );

  const htmlPath = path.join(context.extensionPath, 'media', 'panel.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  panel.webview.html = htmlContent;

  panel.webview.onDidReceiveMessage(
    async (message) => {
      if (message.command === 'setSoundPath') {
        await vscode.workspace.getConfiguration('debug-sound-notifier').update('soundPath', message.path, true);
        vscode.window.showInformationMessage(`Sound path updated: ${message.path}`);
      }
    },
    undefined,
    context.subscriptions
  );
}
