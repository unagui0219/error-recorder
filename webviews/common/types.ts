export interface PostData {
  errorTitle: string;
  solutionCode: string;
  sourceCode: string;
  lang: string;
};

export interface LocalDataObj extends PostData {
  password: any;
  id: number;
};
