import { FoodItem } from './types'

export class Database {
  DATA_BASE_NAME = 'calorimeter-data-base'
  DB_VERSION = 2

  storeName: string

  private _sessionRecords = new Set()

  constructor(storeName: string) {
    this.storeName = storeName
  }

  get sessionRecords() {
    return this._sessionRecords
  }

  _openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DATA_BASE_NAME, this.DB_VERSION)

      request.onupgradeneeded = () => {
        const db = request.result

        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'name' })
        }
      }

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  async updateField(
    key: string,
    fieldName: keyof FoodItem,
    newValue: string | number
  ): Promise<void> {
    const db = await this._openDB()
    const transaction = db.transaction(this.storeName, 'readwrite')
    const store = transaction.objectStore(this.storeName)

    await new Promise<void>((resolve, reject) => {
      const getRequest = store.get(key)

      getRequest.onsuccess = () => {
        const data: FoodItem = getRequest.result
        if (!data) {
          console.warn(`Запись с id ${key} не найдена.`)
          resolve()
          return
        }

        ;(data as any)[fieldName] = newValue

        const updateRequest = store.put(data)
        updateRequest.onsuccess = () => resolve()
        updateRequest.onerror = () => reject(updateRequest.error)
      }

      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  async addData(data: FoodItem): Promise<void> {
    const db = await this._openDB()
    const transaction = db.transaction(this.storeName, 'readwrite')
    const store = transaction.objectStore(this.storeName)

    await new Promise<void>((resolve, reject) => {
      const req = store.put(data)
      req.onsuccess = () => {
        this._sessionRecords.add(data.name)
        resolve()
      }
      req.onerror = () => reject(req.error)
    })
  }

  async getMultipleData(keys: string[]): Promise<FoodItem[]> {
    const db = await this._openDB()
    const transaction = db.transaction(this.storeName, 'readonly')
    const store = transaction.objectStore(this.storeName)

    // Для каждого ключа создаём Promise, который слушает события get()
    const promises = keys.map((key) => {
      return new Promise<FoodItem | undefined>((resolve, reject) => {
        const req = store.get(key)
        req.onsuccess = () => {
          // req.result может быть undefined, если записи с таким ключом нет
          resolve(req.result as FoodItem | undefined)
        }
        req.onerror = () => {
          reject(req.error)
        }
      })
    })

    const results = await Promise.all(promises)

    return results.filter((item): item is FoodItem => item !== undefined)
  }

  async getAllData(): Promise<FoodItem[]> {
    const db = await this._openDB()
    const transaction = db.transaction(this.storeName, 'readonly')
    const store = transaction.objectStore(this.storeName)

    return new Promise((resolve, reject) => {
      const req = store.getAll()
      req.onsuccess = () => {
        resolve(req.result as FoodItem[])
      }
      req.onerror = () => {
        reject(req.error)
      }
    })
  }
}
