import * as vscode from 'vscode';
import { SidebarProvider } from "./SidebarProvider";
import { postErrorInfo } from './post';
import { saveStorage } from './globalState';

// commands
export const extensionCommandId: string = 'error-recorder.errorRecorder';
export const postCommandId: string = 'error-recorder.postError';
export const saveStorageCommandId: string = 'error-recorder.saveStorage';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand(
			saveStorageCommandId, () => saveStorage(context)
		)
	);

	// SideBar
	const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "errorRecorder-sidebar",
      sidebarProvider
    )
  );

	context.subscriptions.push(
		vscode.commands.registerCommand(
			extensionCommandId, async () => {}
		)
	);

	// Post
	context.subscriptions.push(
		vscode.commands.registerCommand(
			postCommandId, () => postErrorInfo()
		)
	);

	// StatusBarItem
	const statusBarButton: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0);
	statusBarButton.command = postCommandId;
	statusBarButton.text = 'ErrorRecorder';
	context.subscriptions.push(statusBarButton);
	statusBarButton.show();
}

export function deactivate() {}
