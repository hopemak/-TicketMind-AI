import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'

const CreateTicket = () => {
  const [formData, setFormData] = useState({ title: '', description: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    else if (formData.title.length > 200) newErrors.title = 'Title must be under 200 characters'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    else if (formData.description.length > 5000) newErrors.description = 'Description must be under 5000 characters'
    return newErrors
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setIsSubmitting(true)
    try {
      const res = await api.post('/tickets', formData)
      toast.success('Ticket created and AI-classified successfully!')
      navigate(`/tickets/${res.data.data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create ticket')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <Link to="/" className="hover:text-primary-600">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-700">New Ticket</span>
        </div>
        <h1 className="page-title">Create Support Ticket</h1>
        <p className="page-subtitle">Describe your issue and our AI will classify and prioritize it automatically</p>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="mb-6 p-4 rounded-lg bg-primary-50 border border-primary-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-primary-900">AI Classification Active</h3>
                <p className="text-xs text-primary-700 mt-0.5">Your ticket will be automatically categorized and assigned a priority level by our machine learning model.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="form-label">Ticket Title</label>
              <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} className={errors.title ? 'form-input-error' : 'form-input'} placeholder="e.g., Cannot access my account after password reset" />
              {errors.title && <p className="mt-1.5 text-sm text-danger-600 font-medium">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="description" className="form-label">Description</label>
              <textarea id="description" name="description" rows={5} value={formData.description} onChange={handleChange} className={errors.description ? 'form-input-error' : 'form-input'} placeholder="Provide detailed information about your issue..." />
              {errors.description && <p className="mt-1.5 text-sm text-danger-600 font-medium">{errors.description}</p>}
              <p className="mt-1.5 text-xs text-slate-400 text-right font-medium">{formData.description.length}/5000</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Link to="/" className="btn-secondary">Cancel</Link>
              <button type="submit" disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Create Ticket
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateTicket