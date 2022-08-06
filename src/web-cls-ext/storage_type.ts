import { browserStorage } from '~lib/browser-storage-typed'

export interface WebClsExtStorage {
  syllabus?: {
    day: number
    period: number
    title: string
    name: [string, string]
    term: number
  }
}

export const webClsExtBrowserStorage = browserStorage<WebClsExtStorage>('local')
