import apiClient from './apiClient';

export const transcribeSpeech = async (payloadOrFormData) => {
  let isFormData = payloadOrFormData instanceof FormData;
  const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const res = await apiClient.post('/stt/transcribe', payloadOrFormData, config);
  return res.data;
};

export const getSttHistory = async (params = {}) => {
  const res = await apiClient.get('/stt/history', { params });
  return res.data;
};

export const generateTTS = async (payload) => {
  const res = await apiClient.post('/tts/generate', payload);
  return res.data;
};

export default {
  transcribeSpeech,
  getSttHistory,
  generateTTS
};
