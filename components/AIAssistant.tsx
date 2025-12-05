import React, { useState, useRef, useEffect } from 'react';
import { Pond, ParameterLog, Message } from '../types';
import { askSpirulinaAdvisor } from '../services/geminiService';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface AIAssistantProps {
  ponds: Pond[];
  logs: ParameterLog[];
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ ponds, logs }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hola. Soy tu asistente experto en Espirulina. Analizo tus registros de pH, temperatura y DO para darte recomendaciones. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const responseText = await askSpirulinaAdvisor(userMsg.text, ponds, logs);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]"> {/* Adjusted height for Layout padding */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 rounded-2xl mb-4 shadow-lg text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Sparkles size={20} className="text-yellow-300" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Asistente Virtual</h2>
            <p className="text-emerald-100 text-xs">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'model' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'
            }`}>
              {msg.role === 'model' ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none shadow-md shadow-emerald-100' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.text}
              </div>
              <div className={`text-[10px] mt-1 text-right ${msg.role === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
               <Bot size={18} className="text-emerald-600" />
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ej: El pH subió a 11, ¿qué hago?"
          className="w-full p-4 pr-12 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none shadow-sm"
          disabled={isTyping}
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isTyping}
          className="absolute right-2 top-2 p-2 bg-emerald-600 text-white rounded-xl disabled:opacity-50 disabled:bg-slate-300 transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};