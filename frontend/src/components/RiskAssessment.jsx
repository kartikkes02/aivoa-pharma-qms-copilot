import React from 'react';
import { useSelector } from 'react-redux';
import { AlertTriangle, CheckCircle2, ShieldAlert, Activity, FileText } from 'lucide-react';

export default function RiskAssessment() {
  const risk = useSelector((state) => state.complaint.riskAssessment);

  if (!risk) return null;

  return (
    <div className="risk-card">
      <div className="risk-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={18} color="#2563eb" />
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
            AI Copilot Risk Assessment & QA Guidance
          </h3>
        </div>
        <div className="risk-score-badge">
          <Activity size={14} /> Risk Index: {risk.risk_score}/100 ({risk.severity})
        </div>
      </div>

      {/* RECOMMENDED NEXT ACTION */}
      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #2563eb', marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>
          Recommended Next Action
        </div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
          {risk.recommended_action}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {/* ROOT CAUSE HYPOTHESES */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
            AI Recommended Root Causes
          </div>
          <ul className="risk-list">
            {risk.root_cause_analysis?.map((item, idx) => (
              <li key={idx} className="risk-item">
                <span className="risk-bullet" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CAPA RECOMMENDATION */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
            Suggested CAPA Steps
          </div>
          <ul className="risk-list">
            {risk.capa_recommendation?.map((item, idx) => (
              <li key={idx} className="risk-item">
                <CheckCircle2 size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* COMPLEATENESS & DUPLICATE CHECKS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
          <FileText size={14} />
          <span>Form Completeness: <strong>{risk.completeness_score}%</strong></span>
        </div>
        {risk.duplicate_warning && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b' }}>
            <CheckCircle2 size={13} color="#16a34a" /> {risk.duplicate_warning}
          </div>
        )}
      </div>
    </div>
  );
}
