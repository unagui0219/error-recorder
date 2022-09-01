import * as vscode from 'vscode';
import { Memento } from "vscode";
import { isEmptyObject } from './common/objectTypes';
import { onUnexpectedError } from './common/errors';

export type MementoObject = { [key: string]: any };

export class LocalStorageService {

  private static readonly commonPrefix = 'memento/';
	private readonly id: string;

  constructor(id: string, private context: vscode.ExtensionContext) {
		this.id = LocalStorageService.commonPrefix + id;
	};

  // StorageScope.APPLICATION: {
  //   let applicationMemento = Memento.applicationMementos.get(this.id);
  //   if (!applicationMemento) {
  //     applicationMemento = new ScopedMemento(this.id, scope, target, this.storageService);
  //     Memento.applicationMementos.set(this.id, applicationMemento);
  //   }

  //   return applicationMemento.getMemento();
  // }

  // constructor(private storage: Memento) { };

  // public getValue<T>(key: string, defaultValue: T): T{
  //   return this.storage.get<T>(key, defaultValue);
  // };

  // public setValue<T>(key: string, value: T) {
  //   this.storage.update(key, value);
  // };
};

let globalState: vscode.Memento;

export async function saveStorage(context: vscode.ExtensionContext) {

  const state = stateManager(context);
  const EXTENSION_NAME: string = 'error-recorder';

  const defaultData = { v1: {}, beta: {} };
  const cacheName = `${EXTENSION_NAME}_cache`;
  const cache = context.globalState.get(cacheName, defaultData);
  console.log(cache);

	// Add API response to the right API version of the cache
	// cache[version][path] = apiData;
	// await context.globalState.update(cacheName, cache);


  
  const item = state.read();

  await state.write({ item: 'foo bar' });

  // const store = context.globalState;

  // store.update('user_name', 'Jhon').then(() =>{
  //   console.log(store.get('user_name'));
  // });
};

function stateManager(context: vscode.ExtensionContext) {

  const globalState = context.globalState;
  // const mementoObj: MementoObject;

  const storageDefaultData: MementoObject = {
    id: {},
    title: {}
  };

  return {
    read,
    write
  };

  function read() {
    return {
      id: globalState.get('item', storageDefaultData)
    };
  };

  async function write(newState: any) {
    await globalState.update('item', newState.lastPaletteTitleApplied);
  };
};


class ScopedMemento {

	private readonly mementoObj: MementoObject;
  // private readonly globalState = context.globalState;

	constructor(private id: string, private data: string, private context: vscode.ExtensionContext) {
		this.mementoObj = this.load();
	}

	getMemento(): MementoObject {
		return this.mementoObj;
	};

	private load(): MementoObject {
		const memento: string | undefined = this.context.globalState.get(this.id);
		if (memento) {
			try {
				return JSON.parse(memento);
			} catch (error) {
				// Seeing reports from users unable to open editors
				// from memento parsing exceptions. Log the contents
				// to diagnose further
				// https://github.com/microsoft/vscode/issues/102251
				onUnexpectedError(`[memento]: failed to parse contents: ${error} (id: ${this.id}, contents: ${memento})`);
			};
		};

		return {};
	};

	// save(): void {
	// 	if (!isEmptyObject(this.mementoObj)) {
	// 		this.data.store(this.id, JSON.stringify(this.mementoObj));
	// 	} else {
	// 		this.data.remove(this.id);
	// 	};
	// };
};
