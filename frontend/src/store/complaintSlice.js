import { createSlice } from '@reduxjs/toolkit';

const initialComplaintState = {
  complaint_source: '',
  customer_name: '',
  product_name: '',
  product_strength: '',
  batch_number: '',
  manufacturing_date: '',
  expiry_date: '',
  quantity_affected: '',
  complaint_type: '',
  complaint_date: '',
  detailed_description: '',
  initial_severity: '',
  priority: ''
};

const initialRiskAssessment = {
  severity: 'Major',
  risk_score: 75,
  recommended_action: 'Route to QA investigation and issue replacement',
  root_cause_analysis: [
    'Thermal degradation or humidity exposure during blister packaging storage',
    'Excipient interaction or raw material lot variance'
  ],
  capa_recommendation: [
    'Perform visual inspection of retain samples',
    'Audit packaging line environmental logs'
  ],
  completeness_score: 0,
  missing_fields: [],
  duplicate_warning: null
};

export const complaintSlice = createSlice({
  name: 'complaint',
  initialState: {
    data: initialComplaintState,
    riskAssessment: initialRiskAssessment,
    updatedFields: [],
    savedStatus: 'idle'
  },
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state.data[field] = value;
    },
    setFullComplaint: (state, action) => {
      const { complaint, updated_fields, risk_assessment } = action.payload;
      state.data = { ...state.data, ...complaint };
      state.updatedFields = updated_fields || [];
      if (risk_assessment) {
        state.riskAssessment = risk_assessment;
      }
    },
    resetComplaintForm: (state) => {
      state.data = initialComplaintState;
      state.riskAssessment = initialRiskAssessment;
      state.updatedFields = [];
    },
    clearUpdatedHighlights: (state) => {
      state.updatedFields = [];
    }
  }
});

export const {
  updateField,
  setFullComplaint,
  resetComplaintForm,
  clearUpdatedHighlights
} = complaintSlice.actions;

export default complaintSlice.reducer;
