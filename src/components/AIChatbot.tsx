"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User, Sparkles } from 'lucide-react';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hallo! Ich bin dein Deutsch-Assistent. Wie kann ich dir heute helfen?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          // Map history for Gemini (user/model)
          // Gemini requires history to start with a 'user' message
          history: messages.slice(1).map(m => ({
            role: m.role === 'bot' ? 'model' : 'user',
            parts: [{ text: m.text }]
          }))
        })
      });

      const data = await response.json();
      
      if (data.text) {
        setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('Unknown error from server');
      }
    } catch (error: any) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: `Error: ${error.message}` 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-secondary text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 group"
      >
        <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-2 -right-2 bg-accent text-primary text-[10px] font-black px-2 py-1 rounded-full shadow-md animate-bounce">
          AI
        </div>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 100, scale: 0.8, x: 50 }}
            className="fixed bottom-28 right-8 w-[400px] h-[600px] glass rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border-white/10"
          >
            {/* Header */}
            <div className="p-6 bg-primary text-background flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold">DeutschFlow AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] opacity-70">Online & ready to chat</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform p-1">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'bot' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === 'bot' 
                      ? 'bg-muted text-foreground rounded-tl-none' 
                      : 'bg-secondary text-white rounded-tr-none shadow-lg'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted p-4 rounded-2xl rounded-tl-none flex gap-1">
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-background/50 border-t border-white/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Schreibe etwas auf Deutsch..."
                  className="flex-1 bg-muted border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary outline-none"
                />
                <button 
                  onClick={handleSend}
                  className="bg-secondary text-white p-3 rounded-xl hover:scale-105 transition-transform"
                >
                  <Send size={20} />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[10px] text-muted-foreground justify-center">
                 <Sparkles size={10} className="text-accent" />
                 Powered by Gemini AI
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
