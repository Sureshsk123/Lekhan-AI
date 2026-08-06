import apiClient from './apiClient';
import { ChatSession, ChatMessage } from '../types';

export const createChatSession = async (payload: { title?: string; language?: string } = {}): Promise<ChatSession> => {
  const res = await apiClient.post('/ai-tutor/session', payload);
  const data = res.data?.data || res.data;
  return {
    id: data.sessionId || data.id || data._id,
    _id: data.sessionId || data.id || data._id,
    title: data.title || 'Chat Session',
    createdAt: data.createdAt || new Date().toISOString()
  };
};

export const getChatSessions = async (): Promise<ChatSession[]> => {
  const res = await apiClient.get('/ai-tutor/session');
  const items = res.data?.data || res.data?.sessions || res.data || [];
  return Array.isArray(items) ? items.map((i: any) => ({
    id: i.sessionId || i.id || i._id,
    _id: i.sessionId || i.id || i._id,
    title: i.title || 'Chat Session',
    createdAt: i.createdAt || new Date().toISOString()
  })) : [];
};

export const askAiTutor = async (payload: { message: string; sessionId?: string; language?: string }): Promise<{ reply: string; sessionId: string }> => {
  const res = await apiClient.post('/ai-tutor/chat', payload);
  const data = res.data?.data || res.data;
  return {
    reply: data?.reply || data?.message || data?.response || '',
    sessionId: data?.sessionId || payload.sessionId || '',
  };
};

export const getChatHistory = async (sessionId: string): Promise<ChatMessage[]> => {
  const res = await apiClient.get(`/ai-tutor/history/${sessionId}`);
  const items = res.data?.data?.messages || res.data?.messages || res.data?.history || [];
  return Array.isArray(items) ? items.map((m: any, idx: number) => ({
    id: m.id || String(idx),
    sender: m.role === 'user' ? 'user' : 'ai',
    text: m.content || m.text || '',
    timestamp: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
  })) : [];
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
