import { useState } from 'react'

const useLocalStorage = <T>(key: string): [T | '', (value: T) => void, () => void] => {
  const [storedValue, setStoredValue] = useState<T | ''>(() => {
    try {
      const value = window.localStorage.getItem(key)
      if (value) return JSON.parse(value) as T
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error)
    }
    return ''
  })

  const setNewValue = (value: T) => {
    window.localStorage.setItem(key, JSON.stringify(value))
    setStoredValue(value)
  }

  const removeStoredValue = () => {
    window.localStorage.removeItem(key)
    setStoredValue('')
  }

  return [storedValue, setNewValue, removeStoredValue]
}

export default useLocalStorage
