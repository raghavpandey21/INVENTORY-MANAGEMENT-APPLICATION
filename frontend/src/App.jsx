import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { ToastProvider } from './components/Toast'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Customers from './pages/Customers'
import Orders from './pages/Orders'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar Drawer */}
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          
          {/* Content Wrapper */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Mobile Header Bar */}
            <header className="lg:hidden bg-blue-900 text-white h-16 flex items-center justify-between px-4 z-20 shrink-0 shadow-sm">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-white focus:outline-none hover:bg-blue-800 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <span className="text-lg font-bold">InventoryPro</span>
              <div className="w-6"></div> {/* Spacer for symmetry */}
            </header>

            {/* Main Area */}
            <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 lg:ml-64">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/orders" element={<Orders />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App

