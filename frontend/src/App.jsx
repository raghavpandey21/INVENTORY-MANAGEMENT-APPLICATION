import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Customers from './pages/Customers'
import Orders from './pages/Orders'

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6 ml-64">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
