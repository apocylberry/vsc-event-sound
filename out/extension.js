"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const cp = __importStar(require("child_process"));
const vscode = __importStar(require("vscode"));
function playSound(filePath) {
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
    }
    else if (platform === 'darwin') {
        cp.spawn('afplay', [filePath], { detached: true, stdio: 'ignore' }).unref();
    }
    else if (platform === 'linux') {
        cp.spawn('aplay', [filePath], { detached: true, stdio: 'ignore' }).unref();
    }
    else {
        vscode.window.showWarningMessage('Unsupported platform for sound playback.');
    }
}
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('debugSound.selectSound', async () => {
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
    }));
    vscode.debug.registerDebugAdapterTrackerFactory('*', {
        createDebugAdapterTracker() {
            return {
                onDidSendMessage: (message) => {
                    if (message?.event === 'stopped') {
                        const config = vscode.workspace.getConfiguration('debugSound');
                        const userSoundPath = config.get('soundPath');
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
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map