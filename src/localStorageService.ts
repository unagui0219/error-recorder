import * as vscode from 'vscode';
import { Memento } from "vscode";
import { onUnexpectedError } from './common/errors';


export type MementoObject = { [key: string]: any };

export class LocalStorageService {

  private static readonly applicationMementos = new Map<string, ScopedMemento>();
  private static readonly COMMON_PREFIX = 'memento/';
	private readonly id: string;

  constructor(id: string, private storageService: IStorageService) {
		this.id = LocalStorageService.COMMON_PREFIX + id;
	}

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

	constructor(private id: string, private scope: StorageScope, private target: StorageTarget, private storageService: IStorageService) {
		this.mementoObj = this.load();
	}

	getMemento(): MementoObject {
		return this.mementoObj;
	}

	private load(): MementoObject {
		const memento = this.storageService.get(this.id, this.scope);
		if (memento) {
			try {
				return JSON.parse(memento);
			} catch (error) {
				// Seeing reports from users unable to open editors
				// from memento parsing exceptions. Log the contents
				// to diagnose further
				// https://github.com/microsoft/vscode/issues/102251
				onUnexpectedError(`[memento]: failed to parse contents: ${error} (id: ${this.id}, scope: ${this.scope}, contents: ${memento})`);
			}
		}

		return {};
	}

	save(): void {
		if (!isEmptyObject(this.mementoObj)) {
			this.storageService.store(this.id, JSON.stringify(this.mementoObj), this.scope, this.target);
		} else {
			this.storageService.remove(this.id, this.scope);
		};
	};
};

export function isObject(obj: unknown): obj is Object {
	// The method can't do a type cast since there are type (like strings) which
	// are subclasses of any put not positvely matched by the function. Hence type
	// narrowing results in wrong results.
	return typeof obj === 'object'
		&& obj !== null
		&& !Array.isArray(obj)
		&& !(obj instanceof RegExp)
		&& !(obj instanceof Date);
}

const hasOwnProperty = Object.prototype.hasOwnProperty;

export function isEmptyObject(obj: unknown): obj is object {
	if (!isObject(obj)) {
		return false;
	}

	for (const key in obj) {
		if (hasOwnProperty.call(obj, key)) {
			return false;
		}
	}

	return true;
};
