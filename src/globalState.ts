import * as vscode from 'vscode';
import { onUnexpectedError } from './common/errors';

type MementoObject = {
  [key: string]: PostMementObj;
};

type PostMementObj = {
  title: string;
  solutionCode: string;
  sourceCode: string;
  lang: string;
};

export async function saveStorage(context: vscode.ExtensionContext) {

};

// 全体的なmementoの定義 saveやread,writeを行うclass
export class Mement {

  private static readonly applicationMementos = new Map<string, StateManager>();
  private static readonly cacheName: string = 'error-recorder/post';

  private readonly id: string;

  constructor(id: number, private storageService: vscode.ExtensionContext) {
    this.id = `${Mement.cacheName}/${id}`;  //(例)error-recorder/post/1
    this.storageService = storageService;
  };

  // StateManagerのreadを呼び出し、一致するidの値を読み込む
  getMemento() {
    let applicationMemento = Mement.applicationMementos.get(this.id);
    if (!applicationMemento) {
      applicationMemento = new StateManager(this.id, this.storageService);
      Mement.applicationMementos.set(this.id, applicationMemento);
    };

    return applicationMemento.getMemento();
  };

  // StateManagerのwriteを呼び出し、(引数)を保存させる
  saveMemento(obj: PostMementObj): void {
    Mement.applicationMementos.get(this.id)?.write(obj);
  };

  keyRemove() {
    Mement.applicationMementos.get(this.id)?.remove(this.id);
  };
};

// read write をするclass
class StateManager {

  private readonly storageService: vscode.ExtensionContext;
  private readonly mementoObj: MementoObject;

  constructor(private id: string, context: vscode.ExtensionContext) {
    this.id = id;
    this.storageService = context;
    this.mementoObj = this.read();
  };

  // 保存しているデータを返す
  getMemento(): MementoObject {
    return this.mementoObj;
  };

  // 「読み込み」: idに一致している値をmementoへ格納
  read() {
    const memento = this.storageService.globalState.get(this.id);
    if (memento) {
      try {
        if (typeof memento === 'string') {
          return JSON.parse(memento);
        };
      } catch (error) {
        onUnexpectedError(`[memento]: failed to parse contents: ${error} (id: ${this.id}`);
      };
    };

    return memento;
  };

  // 「保存」: idと一緒に一致する値も一緒に格納する
  async write(obj: PostMementObj): Promise<void> {
    await this.storageService.globalState.update(this.id, JSON.stringify(obj));
	};

  remove(key: string) {
    this.storageService.globalState.update(key, undefined);
  };
};
