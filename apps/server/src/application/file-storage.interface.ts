import { Readable as ReadableStream } from 'node:stream'

export interface IFileStorage {
  saveFile: (f: { id: string; fileStream: ReadableStream }) => Promise<void>
  getFile: (f: { id: string }) => Promise<ReadableStream>
}

export const FILE_STORAGE = Symbol('FILE_STORAGE')
