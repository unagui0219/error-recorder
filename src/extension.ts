import axios from 'axios';
import * as vscode from 'vscode';
import { PostData, postErrorInfo } from './post';

const extensionCommand: string = 'error-recorder.errorRecorder';

type GetData = {
	title: string;
	description: string;
	link: string;
};

export function activate(context: vscode.ExtensionContext) {
	// let postCode: vscode.Disposable = vscode.commands.registerCommand(extensionCommand, postErrorInfo());
	let postCode: vscode.Disposable = vscode.commands.registerCommand(extensionCommand, async () => {

		// 貼り付けてもらったエラーをerrorCodeに格納する
		// const errorCode: string | undefined = await vscode.window.showInputBox({
		// 	title: 'Please enter error code.'
		// });


		// 解決した記事のサイトURL
		const getUrl: string = 'https://api/v1/posts';

		// axios getでサーバー側の「エラー解決したサイト」を取得
		const errorSolutionSite = await axios.get(getUrl);
		const solutionArticles = errorSolutionSite.data.map((solutionArticle: GetData) => {
			return {
				label: solutionArticle.title,
				detail: solutionArticle.description,
				link: solutionArticle.link,
			};
		});

		// フィルタリングして一致するサイトを探す
		const solutionArticle = await vscode.window.showQuickPick(solutionArticles, {
			matchOnDetail: true,
			placeHolder: 'Please select a website for references.'
		});
		
		if (solutionArticle === null) {return;};

		// 検索したサイトでlink先に飛んで、ブラウザを開く
		vscode.env.openExternal(solutionArticles.link);

	});

	context.subscriptions.push(postCode);

	// StatusBarItem
	const statusBarButton: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0);
	statusBarButton.command = extensionCommand;
	statusBarButton.text = 'ErrorRecorder';
	context.subscriptions.push(statusBarButton);
	statusBarButton.show();
}

export function deactivate() {}
