import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const analyzeImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/analyze', formData);
  return response.data;
};

export const analyzeVideo = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/analyze-video', formData);
  return response.data;
};

export const analyzeAudio = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/analyze-audio', formData);
  return response.data;
};

export const analyzeDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/analyze-document', formData);
  return response.data;
};

export const analyzeText = async (text: string) => {
  const response = await axios.post(`${API_URL}/analyze-text`, { text }, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};

export const analyzeEmail = async (email: string) => {
  const response = await axios.post(`${API_URL}/analyze-email`, { email }, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};

export default api;
