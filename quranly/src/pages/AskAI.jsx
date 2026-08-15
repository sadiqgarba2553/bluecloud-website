import { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Key, Loader2, Crown, BookOpen, FileText } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { usePlayer } from '../context/PlayerContext';
import { retrieveIslamicContext, buildGroundedPrompt } from '../services/ragService';
import GlassCard from '../components/GlassCard';
import './AskAI.css';

const ENV_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const AskAI = () => {
  const { isPro, openSubscriptionModal } = usePlayer();
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('quranly_gemini_key') || ENV_GEMINI_KEY);
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      text: 'Peace be upon you! I am your AI assistant trained to help you explore the meanings and wisdom of the Quran grounded in authentic Tafsir and Sahih Hadiths. What would you like to know?',
      context: null
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [showSettings, setShowSettings] = useState(() => !(localStorage.getItem('quranly_gemini_key') || ENV_GEMINI_KEY));
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      setShowSettings(true);
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Please add your Google Gemini API key (Settings key icon) before asking a question.',
        context: null,
      }]);
      return;
    }
    if (!isPro) {
      openSubscriptionModal();
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);
    setStatusText('Retrieving authentic Quran & Hadith sources...');

    try {
      // 1. Perform authentic RAG retrieval
      const retrievedContext = await retrieveIslamicContext(userMessage);

      setStatusText('Generating grounded answer...');

      // 2. Build grounded prompt
      const prompt = buildGroundedPrompt(userMessage, retrievedContext);

      // 3. Generate response with Gemini
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: responseText,
        context: retrievedContext
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'Sorry, I encountered an error retrieving grounded sources or answering your question. Please check your connection.',
        context: null
      }]);
    } finally {
      setLoading(false);
      setStatusText('');
    }
  };

  const handleSaveKey = (e) => {
    e.preventDefault();
    localStorage.setItem('quranly_gemini_key', apiKey);
    setShowSettings(false);
  };

  // If user is not PRO, show a sleek Pro feature gate screen
  if (!isPro) {
    return (
      <div className="ask-ai-page">
        <div className="ask-ai-header">
          <h1><Sparkles size={28} color="#818cf8" /> Ask the Quran</h1>
          <p>Semantic Search &amp; AI Assistant</p>
        </div>
        <GlassCard className="pro-ai-gate-card">
          <div className="pro-icon-badge">
            <Crown size={32} color="#fbbf24" />
          </div>
          <h2>Quranly PRO Feature</h2>
          <p>Ask the Quran AI is an exclusive feature reserved for Quranly PRO members. Unlock instant semantic search, verse explanations, and Islamic AI Q&amp;A.</p>
          <button className="unlock-pro-btn" onClick={openSubscriptionModal}>
            <Crown size={16} fill="currentColor" /> Upgrade to PRO
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="ask-ai-page">
      <div className="ask-ai-header" style={{ position: 'relative' }}>
        <h1><Sparkles size={28} color="#818cf8" /> Ask the Quran</h1>
        <p>Explore wisdom through AI</p>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          style={{ position: 'absolute', right: 0, top: 0, background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}
        >
          <Key size={20} color={showSettings ? "#818cf8" : "#9ca3af"} />
        </button>
      </div>

      {showSettings && (
        <GlassCard className="api-key-card" style={{ marginBottom: '20px', marginTop: '0' }}>
          <h3>API Key Configuration</h3>
          <p>Enter your Google Gemini API key to use the AI assistant.</p>
          <form onSubmit={handleSaveKey} className="api-key-input-group">
            <input 
              type="password" 
              placeholder="AIzaSy..." 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button type="submit" className="save-key-btn">Save Key</button>
          </form>
        </GlassCard>
      )}

      <div className="chat-container">
        {messages.map((m, i) => (
          <div key={i} className={`chat-message ${m.role}`}>
            {m.role === 'ai' ? (
              <div className="ai-response-wrap">
                <div dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />

                {/* Grounded Retrieved Sources Container */}
                {m.context && (m.context.verses?.length > 0 || m.context.hadiths?.length > 0) && (
                  <div className="retrieved-sources-container">
                    <div className="sources-header">
                      <BookOpen size={14} color="#818cf8" />
                      <span>Retrieved Grounding Sources ({m.context.verses.length + m.context.hadiths.length})</span>
                    </div>

                    <div className="sources-list">
                      {m.context.verses?.map((v, idx) => (
                        <div key={`v-${idx}`} className="source-pill verse-source">
                          <span className="source-key">[Verse {v.verseKey}]</span>
                          <span className="source-snippet">{v.translation.slice(0, 110)}...</span>
                        </div>
                      ))}

                      {m.context.hadiths?.map((h, idx) => (
                        <div key={`h-${idx}`} className="source-pill hadith-source">
                          <span className="source-key">[{h.bookName} #{h.hadithNumber}]</span>
                          <span className="source-snippet">{h.textEnglish.slice(0, 110)}...</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              m.text
            )}
          </div>
        ))}
        {loading && (
          <div className="chat-message ai" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Loader2 size={16} className="spin" />
            <span>{statusText || 'Thinking...'}</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-wrapper">
        <input 
          type="text" 
          placeholder="e.g. What does the Quran say about patience?" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
        />
        <button className="chat-send-btn" onClick={handleSend} disabled={!input.trim() || loading}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AskAI;
