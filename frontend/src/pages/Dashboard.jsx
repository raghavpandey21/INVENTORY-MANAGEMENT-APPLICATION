import { useState, useEffect } from 'react'
import { Package, Users, ShoppingCart, IndianRupee, AlertTriangle } from 'lucide-react'
import api from '../api/axios'
import StatCard from '../components/StatCard'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'

function Dashboard() {
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, custRes, ordRes] = await Promise.all([
          api.get('/products'),
          api.get('/customers'),
          api.get('/orders'),
        ])
        setProducts(prodRes.data)
        setCustomers(custRes.data)
        setOrders(ordRes.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <Spinner fullPage />
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>

  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0)
  const lowStockProducts = products.filter((p) => p.quantity < 10)
  const recentOrders = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Overview of your business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Products" value={products.length} icon={Package} bgColor="bg-blue-500" />
        <StatCard title="Total Customers" value={customers.length} icon={Users} bgColor="bg-green-500" />
        <StatCard title="Total Orders" value={orders.length} icon={ShoppingCart} bgColor="bg-purple-500" />
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toFixed(2)}`} icon={IndianRupee} bgColor="bg-orange-500" />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Alerts</h2>
        {lowStockProducts.length > 0 ? (
          <div>
            <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>{lowStockProducts.length} product(s) have low stock (below 10 units)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="pb-3 font-medium">Product Name</th>
                    <th className="pb-3 font-medium">SKU</th>
                    <th className="pb-3 font-medium">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100">
                      <td className="py-3 text-gray-800">{p.name}</td>
                      <td className="py-3 text-gray-600">{p.sku}</td>
                      <td className="py-3">
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                          {p.quantity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-green-600 text-sm">All products are well stocked.</p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-gray-100">
                    <td className="py-3 text-gray-800">#{o.id}</td>
                    <td className="py-3 text-gray-600">{o.customer_name}</td>
                    <td className="py-3 text-gray-800">₹{o.total_amount.toFixed(2)}</td>
                    <td className="py-3 text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No orders yet" />
        )}
      </div>
    </div>
  )
}

export default Dashboard
