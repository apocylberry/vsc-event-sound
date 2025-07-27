import * as fs from 'fs';
import * as os from 'os';
import * as cp from 'child_process';
import * as vscode from 'vscode';

function playSound(filePath: string) {
  if (!filePath || !fs.existsSync(filePath)) {
    vscode.window.showErrorMessage(`Sound file not found: ${filePath}`);
    return;
  }

  const platform = os.platform();

  if (platform === 'win32') {
    // Escape single quotes for PowerShell
    const escapedPath = filePath.replace(/'/g, "''");
    const psCommand = `[System.Media.SoundPlayer]::new('${escapedPath}').PlaySync()`;

    const child = cp.spawn('powershell.exe', [
      '-NoProfile',
      '-WindowStyle', 'Hidden',
      '-ExecutionPolicy', 'Bypass',
      '-Command', psCommand
    ]);

    let errorOutput = '';
    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      if (code !== 0) {
        console.error(`PowerShell exited with code ${code}, stderr: ${errorOutput}`);
        vscode.window.showErrorMessage(`Sound play error: ${errorOutput}`);
      }
    });

  } else if (platform === 'darwin') {
    cp.spawn('afplay', [filePath], { detached: true, stdio: 'ignore' }).unref();
  } else if (platform === 'linux') {
    cp.spawn('aplay', [filePath], { detached: true, stdio: 'ignore' }).unref();
  } else {
    vscode.window.showWarningMessage('Unsupported platform for sound playback.');
  }
}



export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('debugSound.selectSound', async () => {
      const files = await vscode.window.showOpenDialog({
        canSelectMany: false,
        filters: {
          'Audio Files': ['wav', 'mp3', 'ogg', 'aiff'],
          'All Files': ['*']
        }
      });
      if (files && files.length > 0) {
        const selectedPath = files[0].fsPath;
        await vscode.workspace.getConfiguration('debugSound').update('soundPath', selectedPath, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Sound path updated: ${selectedPath}`);
      }
    })
  );

  vscode.debug.registerDebugAdapterTrackerFactory('*', {
    createDebugAdapterTracker() {
      return {
        onDidSendMessage: (message: any) => {
          if (message?.event === 'stopped') {
            const config = vscode.workspace.getConfiguration('debugSound');
            const userSoundPath: string | undefined = config.get('soundPath');

            // Default Windows sound (adjust for your platform if desired)
            const defaultSoundPath = os.platform() === 'win32'
              ? 'C:\\Windows\\Media\\Speech Off.wav'
              : '';

            playSound(userSoundPath || defaultSoundPath);
          }
        }
      };
    }
  });
}

export function deactivate() {}
