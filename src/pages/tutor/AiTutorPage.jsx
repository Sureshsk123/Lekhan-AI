import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import { Bot, Send, Plus, Trash2, Copy, Sparkles, User, RefreshCw, MessageSquare } from 'lucide-react';
import { createChatSession, getChatSessions, askAiTutor, getChatHistory, deleteChatSession } from '../../services/aiTutorService';

export const AiTutorPage = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await getChatSessions();
      if (res && res.data) {
        setSessions(res.data);
        if (res.data.length > 0) {
          selectSession(res.data[0].sessionId || res.data[0]._id);
        } else {
          handleNewSession();
        }
      }
    } catch (err) {
      console.error('Fetch sessions error:', err);
    }
  };

  const selectSession = async (sessionId) => {
    setCurrentSessionId(sessionId);
    try {
      const historyRes = await getChatHistory(sessionId);
      if (historyRes && historyRes.data) {
        setMessages(historyRes.data.messages || []);
      }
    } catch (err) {
      console.error('Fetch history error:', err);
    }
  };

  const handleNewSession = async () => {
    try {
      const res = await createChatSession({ title: 'New Conversation' });
      const newId = res.data?.sessionId || res.data?._id || `session-${Date.now()}`;
      setSessions((prev) => [res.data || { sessionId: newId, title: 'New Conversation' }, ...prev]);
      setCurrentSessionId(newId);
      setMessages([]);
    } catch (err) {
      console.error('Create session error:', err);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await deleteChatSession(sessionId);
      setSessions((prev) => prev.filter((s) => (s.sessionId || s._id) !== sessionId));
      if (currentSessionId === sessionId) {
        setMessages([]);
        setCurrentSessionId(null);
      }
    } catch (err) {
      console.error('Delete session error:', err);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { role: 'user', content: query, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await askAiTutor({
        message: query,
        sessionId: currentSessionId,
        language: 'Tamil'
      });

      const tutorReply = res.data?.reply || res.reply || 'I am ready to help you learn Tamil and Indic languages!';
      setMessages((prev) => [...prev, { role: 'model', content: tutorReply, timestamp: new Date().toISOString() }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'model', content: 'Sorry, I encountered a temporary connection issue. Please try again.', timestamp: new Date().toISOString() }]);
    } finally {
      setLoading(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const suggestedPrompts = [
    'Explain Tamil vowels (உயிரெழுத்துக்கள்)',
    'Teach me Hindi numbers 1 to 10',
    'Give me practice exercises for Telugu vocabulary',
    'Correct this sentence: நான் பள்ளி போகிறேன்'
  ];

  return (
    <div className="min-h-screen bg-transparent text-content-primary flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 space-y-4 overflow-hidden pb-20 lg:pb-6">
          <Breadcrumbs />

          <div className="flex-1 flex gap-4 bg-surface-primary/70 dark:bg-surface-primary/70 rounded-3xl border border-border-light/60 backdrop-blur-xl overflow-hidden shadow-xl">
            
            {/* Sessions Sidebar */}
            <div className="hidden md:flex flex-col w-64 border-r border-border-light/60 p-4 space-y-3 bg-slate-50/50 dark:bg-surface-primary/40">
              <button
                onClick={handleNewSession}
                className="w-full py-2.5 px-4 rounded-2xl bg-accent-primary text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" /> New Chat Session
              </button>

              <div className="flex-1 overflow-y-auto space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2 px-2">History</span>
                {sessions.map((s) => {
                  const sId = s.sessionId || s._id;
                  const active = currentSessionId === sId;
                  return (
                    <div
                      key={sId}
                      onClick={() => selectSession(sId)}
                      className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                        active
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'text-content-tertiary hover:bg-surface-tertiary'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{s.title || 'Chat Session'}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(sId);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-300 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              
              {/* Header */}
              <div className="p-4 border-b border-border-light/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-accent-primary text-white flex items-center justify-center shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm flex items-center gap-2">
                      LangSphere Gemini AI Tutor <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </h3>
                    <p className="text-[11px] text-slate-400">Ask anything in Tamil, Hindi, Telugu, or English</p>
                  </div>
                </div>

                <button
                  onClick={handleNewSession}
                  className="md:hidden p-2 rounded-xl bg-emerald-500 text-white text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <Bot className="w-8 h-8" />
                    </div>
                    <h4 className="font-black text-lg">Hello! How can I help your language learning today?</h4>
                    <p className="text-xs text-slate-400 max-w-md">Pick a suggested prompt below or type your question to start instant conversation practice.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full pt-2">
                      {suggestedPrompts.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(prompt)}
                          className="p-3 rounded-2xl bg-surface-tertiary hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left text-xs font-semibold text-content-secondary border border-slate-200/60 dark:border-slate-700/60 transition-colors"
                        >
                          💬 "{prompt}"
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {m.role !== 'user' && (
                        <div className="w-8 h-8 rounded-xl bg-accent-primary text-white flex items-center justify-center shrink-0 shadow-md">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div className={`max-w-xl p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-accent-primary text-white shadow-md rounded-br-none font-medium'
                          : 'bg-surface-tertiary text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 rounded-bl-none'
                      }`}>
                        <p className="whitespace-pre-wrap">{m.content}</p>
                        {m.role !== 'user' && (
                          <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                            <span>Gemini AI Tutor</span>
                            <button
                              onClick={() => copyToClipboard(m.content)}
                              className="hover:text-emerald-500 flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" /> Copy
                            </button>
                          </div>
                        )}
                      </div>

                      {m.role === 'user' && (
                        <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-md">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center animate-pulse">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-4 rounded-3xl bg-surface-tertiary text-xs text-slate-400 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <div className="p-3 border-t border-border-light/60 bg-surface-primary/40 dark:bg-surface-primary/40">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask AI Tutor anything..."
                    className="flex-1 px-4 py-3 rounded-2xl bg-surface-tertiary text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="p-3 rounded-2xl bg-accent-primary text-white font-bold disabled:opacity-50 hover:scale-105 active:scale-95 transition-all shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>

          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default AiTutorPage;
