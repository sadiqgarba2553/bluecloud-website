import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './Chatbot.css';

// Initialize Gemini API
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || 'MISSING_API_KEY');

const systemInstruction = `You are Aura, the official AI assistant for BlueCloud Technologies. You are a friendly, highly intelligent, and professional guide. BlueCloud is an elite enterprise web development and AI solutions company based in Abuja, Nigeria. Your goal is to help visitors understand our core services (Enterprise Web Apps, Custom AI Solutions, and Cybersecurity), guide them to our portfolio, and encourage them to contact us for a quote. Keep your responses concise, engaging, and professional. Always refer to yourself as Aura.`;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! 👋 I'm Aura, the BlueCloud AI assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Initialize chat session on load
  useEffect(() => {
    const initChat = async () => {
      try {
        const model = genAI.getGenerativeModel({
          model: 'gemini-3.5-flash',
          systemInstruction: systemInstruction,
        });
        const chat = model.startChat({
          history: [],
        });
        setChatSession(chat);
      } catch (err) {
        console.error("Error initializing Gemini:", err);
      }
    };
    initChat();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    try {
      if (!apiKey || apiKey === 'MISSING_API_KEY') {
        throw new Error("Missing API Key. Please ensure VITE_GEMINI_API_KEY is in your .env.local file and you have restarted the Vite dev server.");
      }
      
      const result = await chatSession.sendMessage(userMessage);
      const botResponse = result.response.text();
      
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { text: `Error: ${error.message}. If you just added the API key, please restart your development server.`, sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button className="chatbot-toggle-btn" onClick={() => setIsOpen(true)}>
          <MessageSquare size={28} />
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <h3>Aura</h3>
              <p>BlueCloud AI</p>
            </div>
            <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="chat-msg bot typing-indicator">
                <span>...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading || !input.trim()}>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
