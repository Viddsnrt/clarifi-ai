import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

const AIAdvisor = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Halo! Aku ClariFi AI. Ada yang bisa aku bantu dengan keuanganmu hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll ke bawah saat ada chat baru
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/ai/chat', { message: input });
      setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Maaf, aku sedang tidak bisa berpikir. Coba lagi nanti ya!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden page-transition">
      {/* HEADER */}
      <div className="p-6 border-b bg-emerald-600 text-white flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <Sparkles size={24} />
        </div>
        <div>
          <h2 className="font-bold text-lg">AI Financial Advisor</h2>
          <p className="text-xs text-emerald-100 italic font-medium tracking-wide">Berdasarkan data keuangan real-time kamu</p>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-200 shadow-sm rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center text-slate-400 text-sm italic">
              <Loader2 className="animate-spin" size={18} /> ClariFi sedang menganalisis datamu...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT AREA */}
      <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-100 flex gap-4">
        <input 
          type="text"
          className="flex-1 p-4 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
          placeholder="Tanya sesuatu, misal: 'Kenapa uangku cepat habis?'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          disabled={loading}
          className="p-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition disabled:opacity-50 shadow-lg shadow-emerald-100"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default AIAdvisor;