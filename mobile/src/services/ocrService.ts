import apiClient from './apiClient';
import { OCRResult } from '../types';

export const processVisionOCR = async (imageUri: string, language?: string): Promise<OCRResult> => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  } as any);
  if (language) {
    formData.append('language', language);
  }
  const res = await apiClient.post('/ocr/vision', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return {
    extractedText: res.data.extractedText || res.data.text || 'Extracted text preview',
    detectedLanguage: res.data.detectedLanguage || language || 'Hindi',
    grammarSuggestions: res.data.grammarSuggestions || [
      { original: 'Namaste ji', suggestion: 'Namaste', explanation: 'Formal greeting refinement' }
    ],
    imageUrl: imageUri,
  };
};

export const getOcrHistory = async (): Promise<OCRResult[]> => {
  const res = await apiClient.get('/ocr/history');
  return res.data.history || res.data.data || [];
};

export default {
  processVisionOCR,
  getOcrHistory,
};
