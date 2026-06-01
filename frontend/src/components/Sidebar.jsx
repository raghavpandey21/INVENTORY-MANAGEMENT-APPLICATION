import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Users, ShoppingCart, Box } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
]

function Sidebar() {
  return (
    <aside className="w-64 bg-blue-900 text-white flex flex-col h-screen fixed left-0 top-0">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-blue-800">
        <Box className="w-8 h-8 text-blue-300" />
        <span className="text-xl font-bold">InventoryPro</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
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
  )
}

export default Sidebar
