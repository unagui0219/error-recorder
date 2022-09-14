import * as vscode from 'vscode';
import { SidebarProvider } from "./SidebarProvider";
import { ViewIndexPanel } from './ViewIndexPanel';
import { saveStorage } from './globalState';

// commands
export const extensionCommandId: string = 'error-recorder.errorRecorder';
export const saveStorageCommandId: string = 'error-recorder.saveStorage';
export const indexWebviewCommandId: string = 'error-recorder.index';
export const sidebarCommandId: string = 'errorRecorderSidebar';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand(
			saveStorageCommandId, () => saveStorage(context)
		)
	);

	// SideBar
	const sidebarProvider = new SidebarProvider(context.extensionUri, context);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			sidebarCommandId,
			sidebarProvider
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			extensionCommandId, async () => { }
		)
	);

	// StatusBarItem
	const statusBarButton: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0);
	statusBarButton.command = 'errorRecorderSidebar.focus';
	statusBarButton.text = 'ErrorRecorder';
	statusBarButton.show();
	context.subscriptions.push(statusBarButton);
}

export function deactivate() { }
