import apiClient from './apiClient';

export const processVisionOCR = async (formDataOrObject) => {
  let isFormData = formDataOrObject instanceof FormData;
  const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const res = await apiClient.post('/ocr/vision', formDataOrObject, config);
  return res.data;
};

export const getOcrHistory = async (params = {}) => {
  const res = await apiClient.get('/ocr/history', { params });
  return res.data;
};

export default {
  processVisionOCR,
  getOcrHistory
};
