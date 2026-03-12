import { useState, useCallback } from 'react'

let _id = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((type, title, sub = '') => {
    const id = ++_id
    setToasts(p => [...p, { id, type, title, sub, removing: false }])
    setTimeout(() => {
      setToasts(p => p.map(t => t.id === id ? { ...t, removing: true } : t))
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 300)
    }, 4000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(p => p.map(t => t.id === id ? { ...t, removing: true } : t))
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 300)
  }, [])

  return { toasts, showToast, removeToast }
}
