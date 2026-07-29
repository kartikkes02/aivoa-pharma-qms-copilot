import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addMessage,
  setExtractionProgress,
  setIsExtracting,
  setIsProcessingMessage
} from '../store/chatSlice';
import { setFullComplaint, clearUpdatedHighlights } from '../store/complaintSlice';
import { Upload, FileText, Send, Bot, User, CheckCircle2, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function AiCopilotChat() {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const extractionProgress = useSelector((state) => state.chat.extractionProgress);
  const isExtracting = useSelector((state) => state.chat.isExtracting);
  const isProcessingMessage = useSelector((state) => state.chat.isProcessingMessage);
  const currentComplaint = useSelector((state) => state.complaint.data);

  const [inputPrompt, setInputPrompt] = useState('');
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, extractionProgress]);

  // Handle Natural Language Prompt (Log Complaint & Edit Complaint Tools)
  const handleSendMessage = async (textToSend) => {
    const messageText = textToSend || inputPrompt;
    if (!messageText.trim()) return;

    dispatch(addMessage({ sender: 'user', text: messageText }));
    if (!textToSend) setInputPrompt('');
    dispatch(setIsProcessingMessage(true));

    try {
      const response = await axios.post('/api/agent/chat', {
        message: messageText,
        current_complaint: currentComplaint
      });

      const { message, action_type, updated_fields, complaint, risk_assessment } = response.data;

      // Update Redux state with complaint details & risk assessment
      dispatch(setFullComplaint({ complaint, updated_fields, risk_assessment }));
      dispatch(addMessage({ sender: 'assistant', text: message }));

      // Clear highlights after 4 seconds
      setTimeout(() => {
        dispatch(clearUpdatedHighlights());
      }, 4000);
    } catch (err) {
      dispatch(addMessage({
        sender: 'assistant',
        text: `Error processing request: ${err.response?.data?.detail || err.message}`
      }));
    } finally {
      dispatch(setIsProcessingMessage(false));
    }
  };

  // Handle Document Upload (Document Extraction Tool)
  const handleFileUpload = async (file) => {
    if (!file) return;

    dispatch(setIsExtracting(true));
    dispatch(setExtractionProgress(15));

    const formData = new FormData();
    formData.append('file', file);

    const progressInterval = setInterval(() => {
      dispatch(setExtractionProgress(Math.min(90, extractionProgress + 15)));
    }, 250);

    try {
      const res = await axios.post('/api/agent/extract-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      clearInterval(progressInterval);
      dispatch(setExtractionProgress(100));

      const { message, updated_fields, complaint, risk_assessment } = res.data;

      dispatch(setFullComplaint({ complaint, updated_fields: Object.keys(complaint), risk_assessment }));
      dispatch(addMessage({
        sender: 'assistant',
        text: `Extracted data from document "${file.name}". Form and Risk Assessment updated.`
      }));

      setTimeout(() => {
        dispatch(setIsExtracting(false));
        dispatch(clearUpdatedHighlights());
      }, 1200);
    } catch (err) {
      clearInterval(progressInterval);
      dispatch(setIsExtracting(false));
      dispatch(addMessage({
        sender: 'assistant',
        text: `Failed to extract document: ${err.response?.data?.detail || err.message}`
      }));
    }
  };

  // Quick Preset Sample Buttons (as shown in assignment video)
  const handleSamplePrompt = (sampleType) => {
    if (sampleType === 'log_amoxicillin') {
      handleSendMessage(
        "Apollo Pharmacy reported discolored capsules in Amoxicillin capsules 500 milligrams."
      );
    } else if (sampleType === 'edit_batch_qty') {
      handleSendMessage(
        "Sorry, the batch number is BMX240602, and the affected quantity is 48 capsules."
      );
    } else if (sampleType === 'edit_metformin') {
      handleSendMessage(
        "Sorry, the batch number is C-H-G-2-6-0-7-1-2-A, and affected quantity is 50 kilograms, 2 HDPE drums."
      );
    }
  };

  // Load sample PDF from backend for 1-click test upload
  const handleUploadSamplePdf = async (filename) => {
    try {
      const response = await fetch(`/api/samples/download/${filename}`);
      const blob = await response.blob();
      const file = new File([blob], filename, { type: 'application/pdf' });
      handleFileUpload(file);
    } catch (err) {
      alert("Could not load sample PDF: " + err.message);
    }
  };

  return (
    <div className="card">
      <div className="assistant-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="#2563eb" />
          <h2 className="card-title" style={{ fontSize: '18px' }}>AI Complaint Intake Assistant</h2>
        </div>
        <span className="badge-beta">BETA</span>
      </div>

      {/* DROPZONE / FILE UPLOADER */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".pdf,.docx,.txt,.eml"
        onChange={(e) => handleFileUpload(e.target.files[0])}
      />
      <div className="dropzone" onClick={() => fileInputRef.current?.click()}>
        <Upload size={28} className="dropzone-icon" />
        <div className="dropzone-text">
          Drag & drop complaint document here or <span className="dropzone-link">click to browse</span>
        </div>
      </div>

      <div className="divider-or">OR</div>

      <button
        type="button"
        className="btn btn-secondary"
        style={{ width: '100%', justifyContent: 'center', marginBottom: '14px' }}
        onClick={() => {
          const text = prompt("Paste raw complaint email or letter text:");
          if (text) handleSendMessage(text);
        }}
      >
        <FileText size={14} /> Paste Complaint Text / Email
      </button>

      <div className="info-banner">
        <CheckCircle2 size={16} />
        <span>Supported formats: PDF, DOCX, TXT, EML • Max file size: 10MB</span>
      </div>

      {/* EXTRACTION PROGRESS BAR */}
      {isExtracting && (
        <div className="progress-container">
          <div className="progress-header">
            <span>Extraction Progress</span>
            <span>{extractionProgress}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${extractionProgress}%` }} />
          </div>
          <div className="progress-text">
            Analyzing document content and extracting key details... Please wait.
          </div>
        </div>
      )}

      {/* CHAT LOG */}
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
        AI ASSISTANT
      </div>
      <div className="chat-box">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-message ${msg.sender}`}>
            <div className="chat-avatar">
              {msg.sender === 'assistant' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div>
              <p style={{ margin: 0 }}>{msg.text}</p>
            </div>
          </div>
        ))}
        {isProcessingMessage && (
          <div className="chat-message assistant">
            <div className="chat-avatar"><Bot size={16} /></div>
            <p style={{ margin: 0, fontStyle: 'italic', color: '#64748b' }}>
              Extracting details & reasoning risk assessment...
            </p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* QUICK SAMPLE PROMPT BUTTONS */}
      <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>
        Try Demo Video Scenarios:
      </div>
      <div className="sample-pills">
        <button className="sample-pill" onClick={() => handleSamplePrompt('log_amoxicillin')}>
          💊 1. Log Amoxicillin Prompt
        </button>
        <button className="sample-pill" onClick={() => handleSamplePrompt('edit_batch_qty')}>
          ✏️ 2. Edit Batch & Qty (BMX240602)
        </button>
        <button className="sample-pill" onClick={() => handleUploadSamplePdf('Metformin_Hydrochloride_API_Complaint.pdf')}>
          📄 3. Upload Metformin PDF Sample
        </button>
        <button className="sample-pill" onClick={() => handleSamplePrompt('edit_metformin')}>
          ✏️ 4. Edit Metformin (50kg, 2 drums)
        </button>
      </div>

      {/* CHAT INPUT AREA */}
      <div className="chat-input-container" style={{ marginTop: '14px' }}>
        <input
          type="text"
          className="chat-input"
          placeholder="Ask me anything about this complaint..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button className="chat-send-btn" onClick={() => handleSendMessage()}>
          <Send size={16} />
        </button>
      </div>
      <p style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center', marginTop: '6px' }}>
        AI responses may contain errors. Please verify information.
      </p>
    </div>
  );
}
