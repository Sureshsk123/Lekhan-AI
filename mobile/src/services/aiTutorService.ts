import apiClient from './apiClient';
import { ChatSession, ChatMessage } from '../types';

export const createChatSession = async (payload: { title?: string; language?: string } = {}): Promise<ChatSession> => {
  const res = await apiClient.post('/ai-tutor/session', payload);
  return res.data.session || res.data.data || res.data;
};

export const getChatSessions = async (): Promise<ChatSession[]> => {
  const res = await apiClient.get('/ai-tutor/session');
  return res.data.sessions || res.data.data || res.data || [];
};

export const askAiTutor = async (payload: { message: string; sessionId?: string; language?: string }): Promise<{ reply: string; sessionId: string }> => {
  const res = await apiClient.post('/ai-tutor/chat', payload);
  return {
    reply: res.data.reply || res.data.message || res.data.response || '',
    sessionId: res.data.sessionId || payload.sessionId || '',
  };
};

export const getChatHistory = async (sessionId: string): Promise<ChatMessage[]> => {
  const res = await apiClient.get(`/ai-tutor/history/${sessionId}`);
  return res.data.messages || res.data.history || res.data.data || [];
};

export const deleteChatSession = async (sessionId: string): Promise<any> => {
  const res = await apiClient.delete(`/ai-tutor/clear/${sessionId}`);
  return res.data;
};

export default {
  createChatSession,
  getChatSessions,
  askAiTutor,
  getChatHistory,
  deleteChatSession,
};
