import { createSlice } from '@reduxjs/toolkit';

const initialMessages = [
  {
    id: '1',
    sender: 'assistant',
    text: 'Upload a complaint document or paste text above. I will automatically extract the details and populate the form for you.'
  }
];

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: initialMessages,
    extractionProgress: 0, // 0 to 100
    isExtracting: false,
    isProcessingMessage: false,
    currentFileName: null
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push({
        id: Date.now().toString(),
        sender: action.payload.sender,
        text: action.payload.text
      });
    },
    setExtractionProgress: (state, action) => {
      state.extractionProgress = action.payload;
    },
    setIsExtracting: (state, action) => {
      state.isExtracting = action.payload;
      if (!action.payload) {
        state.extractionProgress = 0;
      }
    },
    setIsProcessingMessage: (state, action) => {
      state.isProcessingMessage = action.payload;
    },
    setCurrentFileName: (state, action) => {
      state.currentFileName = action.payload;
    },
    clearChatHistory: (state) => {
      state.messages = initialMessages;
      state.extractionProgress = 0;
      state.isExtracting = false;
      state.currentFileName = null;
    }
  }
});

export const {
  addMessage,
  setExtractionProgress,
  setIsExtracting,
  setIsProcessingMessage,
  setCurrentFileName,
  clearChatHistory
} = chatSlice.actions;

export default chatSlice.reducer;
