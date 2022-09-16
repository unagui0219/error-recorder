import * as vscode from "vscode";
import { getNonce } from "./getNonce";
type PostObj = {
	title: string;
	solutionCode: string;
	sourceCode: string;
	lang: string;
	passwordDigest: string;
};

type OnePostObj = [string, PostObj];

export class ViewEditPanel {
	/**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
	public static currentPanel: ViewEditPanel | undefined;

	public static readonly viewType = "edit";

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
	private readonly _postData: OnePostObj;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(extensionUri: vscode.Uri, postData: OnePostObj) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (ViewEditPanel.currentPanel) {
			ViewEditPanel.currentPanel._panel.reveal(column);
			ViewEditPanel.currentPanel._update();
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			ViewEditPanel.viewType,
			"ポスト一覧：Error Recorder",
			column || vscode.ViewColumn.One,
			{
				// Enable javascript in the webview
				enableScripts: true,

				// And restrict the webview to only loading content from our extension's `media` directory.
				localResourceRoots: [
					vscode.Uri.joinPath(extensionUri, "media"),
					vscode.Uri.joinPath(extensionUri, "out/compiled"),
				],
			}
		);

		ViewEditPanel.currentPanel = new ViewEditPanel(panel, extensionUri, postData);
	}

	public static kill() {
		ViewEditPanel.currentPanel?.dispose();
		ViewEditPanel.currentPanel = undefined;
	}

	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, postData: OnePostObj) {
		ViewEditPanel.currentPanel = new ViewEditPanel(panel, extensionUri, postData);
	}

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, postData: OnePostObj) {
		this._panel = panel;
		this._extensionUri = extensionUri;
		this._postData = postData;

		// Set the webview's initial html content
		this._update();

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

	}

	public dispose() {
		ViewEditPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private async _update() {
		const webview = this._panel.webview;

		this._panel.webview.html = this._getHtmlForWebview(webview);
		webview.onDidReceiveMessage(async (data) => {
			switch (data.type) {
				case "onInfo": {
					if (!data.value) {
						return;
					}
					vscode.window.showInformationMessage(data.value);
					break;
				}
				case "onError": {
					if (!data.value) {
						return;
					}
					vscode.window.showErrorMessage(data.value);
					break;
				}

			}
		});
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		// // And the uri we use to load this script in the webview
		const scriptUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "out/compiled", "ViewEdit.js")
		);

		// Uri to load styles into webview
		const stylesResetUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this._extensionUri,
			"media",
			"reset.css"
		));
		const stylesMainUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this._extensionUri,
			"media",
			"vscode.css"
		));
		const stylesCustomUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "out/compiled", "ViewShow.css")
		);

		// // Use a nonce to only allow specific scripts to be run
		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="ja">
			<head>
				<meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content=" img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${stylesResetUri}" rel="stylesheet">
                <link href="${stylesMainUri}" rel="stylesheet">
                <link href="${stylesCustomUri}" rel="stylesheet">
                <script nonce="${nonce}">
                let postOneData = ${JSON.stringify(this._postData)};
                </script>
			</head>
            <body>
			</body>
            <script src="${scriptUri}" nonce="${nonce}">
			</html>`;
	}
}