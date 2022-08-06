import browser from 'webextension-polyfill'
import { PlainAnyObject } from 'my-useful-type'
import { DeepPartial } from 'ts-essentials'

type StorageType = 'local' | 'sync'

export const browserStorage = <S extends PlainAnyObject>(storageType: StorageType) => {
  return {
    set: (setState: DeepPartial<S>) => browser.storage[storageType].set(setState),
    get: (stateKeys: (keyof S)[] = []) => browser.storage[storageType].get(stateKeys),
    remove: (stateKeys: Extract<keyof S, string>[] = []) => browser.storage[storageType].remove(stateKeys),
  }
}
