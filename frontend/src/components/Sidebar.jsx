import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Users, ShoppingCart, Box, X } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
]

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`w-64 bg-blue-900 text-white flex flex-col h-screen fixed left-0 top-0 z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-blue-800">
          <div className="flex items-center gap-2">
            <Box className="w-8 h-8 text-blue-300" />
            <span className="text-xl font-bold">InventoryPro</span>
          </div>
          
          {/* Close button - mobile only */}
          <button 
            onClick={onClose}
            className="lg:hidden p-1 text-blue-300 hover:text-white rounded-lg hover:bg-blue-800 focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose} // Auto-close sidebar on mobile after navigating
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-blue-800 text-blue-400 text-sm">
          v1.0.0
        </div>
      </aside>
    </>
  )
}

export default Sidebar

