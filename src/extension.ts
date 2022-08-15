import axios from 'axios';
import * as vscode from 'vscode';

const extensionCommand: string = 'error-recorder.errorRecorder';

type GetData = {
	title: string;
	description: string;
	link: string;
};

type PostData = {
	errorTitle: string;
	solutionCode: string;
	sourceCode: string;
	lang: string;
};

export function activate(context: vscode.ExtensionContext) {
	let postErrorCode: vscode.Disposable = vscode.commands.registerCommand(extensionCommand, async () => {

		// 貼り付けてもらったエラーをerrorCodeに格納する
		// const errorCode: string | undefined = await vscode.window.showInputBox({
		// 	title: 'Please enter error code.'
		// });

		// convert errorcode to json
		// const errorCodeToJson = (errorCode: string) => {
		// 	try {
		// 		return JSON.parse(errorCode);
		// 	} catch (e) {
		// 		console.log(e);
		// 	};
		// };

		// send data to rails server ← <memo: onda>Quick Pickで入力した値を格納したい
		const data: PostData = {
			errorTitle: 'Error',
      solutionCode: 'Solution Code',
			sourceCode: 'Source Code',
			lang: 'Lang'
		};

		// 解決した記事のサイトURL
		const getUrl: string = 'https://api/v1/posts';

		// サーバーの送信先URL
		const postUrl: string = 'https://api/v1/posts';

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

		// リスト(Quick Pick)？で入力したエラーデータをサーバーへ送信
		await axios.post(
			postUrl,
			data
		)
		.then(res => {
			console.log(res);
		})
		.catch(err => {
			console.log("err:", err);
		});

		// if (errorCode !== undefined) {
		// 	vscode.window.showInformationMessage(`エラーコードは${errorCode}です!`);
		// };
	});

	context.subscriptions.push(postErrorCode);

	// StatusBarItem
	const statusBarButton: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0);
	statusBarButton.command = extensionCommand;
	statusBarButton.text = 'ErrorRecorder';
	context.subscriptions.push(statusBarButton);
	statusBarButton.show();
}

export function deactivate() {}
