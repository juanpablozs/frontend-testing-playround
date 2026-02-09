const CHECKOUT_KEY = 'checkout-draft'

export interface StorageData {
  [key: string]: unknown
}

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key)
  },

  clear(): void {
    localStorage.clear()
  },
}

export const checkoutStorage = {
  get: () => storage.get(CHECKOUT_KEY),
  set: (data: unknown) => storage.set(CHECKOUT_KEY, data),
  clear: () => storage.remove(CHECKOUT_KEY),
}
