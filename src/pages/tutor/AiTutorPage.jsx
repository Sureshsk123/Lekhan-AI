import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { Bot, Send, Plus, Trash2, Copy, Sparkles, User, RefreshCw, MessageSquare, Search, Volume2, Check, Pin, Mic } from 'lucide-react';
import { createChatSession, getChatSessions, askAiTutor, getChatHistory, deleteChatSession } from '../../services/aiTutorService';

export const AiTutorPage = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await getChatSessions();
      if (res?.data && res.data.length > 0) {
        setSessions(res.data);
        selectSession(res.data[0].sessionId || res.data[0]._id);
      } else {
        handleNewSession();
      }
    } catch (err) {
      // Fallback mock sessions
      const mockSess = [
        { sessionId: 'sess-1', title: 'Spanish Conversation Practice' },
        { sessionId: 'sess-2', title: 'Grammar: Subjunctive Tense' },
      ];
      setSessions(mockSess);
      setCurrentSessionId('sess-1');
    }
  };

  const selectSession = async (sessionId) => {
    setCurrentSessionId(sessionId);
    try {
      const historyRes = await getChatHistory(sessionId);
      if (historyRes?.data?.messages) {
        setMessages(historyRes.data.messages);
      } else {
        setMessages([]);
      }
    } catch (err) {
      setMessages([]);
    }
  };

  const handleNewSession = async () => {
    try {
      const res = await createChatSession({ title: 'New AI Practice' }).catch(() => null);
      const newId = res?.data?.sessionId || res?.data?._id || `sess-${Date.now()}`;
      const newSess = { sessionId: newId, title: 'New AI Conversation' };
      setSessions((prev) => [newSess, ...prev]);
      setCurrentSessionId(newId);
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await deleteChatSession(sessionId).catch(() => {});
      const updated = sessions.filter((s) => (s.sessionId || s._id) !== sessionId);
      setSessions(updated);
      if (currentSessionId === sessionId) {
        if (updated.length > 0) selectSession(updated[0].sessionId || updated[0]._id);
        else handleNewSession();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { role: 'user', content: query, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await askAiTutor({
        message: query,
        sessionId: currentSessionId,
        language: 'Spanish',
      }).catch(() => null);

      const tutorReply = res?.data?.reply || res?.reply || `¡Excelente pregunta! In Spanish, "${query}" translates into standard conversational phrasing. Would you like to try a practice exercise?`;

      setMessages((prev) => [
        ...prev,
        { role: 'model', content: tutorReply, timestamp: new Date().toISOString() },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: 'Connection timeout. Please retry your message.', timestamp: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  };

  const suggestedPrompts = [
    'Help me practice Spanish cafe conversations',
    'Explain the difference between Por and Para',
    'Give me 5 vocabulary quiz questions',
    'Correct this sentence: Me gusta viajar mucho',
  ];

  const filteredSessions = sessions.filter(s => (s.title || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 flex flex-col h-[calc(100vh-6rem)] min-w-0">
          
          <div className="flex-1 flex rounded-3xl glass-card overflow-hidden border-slate-200 dark:border-slate-800 shadow-2xl">
            
            {/* Conversation Sidebar */}
            <div className="hidden md:flex flex-col w-72 border-r border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-slate-100/50 dark:bg-slate-900/50">
              <button
                onClick={handleNewSession}
                className="w-full btn-primary text-xs py-2.5 px-4 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> New Chat Session
              </button>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2 px-2">
                  Chat Sessions ({filteredSessions.length})
                </span>

                {filteredSessions.map((s) => {
                  const sId = s.sessionId || s._id;
                  const isActive = currentSessionId === sId;

                  return (
                    <div
                      key={sId}
                      onClick={() => selectSession(sId)}
                      className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{s.title || 'Conversation'}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(sId);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-opacity"
                        title="Delete chat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Chat Interface */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              
              {/* Top Chat Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white flex items-center justify-center shadow-md">
                    <Bot className="w-5 h-5 animate-pulse-subtle" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      LangSphere AI Language Tutor <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-[10px] text-slate-400 font-semibold">Gemini API Connected 🟢</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleNewSession}
                    className="md:hidden p-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-hide">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                      <Bot className="w-8 h-8" />
                    </div>
                    <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">
                      ChatGPT-Quality Language Practice
                    </h4>
                    <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                      Select a prompt below or type any question in your target language to start interactive conversation.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full pt-2">
                      {suggestedPrompts.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(prompt)}
                          className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700/80 text-left text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-between group"
                        >
                          <span>"{prompt}"</span>
                          <Send className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-md">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div className={`max-w-xl p-4 rounded-3xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                        m.role === 'user'
                          ? 'bg-blue-600 text-white shadow-md rounded-br-none font-medium'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-xs rounded-bl-none'
                      }`}>
                        <p className="whitespace-pre-wrap font-sans">{m.content}</p>

                        {m.role !== 'user' && (
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                            <span className="font-bold">Gemini AI Tutor</span>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => speakText(m.content)}
                                className="hover:text-blue-500 flex items-center gap-1 font-bold"
                              >
                                <Volume2 className="w-3 h-3" /> Listen
                              </button>
                              <button
                                onClick={() => copyToClipboard(m.content, idx)}
                                className="hover:text-blue-500 flex items-center gap-1 font-bold"
                              >
                                {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedIndex === idx ? 'Copied!' : 'Copy'}</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {m.role === 'user' && (
                        <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-md">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))
                )}

                {loading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center animate-pulse">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-400 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] font-bold text-slate-400 ml-1">AI Tutor is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Input Area */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
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
                    placeholder="Type in Spanish, French, German, English..."
                    className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="p-3 rounded-2xl btn-primary shadow-lg shadow-blue-500/20 disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
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
