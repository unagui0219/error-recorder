import * as vscode from "vscode";
import { getNonce } from "./getNonce";

export class ViewIndexPanel {
    /**
     * Track the currently panel. Only allow a single panel to exist at a time.
     */
    public static currentPanel: ViewIndexPanel | undefined;

    public static readonly viewType = "index";

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it.
        if (ViewIndexPanel.currentPanel) {
            ViewIndexPanel.currentPanel._panel.reveal(column);
            ViewIndexPanel.currentPanel._update();
            return;
        }

        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(
            ViewIndexPanel.viewType,
            "Error Recorder Index",
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

        ViewIndexPanel.currentPanel = new ViewIndexPanel(panel, extensionUri);
    }

    public static kill() {
        ViewIndexPanel.currentPanel?.dispose();
        ViewIndexPanel.currentPanel = undefined;
    }

    public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        ViewIndexPanel.currentPanel = new ViewIndexPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        // Set the webview's initial html content
        this._update();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    }

    public dispose() {
        ViewIndexPanel.currentPanel = undefined;

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
            vscode.Uri.joinPath(this._extensionUri, "out/compiled", "ViewIndex.js")
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

        // // Use a nonce to only allow specific scripts to be run
        const nonce = getNonce();

        return `<!DOCTYPE html>
			<html lang="ja">
			<head>
				<meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content=" img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource
            }; script-src 'nonce-${nonce}';">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${stylesResetUri}" rel="stylesheet">
                <link href="${stylesMainUri}" rel="stylesheet">
                <script nonce="${nonce}">
                </script>
			</head>
            <body>
			</body>
            <script src="${scriptUri}" nonce="${nonce}">
			</html>`;
    }
}