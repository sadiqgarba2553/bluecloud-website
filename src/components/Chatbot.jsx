import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Mic, Volume2, VolumeX, CheckCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import './Chatbot.css';

// Initialize Gemini API
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || 'MISSING_API_KEY');

const systemInstruction = `You are Aura, the official AI assistant for BlueCloud Technologies. You are a friendly, highly intelligent, and professional guide. BlueCloud is an elite enterprise web development and AI solutions company based in Abuja, Nigeria. 

CRITICAL COMPANY INFO:
- Email: sadeeqsgi@icloud.com
- Phone: 08125531111
- Address: Plot 1743, Cadastral Zone B, Mabushi, Abuja

Your goal is to help visitors understand our core services (Enterprise Web Apps, Custom AI Solutions, and Cybersecurity), guide them to our portfolio, and encourage them to contact us for a quote using the factual contact info provided above. NEVER invent or hallucinate emails, phone numbers, or addresses. Keep your responses concise, engaging, and professional. Always refer to yourself as Aura. Do not use any emojis in your response.`;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm Aura, the BlueCloud AI assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);

  // Voice & Lead states
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadService, setLeadService] = useState('Web Development');

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

  // Text to speech playback
  const speakText = (text) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition (Mic)
  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    // Check if user is asking for quote/contact
    const lower = userMessage.toLowerCase();
    if (lower.includes('quote') || lower.includes('estimate') || lower.includes('price') || lower.includes('contact') || lower.includes('hire')) {
      setShowLeadForm(true);
    }

    try {
      if (!apiKey || apiKey === 'MISSING_API_KEY') {
        throw new Error("Missing API Key. Please ensure VITE_GEMINI_API_KEY is in your .env.local file.");
      }
      
      const result = await chatSession.sendMessage(userMessage);
      const botResponse = result.response.text();
      
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
      speakText(botResponse);
    } catch (error) {
      console.error("Chat error:", error);
      const errTxt = `BlueCloud AI Assistant: How can we assist you with your project today? Contact us directly at sadeeqsgi@icloud.com or 08125531111.`;
      setMessages(prev => [...prev, { text: errTxt, sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadName || !leadEmail) return;

    try {
      await addDoc(collection(db, 'leads'), {
        name: leadName,
        email: leadEmail,
        service: leadService,
        source: 'Chatbot Aura',
        createdAt: serverTimestamp()
      });
      setLeadSubmitted(true);
      setMessages(prev => [...prev, { text: `Thank you, ${leadName}! Your request has been recorded. Our team will contact you at ${leadEmail}.`, sender: 'bot' }]);
    } catch (err) {
      console.error("Error submitting lead:", err);
      setLeadSubmitted(true);
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
              <p>BlueCloud AI Assistant</p>
            </div>
            <div className="chatbot-header-actions">
              <button 
                className={`chatbot-voice-toggle-btn ${ttsEnabled ? 'active' : ''}`}
                onClick={() => setTtsEnabled(!ttsEnabled)}
                title="Toggle Voice Speech Output"
              >
                {ttsEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>
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

            {/* Smart Lead Form Widget */}
            {showLeadForm && (
              <div className="chat-lead-card">
                {leadSubmitted ? (
                  <div style={{ textAlign: 'center', color: 'var(--primary-blue)', fontSize: '0.85rem' }}>
                    <CheckCircle size={20} style={{ margin: '0 auto 4px', display: 'block' }} />
                    Request Logged Successfully!
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit}>
                    <h4>Quick Project Request</h4>
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      required 
                    />
                    <input 
                      type="email" 
                      placeholder="Work Email" 
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      required 
                    />
                    <select value={leadService} onChange={(e) => setLeadService(e.target.value)}>
                      <option value="Web Development">Web Development</option>
                      <option value="AI Solutions">AI Solutions & Automation</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                    </select>
                    <button type="submit">Submit Request</button>
                  </form>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <button className={`chatbot-mic-btn ${isListening ? 'listening' : ''}`} onClick={handleMicClick} title="Voice Input">
              <Mic size={18} />
            </button>
            <input 
              type="text" 
              placeholder={isListening ? "Listening..." : "Type your message..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading || !input.trim()}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

