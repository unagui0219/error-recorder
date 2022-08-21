import axios from 'axios';
import * as vscode from 'vscode';
import { SidebarProvider } from "./SidebarProvider";
import { PostData, postErrorInfo } from './post';

// commands
export const extensionCommand: string = 'error-recorder.errorRecorder';
export const postCommand: string = 'error-recorder.postError';

export function activate(context: vscode.ExtensionContext) {

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
			extensionCommand, async () => {}
		)
	);

	// Post
	context.subscriptions.push(
		vscode.commands.registerCommand(
			postCommand, () => postErrorInfo()
		)
	);

	// StatusBarItem
	const statusBarButton: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0);
	statusBarButton.command = postCommand;
	statusBarButton.text = 'ErrorRecorder';
	context.subscriptions.push(statusBarButton);
	statusBarButton.show();
}

export function deactivate() {}
