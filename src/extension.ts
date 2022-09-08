import * as vscode from 'vscode';
import { SidebarProvider } from "./SidebarProvider";
import { PostErrorInfo, dataObj } from './post';
import { ViewIndexPanel } from './ViewIndexPanel';
import { saveStorage } from './globalState';

// commands
export const extensionCommandId: string = 'error-recorder.errorRecorder';
export const postCommandId: string = 'error-recorder.postError';
export const saveStorageCommandId: string = 'error-recorder.saveStorage';
export const indexWebviewCommandId: string = 'error-recorder.index';
export const sidebarCommandId: string = 'errorRecorderSidebar.focus';

export function activate(context: vscode.ExtensionContext) {

	// Index Webview
	context.subscriptions.push(
		vscode.commands.registerCommand(indexWebviewCommandId, () => {
			ViewIndexPanel.createOrShow(context.extensionUri);
		})
	);

	// SaveStorage
	context.subscriptions.push(
		vscode.commands.registerCommand(
			saveStorageCommandId, () => saveStorage(context)
		)
	);

	// SideBar
	const sidebarProvider = new SidebarProvider(context.extensionUri);
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

	// Post
	context.subscriptions.push(
		vscode.commands.registerCommand(
			postCommandId, () => {
				new PostErrorInfo('https://api/v1/posts', dataObj);
			}
		)
	);

	// StatusBarItem
	const statusBarButton: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0);
	statusBarButton.command = sidebarCommandId;
	statusBarButton.text = 'ErrorRecorder';
	statusBarButton.show();
	context.subscriptions.push(statusBarButton);
}

export function deactivate() { }
