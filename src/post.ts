import axios from 'axios';

type PostDataObject = {
	errorTitle: string;
	solutionCode: string;
	sourceCode: string;
	lang: string;
};

export const dataObj: PostDataObject = {
  errorTitle: 'Error',
  solutionCode: 'Solution Code',
  sourceCode: 'Source Code',
  lang: 'Lang'
};

export class PostErrorInfo {

  private readonly postObj: string;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  constructor(private postUrl: string, private Obj: PostDataObject) {
    this.postUrl = postUrl;
    this.postObj = this.errorCodeToJson(Obj);
    this.postServer();
  };

  // convert postData to json
  errorCodeToJson(obj: PostDataObject): string {
    return JSON.stringify(obj);
  };

  async postServer() {
    await axios.post(this.postUrl, this.postObj)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log("err:", err);
      });
  };
};
