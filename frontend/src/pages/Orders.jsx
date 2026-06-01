import { useState, useEffect } from 'react'
import { Plus, Eye, Trash2, X } from 'lucide-react'
import api from '../api/axios'
import { useToast } from '../components/Toast'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'

function Orders() {
  const { showToast } = useToast()
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [orderForm, setOrderForm] = useState({ customerId: '', items: [] })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState('')
  const [selectedQty, setSelectedQty] = useState('')

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders')
      setOrders(res.data)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ordRes, custRes, prodRes] = await Promise.all([
          api.get('/orders'),
          api.get('/customers'),
          api.get('/products'),
        ])
        setOrders(ordRes.data)
        setCustomers(custRes.data)
        setProducts(prodRes.data)
      } catch (err) {
        showToast(err.message, 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const openCreate = () => {
    setOrderForm({ customerId: '', items: [] })
    setFormErrors({})
    setSelectedProduct('')
    setSelectedQty('')
    setShowCreateModal(true)
  }

  const addItem = () => {
    if (!selectedProduct) {
      setFormErrors({ ...formErrors, item: 'Please select a product' })
      return
    }
    if (!selectedQty || parseInt(selectedQty) <= 0) {
      setFormErrors({ ...formErrors, item: 'Please enter a valid quantity' })
      return
    }
    const product = products.find((p) => p.id === parseInt(selectedProduct))
    if (!product) return
    if (parseInt(selectedQty) > product.quantity) {
      setFormErrors({ ...formErrors, item: `Only ${product.quantity} available in stock` })
      return
    }
    const existing = orderForm.items.find((i) => i.productId === product.id)
    if (existing) {
      const totalQty = existing.quantity + parseInt(selectedQty)
      if (totalQty > product.quantity) {
        setFormErrors({ ...formErrors, item: `Total quantity exceeds available stock (${product.quantity})` })
        return
      }
      setOrderForm({
        ...orderForm,
        items: orderForm.items.map((i) =>
          i.productId === product.id ? { ...i, quantity: totalQty } : i
        ),
      })
    } else {
      setOrderForm({
        ...orderForm,
        items: [
          ...orderForm.items,
          {
            productId: product.id,
            productName: product.name,
            quantity: parseInt(selectedQty),
            unitPrice: product.price,
          },
        ],
      })
    }
    setSelectedProduct('')
    setSelectedQty('')
    setFormErrors({ ...formErrors, item: undefined })
  }

  const removeItem = (productId) => {
    setOrderForm({ ...orderForm, items: orderForm.items.filter((i) => i.productId !== productId) })
  }

  const handleCreateOrder = async () => {
    const errors = {}
    if (!orderForm.customerId) errors.customerId = 'Please select a customer'
    if (orderForm.items.length === 0) errors.items = 'Please add at least one item'
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      await api.post('/orders', {
        customer_id: parseInt(orderForm.customerId),
        items: orderForm.items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
      })
      showToast('Order created successfully')
      setShowCreateModal(false)
      fetchOrders()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const viewDetail = (order) => {
    setSelectedOrder(order)
    setShowDetailModal(true)
  }

  const confirmDelete = (id) => {
    setDeletingId(id)
    setShowConfirmDelete(true)
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/orders/${deletingId}`)
      showToast('Order cancelled and stock restored')
      fetchOrders()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setShowConfirmDelete(false)
      setDeletingId(null)
    }
  }

  if (loading) return <Spinner fullPage />

  const total = orderForm.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-500">Manage customer orders</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Create Order
        </button>
      </div>

      {orders.length === 0 ? (
        <EmptyState message="No orders found" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500">
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Items</th>
                  <th className="px-6 py-3 font-medium">Total Amount</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-800 font-medium">#{o.id}</td>
                    <td className="px-6 py-4 text-gray-600">{o.customer_name}</td>
                    <td className="px-6 py-4 text-gray-600">{o.items.length}</td>
                    <td className="px-6 py-4 text-gray-800">₹{o.total_amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewDetail(o)}
                          className="text-teal-600 hover:text-teal-800 p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(o.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Cancel Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Order" size="lg">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>
            <select
              value={orderForm.customerId}
              onChange={(e) => {
                setOrderForm({ ...orderForm, customerId: e.target.value })
                setFormErrors({ ...formErrors, customerId: undefined })
              }}
              className={`w-full px-3 py-2 border rounded-lg text-sm ${formErrors.customerId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">-- Select a customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
            {formErrors.customerId && <p className="text-red-500 text-xs mt-1">{formErrors.customerId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Add Products</label>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">-- Select product --</option>
                  {products
                    .filter((p) => p.quantity > 0)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Available: {p.quantity})
                      </option>
                    ))}
                </select>
              </div>
              <div className="w-24">
                <input
                  type="number"
                  min="1"
                  value={selectedQty}
                  onChange={(e) => setSelectedQty(e.target.value)}
                  placeholder="Qty"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <button
                onClick={addItem}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm whitespace-nowrap"
              >
                Add Item
              </button>
            </div>
            {formErrors.item && <p className="text-red-500 text-xs mt-1">{formErrors.item}</p>}
          </div>

          {orderForm.items.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Order Items</h4>
              <div className="space-y-2">
                {orderForm.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.productName}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × ₹{item.unitPrice.toFixed(2)} = ₹{(item.quantity * item.unitPrice).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-right mt-3 font-semibold text-gray-800">
                Order Total: ₹{total.toFixed(2)}
              </div>
            </div>
          )}

          {formErrors.items && <p className="text-red-500 text-xs">{formErrors.items}</p>}

          <button
            onClick={handleCreateOrder}
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
          >
            {submitting ? 'Creating Order...' : 'Create Order'}
          </button>
        </div>
      </Modal>

      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Order #${selectedOrder?.id}`} size="lg">
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-medium text-gray-800">{selectedOrder.customer_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Order Date</p>
                <p className="font-medium text-gray-800">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="pb-2 font-medium">Product</th>
                  <th className="pb-2 font-medium">Qty</th>
                  <th className="pb-2 font-medium">Unit Price</th>
                  <th className="pb-2 font-medium text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2 text-gray-800">{item.product_name}</td>
                    <td className="py-2 text-gray-600">{item.quantity}</td>
                    <td className="py-2 text-gray-600">₹{item.unit_price.toFixed(2)}</td>
                    <td className="py-2 text-gray-800 text-right">₹{item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right text-lg font-bold text-gray-800">
              Grand Total: ₹{selectedOrder.total_amount.toFixed(2)}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        title="Cancel Order"
        message="Cancel this order? Stock will be automatically restored."
        onConfirm={handleDelete}
        confirmText="Cancel Order"
        onCancel={() => { setShowConfirmDelete(false); setDeletingId(null) }}
      />
    </div>
  )
}

export default Orders
