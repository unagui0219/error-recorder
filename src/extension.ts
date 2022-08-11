import * as vscode from 'vscode';

const extensionCommand: string = 'error-recorder.errorRecorder';

export function activate(context: vscode.ExtensionContext) {
	let disposable: vscode.Disposable = vscode.commands.registerCommand(extensionCommand, async () => {

		const errorCode: string | undefined = await vscode.window.showInputBox({
			title: 'Please enter error code.'
		});

		if (errorCode !== undefined) {
			vscode.window.showInformationMessage(`Hello World from error-recorder!`);
		};
	});

	context.subscriptions.push(disposable);

	// StatusBarItem
	const statusBarButton: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0);
	statusBarButton.command = extensionCommand;
	statusBarButton.text = 'ErrorRecorder';
	context.subscriptions.push(statusBarButton);
	statusBarButton.show();
}

export function deactivate() {}
