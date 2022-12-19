import * as vscode from 'vscode';
import { SidebarProvider } from "./SidebarProvider";

// commands
const extensionCommandId: string = 'error-recorder.errorRecorder';
const sidebarCommandId: string = 'errorRecorderSidebar';

export function activate(context: vscode.ExtensionContext) {

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
