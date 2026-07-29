import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="brand-container">
        <div className="logo-badge">AIVOA</div>
        <div>
          <h1 className="brand-title">Customer Complaint Management System</h1>
          <p className="brand-sub">API & FDF Quality Assurance Module • QMS Automated Intake</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span className="badge-beta" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={12} /> AI AGENT ACTIVE
        </span>
        <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={14} color="#16a34a" /> 21 CFR Part 11 Compliant
        </span>
      </div>
    </header>
  );
}
