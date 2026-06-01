import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import api from '../api/axios'
import { useToast } from '../components/Toast'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'

const initialForm = { name: '', sku: '', price: '', quantity: '' }

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.sku.trim()) errors.sku = 'SKU is required'
  if (!form.price || parseFloat(form.price) <= 0) errors.price = 'Price must be greater than 0'
  if (form.quantity === '' || parseInt(form.quantity) < 0 || !Number.isInteger(Number(form.quantity)))
    errors.quantity = 'Quantity must be a non-negative integer'
  return errors
}

function Products() {
  const { showToast } = useToast()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [formData, setFormData] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products')
      setProducts(res.data)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setFormErrors({ ...formErrors, [e.target.name]: undefined })
  }

  const openAdd = () => {
    setFormData(initialForm)
    setFormErrors({})
    setShowAddModal(true)
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      sku: product.sku,
      price: String(product.price),
      quantity: String(product.quantity),
    })
    setFormErrors({})
    setShowEditModal(true)
  }

  const handleSubmit = async (isEdit = false) => {
    const errors = validate(formData)
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      }
      if (isEdit) {
        await api.put(`/products/${editingProduct.id}`, payload)
        showToast('Product updated successfully')
        setShowEditModal(false)
      } else {
        await api.post('/products', payload)
        showToast('Product created successfully')
        setShowAddModal(false)
      }
      setFormData(initialForm)
      fetchProducts()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDelete = (id) => {
    setDeletingId(id)
    setShowConfirmDelete(true)
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/products/${deletingId}`)
      showToast('Product deleted successfully')
      fetchProducts()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setShowConfirmDelete(false)
      setDeletingId(null)
    }
  }

  const renderForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg text-sm ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
        />
        {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
        <input
          type="text"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg text-sm ${formErrors.sku ? 'border-red-500' : 'border-gray-300'}`}
        />
        {formErrors.sku && <p className="text-red-500 text-xs mt-1">{formErrors.sku}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
        <input
          type="number"
          name="price"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg text-sm ${formErrors.price ? 'border-red-500' : 'border-gray-300'}`}
        />
        {formErrors.price && <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg text-sm ${formErrors.quantity ? 'border-red-500' : 'border-gray-300'}`}
        />
        {formErrors.quantity && <p className="text-red-500 text-xs mt-1">{formErrors.quantity}</p>}
      </div>
      <button
        onClick={() => handleSubmit(!!editingProduct)}
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
      >
        {submitting ? (editingProduct ? 'Updating...' : 'Adding...') : (editingProduct ? 'Update Product' : 'Add Product')}
      </button>
    </div>
  )

  if (loading) return <Spinner fullPage />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <EmptyState message="No products found" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500">
                  <th className="px-6 py-3 font-medium">#</th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">SKU</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Quantity</th>
                  <th className="px-6 py-3 font-medium">Created At</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-500">{i + 1}</td>
                    <td className="px-6 py-4 text-gray-800 font-medium">{p.name}</td>
                    <td className="px-6 py-4 text-gray-600">{p.sku}</td>
                    <td className="px-6 py-4 text-gray-800">₹{p.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {p.quantity < 10 ? (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                          Low Stock ({p.quantity})
                        </span>
                      ) : (
                        p.quantity
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(p.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete"
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

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Product">
        {renderForm()}
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Product">
        {renderForm()}
      </Modal>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => { setShowConfirmDelete(false); setDeletingId(null) }}
      />
    </div>
  )
}

export default Products
