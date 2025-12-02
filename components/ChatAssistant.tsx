import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'model', text: 'Hi! I\'m your Badge Assistant. Ask me how to earn any GitHub badge!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiKey = process.env.API_KEY;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !apiKey) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Temporary placeholder for streaming content
      const botMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: botMessageId, role: 'model', text: '' }]);

      const stream = await sendMessageToGemini(
        userMessage.text,
        messages.map(m => ({ role: m.role, text: m.text }))
      );

      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => prev.map(m => 
          m.id === botMessageId ? { ...m, text: fullText } : m
        ));
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: 'Sorry, I encountered an error connecting to the badge database.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!apiKey) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 h-[500px] bg-github-card border border-github-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-github-dark p-4 border-b border-github-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-github-text text-sm">Badge Assistant</h3>
                <p className="text-xs text-github-muted">Powered by Gemini</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-github-muted hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-github-card">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-github-link text-white rounded-br-none'
                      : 'bg-github-border/50 text-github-text rounded-bl-none'
                  }`}
                >
                  <ReactMarkdown className="prose prose-invert prose-sm max-w-none">
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-github-border/50 rounded-2xl rounded-bl-none px-4 py-3">
                  <Loader2 size={16} className="animate-spin text-github-muted" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-github-dark border-t border-github-border">
            <div className="flex items-center gap-2 bg-github-card border border-github-border rounded-full px-4 py-2 focus-within:border-github-link transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about a badge..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-github-text placeholder-github-muted"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="text-github-link disabled:text-github-muted hover:scale-110 transition-transform"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300
          ${isOpen ? 'bg-github-muted text-github-dark rotate-90' : 'bg-gradient-to-r from-github-link to-purple-600 text-white hover:scale-105'}
        `}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default ChatAssistant;