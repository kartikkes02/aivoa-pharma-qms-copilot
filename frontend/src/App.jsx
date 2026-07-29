import React from 'react';
import Header from './components/Header';
import ComplaintForm from './components/ComplaintForm';
import AiCopilotChat from './components/AiCopilotChat';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="app-container">
        <ComplaintForm />
        <AiCopilotChat />
      </main>
    </div>
  );
}
