import { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react'

const ToastContext = createContext(null)

const typeStyles = {
  success: { border: 'border-l-green-500', icon: CheckCircle, iconColor: 'text-green-500' },
  error: { border: 'border-l-red-500', icon: AlertCircle, iconColor: 'text-red-500' },
  warning: { border: 'border-l-yellow-500', icon: AlertTriangle, iconColor: 'text-yellow-500' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 3500)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => {
          const style = typeStyles[toast.type] || typeStyles.success
          const Icon = style.icon
          return (
            <div
              key={toast.id}
              className={`bg-white rounded-lg shadow-lg border-l-4 ${style.border} px-4 py-3 flex items-center gap-3 min-w-[300px] animate-slide-in`}
            >
              <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0`} />
              <p className="text-sm text-gray-700 flex-1">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
