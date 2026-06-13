import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api'; // Import URL Railway
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2, Zap, MessageSquare } from 'lucide-react';

const AIAdvisor = () => {
  const userData = JSON.parse(localStorage.getItem('clarifi_user') || '{}');
  const userId = userData?.id;

  const [messages, setMessages] = useState([
    { role: 'ai', text: `Halo ${userData.name?.split(' ')[0] || 'User'}! Aku ClariFi AI. Berikan aku pertanyaan seputar keuanganmu, aku siap menganalisis datamu.` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll ke bawah setiap ada pesan baru
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !userId) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // MENGGUNAKAN API_BASE_URL RAILWAY & MENGIRIM userId
      const res = await axios.post(`${API_BASE_URL}/api/ai/chat`, { 
        message: input,
        userId: userId 
      });
      
      setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch (err) {
      console.error("AI Error:", err);
      setMessages(prev => [...prev, { role: 'ai', text: 'Maaf, sistem pemrosesan AI kami sedang sibuk di server Railway. Coba lagi beberapa saat ya!' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) return <div className="p-20 text-center font-black uppercase opacity-20 tracking-[0.5em]">Identity Required</div>;

  return (
    <div className="max-w-5xl mx-auto h-[85vh] flex flex-col bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden page-transition relative">
      
      {/* HEADER PREMIUM */}
      <div className="p-8 border-b bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500 rounded-2xl shadow-[0_0_15px_#10b981]">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-black text-xl tracking-tight uppercase italic">Intelligence <span className="text-emerald-400">Advisor.</span></h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
               <Zap size={10} className="fill-emerald-400 text-emerald-400" /> Powered by Gemini 1.5 Pro
            </p>
          </div>
        </div>
        <div className="hidden md:block text-right">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Session</p>
           <p className="text-xs font-bold text-emerald-400">{userData.name}</p>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                }`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex gap-4 items-center bg-white/80 backdrop-blur-md px-6 py-4 rounded-full border border-emerald-100 shadow-sm">
              <Loader2 className="animate-spin text-emerald-500" size={18} /> 
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest italic">ClariFi is thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT AREA PREMIUM */}
      <div className="p-8 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="relative max-w-4xl mx-auto flex items-center gap-4">
          <div className="absolute left-5 text-slate-300">
             <MessageSquare size={20} />
          </div>
          <input 
            type="text"
            className="flex-1 p-5 pl-14 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-700 shadow-inner"
            placeholder="Tanyakan sesuatu: 'Analisis jajan kopiku bulan ini...'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            disabled={loading || !input.trim()}
            className="p-5 bg-slate-900 text-white rounded-full hover:bg-emerald-600 transition-all disabled:opacity-20 shadow-xl active:scale-90"
          >
            <Send size={24} />
          </button>
        </form>
        <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mt-6">
          Security: Your financial data is encrypted and used only for AI context.
        </p>
      </div>
    </div>
  );
};

export default AIAdvisor;