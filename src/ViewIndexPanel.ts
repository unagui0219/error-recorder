import * as vscode from "vscode";
import { getNonce } from "./getNonce";
import { ViewShowPanel } from "./ViewShowPanel";
import { ViewEditPanel } from "./ViewEditPanel";
type PostObj = {
    title: string;
    solutionCode: string;
    sourceCode: string;
    lang: string;
};

export class ViewIndexPanel {
    /**
     * Track the currently panel. Only allow a single panel to exist at a time.
     */
    public static currentPanel: ViewIndexPanel | undefined;

    public static readonly viewType = "index";


    private readonly _panel: vscode.WebviewPanel;
    private readonly _context: vscode.ExtensionContext;
    private readonly _extensionUri: vscode.Uri;
    private readonly _postData: PostObj;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(context: vscode.ExtensionContext, extensionUri: vscode.Uri, postData: PostObj) {
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
            "投稿一覧：Error Recorder",
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

        ViewIndexPanel.currentPanel = new ViewIndexPanel(panel, context, extensionUri, postData);
    }

    public static kill() {
        ViewIndexPanel.currentPanel?.dispose();
        ViewIndexPanel.currentPanel = undefined;
    }

    public static revive(panel: vscode.WebviewPanel, context: vscode.ExtensionContext, extensionUri: vscode.Uri, postData: PostObj) {
        ViewIndexPanel.currentPanel = new ViewIndexPanel(panel, context, extensionUri, postData);
    }

    private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext, extensionUri: vscode.Uri, postData: PostObj) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._postData = postData;
        this._context = context;

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
                case "showPost": {
                    const oneData = [data.value, this._context.globalState.get(data.value)];
                    console.log(oneData);
                    ViewShowPanel.createOrShow(this._extensionUri, oneData, this._context);
                    break;
                }
                case "editPost": {
                    const oneData = [data.value, this._context.globalState.get(data.value)];
                    ViewEditPanel.createOrShow(this._extensionUri, oneData);
                    break;
                }
                case "removePost": {
                    const y = await vscode.window.showInformationMessage(
                        "本当にエラー投稿を削除しますか？",
                        "はい",
                        "いいえ"
                    );
                    if (y === "はい") {
                        const oneData = await this._context.globalState.update(data.value, undefined);
                        ViewIndexPanel.kill();
                        const postData = this._context.globalState._value;
                        ViewIndexPanel.createOrShow(this._context, this._extensionUri, postData);
                        // ViewIndexPanel.revive(this._panel, this._context, this._extensionUri, postData);
                        // this._panel.webview.html = this._getHtmlForWebview(webview);
                    }
                    break;
                }
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
        const stylesCustomUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "out/compiled", "ViewIndex.css")
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
                const tsvscode = acquireVsCodeApi();
                let postData = ${JSON.stringify(this._postData)};
                </script>
			</head>
            <body>
			</body>
            <script src="${scriptUri}" nonce="${nonce}">
			</html>`;
    }
}