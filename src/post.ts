import axios from 'axios';
import * as vscode from 'vscode';

export type PostData = {
	errorTitle: string;
	solutionCode: string;
	sourceCode: string;
	lang: string;
};

export async function postErrorInfo() {
  // サーバーの送信先URL
  const postUrl: string = 'https://api/v1/posts';

  // send data to rails server ← <memo: onda>Quick Pickで入力した値を格納したい
  const data: PostData = {
    errorTitle: 'Error',
    solutionCode: 'Solution Code',
    sourceCode: 'Source Code',
    lang: 'Lang'
  };

  // convert postData to json
  function errorCodeToJson(obj: PostData) {
    return JSON.stringify(obj);
  };

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

  vscode.window.showInformationMessage(errorCodeToJson(data));
};
