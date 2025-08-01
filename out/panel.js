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
exports.showSettingsPanel = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function showSettingsPanel(context) {
    const panel = vscode.window.createWebviewPanel('debugSoundSettings', 'Debug Sound Settings', vscode.ViewColumn.One, {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
    });
    const htmlPath = path.join(context.extensionPath, 'media', 'panel.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    panel.webview.html = htmlContent;
    panel.webview.onDidReceiveMessage(async (message) => {
        if (message.command === 'setSoundPath') {
            await vscode.workspace.getConfiguration('debug-sound-notifier').update('soundPath', message.path, true);
            vscode.window.showInformationMessage(`Sound path updated: ${message.path}`);
        }
    }, undefined, context.subscriptions);
}
exports.showSettingsPanel = showSettingsPanel;
//# sourceMappingURL=panel.js.map