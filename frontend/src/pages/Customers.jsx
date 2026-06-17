import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import api from '../api/axios'
import { useToast } from '../components/Toast'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'

const initialForm = { name: '', email: '', phone: '' }

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.email.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format'
  if (!form.phone.trim()) errors.phone = 'Phone is required'
  return errors
}

function Customers() {
  const { showToast } = useToast()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [formData, setFormData] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers')
      setCustomers(res.data)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCustomers() }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setFormErrors({ ...formErrors, [e.target.name]: undefined })
  }

  const openAdd = () => {
    setFormData(initialForm)
    setFormErrors({})
    setShowAddModal(true)
  }

  const handleSubmit = async () => {
    const errors = validate(formData)
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      await api.post('/customers', formData)
      showToast('Customer created successfully')
      setShowAddModal(false)
      setFormData(initialForm)
      fetchCustomers()
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
      await api.delete(`/customers/${deletingId}`)
      showToast('Customer deleted successfully')
      fetchCustomers()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setShowConfirmDelete(false)
      setDeletingId(null)
    }
  }

  if (loading) return <Spinner fullPage />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-500">Manage your customer base</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {customers.length === 0 ? (
        <EmptyState message="No customers found" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500">
                  <th className="px-6 py-3 font-medium">#</th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Phone</th>
                  <th className="px-6 py-3 font-medium">Member Since</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-500">{i + 1}</td>
                    <td className="px-6 py-4 text-gray-800 font-medium">{c.name}</td>
                    <td className="px-6 py-4 text-gray-600">{c.email}</td>
                    <td className="px-6 py-4 text-gray-600">{c.phone}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => confirmDelete(c.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Customer">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
          >
            {submitting ? 'Adding...' : 'Add Customer'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => { setShowConfirmDelete(false); setDeletingId(null) }}
      />
    </div>
  )
}

export default Customers
