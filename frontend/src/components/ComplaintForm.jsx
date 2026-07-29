import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateField, resetComplaintForm } from '../store/complaintSlice';
import { RotateCcw, Save } from 'lucide-react';
import RiskAssessment from './RiskAssessment';

export default function ComplaintForm() {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.complaint.data);
  const updatedFields = useSelector((state) => state.complaint.updatedFields);

  const handleChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the form?")) {
      dispatch(resetComplaintForm());
    }
  };

  const handleSave = () => {
    alert(`Complaint saved successfully! Product: ${formData.product_name || 'N/A'}, Batch: ${formData.batch_number || 'N/A'}`);
  };

  const isUpdated = (fieldName) => updatedFields.includes(fieldName);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Log Customer Complaint</h2>
          <p className="card-subtitle">API & FDF Quality Assurance Module</p>
        </div>
        <span className="badge-pending">Pending Triage</span>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {/* SECTION 1: ORIGIN & CUSTOMER DETAILS */}
        <div className="section-title">1. Origin & Customer Details</div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Complaint Source</label>
            <input
              type="text"
              className={`form-input ${isUpdated('complaint_source') ? 'ai-updated' : ''}`}
              placeholder="Awaiting AI extraction..."
              value={formData.complaint_source || ''}
              onChange={(e) => handleChange('complaint_source', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Customer Name</label>
            <input
              type="text"
              className={`form-input ${isUpdated('customer_name') ? 'ai-updated' : ''}`}
              placeholder="Awaiting AI extraction..."
              value={formData.customer_name || ''}
              onChange={(e) => handleChange('customer_name', e.target.value)}
            />
          </div>
        </div>

        {/* SECTION 2: PRODUCT & BATCH IDENTIFICATION */}
        <div className="section-title">2. Product & Batch Identification</div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className={`form-input ${isUpdated('product_name') ? 'ai-updated' : ''}`}
              placeholder="Awaiting AI extraction..."
              value={formData.product_name || ''}
              onChange={(e) => handleChange('product_name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Product Strength/Grade</label>
            <input
              type="text"
              className={`form-input ${isUpdated('product_strength') ? 'ai-updated' : ''}`}
              placeholder="Awaiting AI extraction..."
              value={formData.product_strength || ''}
              onChange={(e) => handleChange('product_strength', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Batch/Lot Number</label>
            <input
              type="text"
              className={`form-input ${isUpdated('batch_number') ? 'ai-updated' : ''}`}
              placeholder="Awaiting AI extraction..."
              value={formData.batch_number || ''}
              onChange={(e) => handleChange('batch_number', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Manufacturing Date</label>
            <input
              type="date"
              className={`form-input ${isUpdated('manufacturing_date') ? 'ai-updated' : ''}`}
              value={formData.manufacturing_date || ''}
              onChange={(e) => handleChange('manufacturing_date', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Expiry Date</label>
            <input
              type="date"
              className={`form-input ${isUpdated('expiry_date') ? 'ai-updated' : ''}`}
              value={formData.expiry_date || ''}
              onChange={(e) => handleChange('expiry_date', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Quantity Affected</label>
            <div className="input-suffix-group">
              <input
                type="text"
                className={`form-input ${isUpdated('quantity_affected') ? 'ai-updated' : ''}`}
                placeholder="Awaiting AI extraction..."
                value={formData.quantity_affected || ''}
                onChange={(e) => handleChange('quantity_affected', e.target.value)}
              />
              <span className="input-suffix">
                {formData.quantity_affected?.toLowerCase().includes('kg') ? 'kg' : 'units'}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 3: COMPLAINT DETAILS */}
        <div className="section-title">3. Complaint Details</div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Complaint Type</label>
            <input
              type="text"
              className={`form-input ${isUpdated('complaint_type') ? 'ai-updated' : ''}`}
              placeholder="Awaiting AI extraction..."
              value={formData.complaint_type || ''}
              onChange={(e) => handleChange('complaint_type', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Complaint Date</label>
            <input
              type="date"
              className={`form-input ${isUpdated('complaint_date') ? 'ai-updated' : ''}`}
              value={formData.complaint_date || ''}
              onChange={(e) => handleChange('complaint_date', e.target.value)}
            />
          </div>
          <div className="form-group full-width">
            <label className="form-label">Detailed Complaint Description</label>
            <textarea
              rows={3}
              className={`form-textarea ${isUpdated('detailed_description') ? 'ai-updated' : ''}`}
              placeholder="Awaiting AI extraction..."
              value={formData.detailed_description || ''}
              onChange={(e) => handleChange('detailed_description', e.target.value)}
            />
          </div>
        </div>

        {/* SECTION 4: INITIAL ASSESSMENT & PRIORITY */}
        <div className="section-title">4. Initial Assessment & Priority</div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Initial Severity</label>
            <select
              className={`form-select ${isUpdated('initial_severity') ? 'ai-updated' : ''}`}
              value={formData.initial_severity || 'Major'}
              onChange={(e) => handleChange('initial_severity', e.target.value)}
            >
              <option value="">Awaiting AI extraction...</option>
              <option value="Minor">Minor</option>
              <option value="Moderate">Moderate</option>
              <option value="Major">Major</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              className={`form-select ${isUpdated('priority') ? 'ai-updated' : ''}`}
              value={formData.priority || 'High'}
              onChange={(e) => handleChange('priority', e.target.value)}
            >
              <option value="">Awaiting AI extraction...</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* FORM ACTIONS */}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            <RotateCcw size={14} /> Reset Form
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            <Save size={14} /> Save Complaint
          </button>
        </div>
      </form>

      {/* AI RISK ASSESSMENT SECTION */}
      <RiskAssessment />
    </div>
  );
}
