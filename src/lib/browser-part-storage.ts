import { entries, get, set, toPath } from 'lodash-es'
import type { AccessByCommaPath, PlainAnyObject, AlsoAsyncFunction } from 'my-useful-type'
import { pushDefaultArray } from 'next-ts-utility'
import { browser } from 'webextension-polyfill-ts'

type PathListener<S extends PlainAnyObject, P extends string> = (value: AccessByCommaPath<S, P>) => unknown

type StorageChangeObject<S extends PlainAnyObject> = {
  [P in keyof S]?: {
    newValue: S[P]
    oldValue: S[P]
  }
}

type StorageChangeListener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => void

type ListenersList<S extends PlainAnyObject, K extends string> = {
  [P in K]?: PathListener<S, P>[]
}

interface OnOpt {
  initial: boolean
}

const splitChangeObject = <S extends PlainAnyObject>(changeObj: StorageChangeObject<S>) => {
  let oldVal: Partial<S> = {}
  let newVal: Partial<S> = {}
  for (let [topKey, val] of entries(changeObj)) {
    if (!val) continue
    const { newValue, oldValue } = val
    oldVal[topKey as keyof S] = oldValue
    newVal[topKey as keyof S] = newValue
  }
  return [newVal, oldVal] as const
}

export type StorageSetter<S extends PlainAnyObject> = AlsoAsyncFunction<(newStorage: S) => void>
export type StorageGetter<S extends PlainAnyObject> = AlsoAsyncFunction<() => S | undefined>

export class BrowserPartStorage<S extends PlainAnyObject, K extends string = string> {
  getter: StorageGetter<S> = () => this.storage
  setter: StorageSetter<S> = newStorage => {
    this.storage = newStorage
  }
  constructor(storage?: S) {
    storage && this.setter(storage)
    browser.storage.local.get().then(s => this.setter(s as S))
  }
  public storage?: S
  private mainListener?: StorageChangeListener
  private listenersList: ListenersList<S, K> = {}
  async get<P extends K>(path: P) {
    // console.log(this.getter)
    const storage = await this.getter()
    if (storage === undefined) return
    return get(storage, path) as AccessByCommaPath<S, P>
  }
  async set<P extends K>(path: P, value: AccessByCommaPath<S, P>) {
    const storage = await this.getter()
    if (storage === undefined) return
    await this.setter(set(storage, path, value))
    await browser.storage.local.set(storage)
  }
  addListener<P extends K>(path: P, listener: PathListener<S, P>) {
    const { listenersList } = this
    listenersList[path] = pushDefaultArray(listenersList[path], listener)
    return listener
  }
  removeListener<P extends K>(listenerToRemove: PathListener<S, P>) {
    const { listenersList } = this
    for (const [path, listeners] of entries(listenersList) as [K, PathListener<S, K>[]][]) {
      listenersList[path] = listeners?.filter(listener => !Object.is(listener, listenerToRemove))
    }
  }
  async on({ initial }: OnOpt) {
    const mainListener: StorageChangeListener = async changedObj => {
      const storage = await this.getter()
      if (storage === undefined) return
      const [newVal] = splitChangeObject<S>(changedObj as StorageChangeObject<S>)
      for (const [path, listeners] of entries(this.listenersList) as [K, PathListener<S, K>[]][]) {
        const pathArray = toPath(path)
        const firstPath = pathArray[0]
        if (!changedObj.hasOwnProperty(firstPath) || !newVal[firstPath]) continue
        const dist = get(newVal, pathArray)
        const cur = get(storage, pathArray)
        if (dist === cur) continue
        set(storage, pathArray, dist)
        listeners?.forEach(listener => listener(dist))
      }
      //TODO ここの型解決
      entries(newVal).forEach(([topKey, updateValue]) => (storage[topKey as keyof S] = updateValue as any))
    }
    if (initial) {
      for (const [path, listeners] of entries(this.listenersList) as [K, PathListener<S, K>[]][]) {
        const initialValue = await this.get(path)
        if (initialValue === undefined) return
        listeners?.forEach(listener => listener(initialValue))
      }
    }
    browser.storage.onChanged.addListener(mainListener)
    this.mainListener = mainListener
  }
  off() {
    const { mainListener } = this
    mainListener && browser.storage.onChanged.removeListener(mainListener)
  }
}
