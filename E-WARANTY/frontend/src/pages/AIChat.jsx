import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Send, ArrowLeft, Sparkles } from 'lucide-react';
import { Sidebar } from '../components/Sidebar.jsx';
import { Navbar } from '../components/Navbar.jsx';
import { useToast } from '../hooks/useToast.js';
import { aiService } from '../services/aiService.js';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';

export const AIChat = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I can help with product warranties, maintenance, and system questions. Ask me anything.',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      showToast('Please type a question first.', 'error');
      return;
    }

    const userMessage = prompt.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setPrompt('');
    setLoading(true);

    try {
      const data = await aiService.assist(userMessage);
      setMessages((prev) => [...prev, { sender: 'assistant', text: data.reply }]);
    } catch (error) {
      showToast(error.response?.data?.message || 'AI assistant failed. Please try again.', 'error');
      setMessages((prev) => [...prev, { sender: 'assistant', text: 'Sorry, I could not process that request right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="glass glass-strong rounded-[2rem] border border-slate-700/50 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/20">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200">
                    <Sparkles className="h-4 w-4 text-cyan-300" />
                    AI Assistant
                  </p>
                  <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Ask your warranty assistant</h1>
                  <p className="mt-3 max-w-2xl text-slate-400">
                    Get help with warranty terms, product registration, maintenance recommendations, and app guidance.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to dashboard
                </button>
              </div>
            </div>

            <section className="glass rounded-[2rem] border border-slate-700/50 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/20">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`rounded-3xl p-5 ${
                      message.sender === 'assistant'
                        ? 'bg-slate-900/90 text-slate-100'
                        : 'bg-emerald-600/10 text-emerald-100 self-end'
                    } ${message.sender === 'user' ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[85%]'}`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Type your question here..."
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <LoadingSpinner /> : <Send className="w-4 h-4" />}
                  {loading ? 'Thinking...' : 'Ask AI'}
                </button>
              </form>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};
