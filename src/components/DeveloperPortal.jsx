import { useState } from 'react';
import { Code, Terminal, Key, Copy, CheckCircle, Play, BookOpen } from 'lucide-react';
import './DeveloperPortal.css';

const CODE_SNIPPETS = {
  javascript: `// Initialize BLUECLOUD AI SDK
import { BlueCloudAI } from '@bluecloud/ai-sdk';

const bc = new BlueCloudAI({ apiKey: 'bc_live_9f82a174c8b' });

async function runInference() {
  const response = await bc.ai.generate({
    model: 'aura-gemini-3.5',
    prompt: 'Synthesize system metrics for enterprise deployment',
    structuredOutput: true
  });
  console.log(response.output);
}`,

  python: `# BLUECLOUD Python SDK Integration
from bluecloud import Client

client = Client(api_key="bc_live_9f82a174c8b")

response = client.ai.generate(
    model="aura-gemini-3.5",
    prompt="Audit cloud infrastructure security rules",
    temperature=0.2
)

print(response.text)`,

  flux: `// Flux Language Engine Compilation Script
import flux.ai;
import flux.cloud;

entry point main() {
    let prompt = "Execute automated database composite index optimization";
    let pipeline = flux.ai.createPipeline(model="aura-gemini-3.5");
    let result = pipeline.execute(prompt);
    
    flux.cloud.log(result.data);
}`,

  curl: `curl -X POST "https://api.bluecloudai.online/v1/ai/generate" \\
  -H "Authorization: Bearer bc_live_9f82a174c8b" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "aura-gemini-3.5",
    "prompt": "Analyze enterprise web security logs"
  }'`
};

const DeveloperPortal = () => {
  const [activeLang, setActiveLang] = useState('javascript');
  const [apiKey, setApiKey] = useState('bc_live_9f82a174c8b');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const generateNewKey = () => {
    const randomHex = Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setApiKey(`bc_live_${randomHex}`);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeLang]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleTestAPI = () => {
    setIsExecuting(true);
    setApiResponse('');
    setTimeout(() => {
      setApiResponse(JSON.stringify({
        status: 200,
        ok: true,
        model: "aura-gemini-3.5",
        latency: "142ms",
        response: {
          summary: "Execution verified cleanly using BLUECLOUD API engine.",
          securityAudit: "Zero vulnerabilities detected in payload structure.",
          tokensUsed: 148
        }
      }, null, 2));
      setIsExecuting(false);
    }, 800);
  };

  return (
    <div className="dev-portal-container">
      <div className="dev-portal-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>
          <Code size={18} /> Developer API Documentation & SDK Hub
        </div>
        <h1>BLUECLOUD Developer Hub</h1>
        <p style={{ color: 'var(--slate-text)', maxWidth: '650px', margin: '0 auto', fontSize: '1.1rem' }}>
          Build scalable applications with BLUECLOUD APIs, SDKs, and the Flux Language engine.
        </p>
      </div>

      {/* Developer API Key Sandbox */}
      <div className="dev-key-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: 'var(--deep-navy)', fontSize: '1.1rem' }}>
          <Key size={20} style={{ color: 'var(--primary-blue)' }} /> Sandbox API Key Access
        </div>
        <p style={{ color: 'var(--slate-text)', fontSize: '0.85rem', marginTop: '4px' }}>
          Generate a sandbox API key to test endpoints in real-time or embed into your applications.
        </p>
        <div className="dev-key-box">
          <input type="text" className="dev-key-input" value={apiKey} readOnly />
          <button className="btn-secondary" onClick={handleCopyKey} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
            <Copy size={16} /> {copiedKey ? 'Copied!' : 'Copy Key'}
          </button>
          <button className="btn-primary" onClick={generateNewKey} style={{ fontSize: '0.85rem' }}>
            Generate New Key
          </button>
        </div>
      </div>

      {/* Interactive API & Code Console */}
      <div className="dev-console-card">
        <div className="dev-console-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: 'var(--white)' }}>
            <Terminal size={20} style={{ color: 'var(--cyan-accent)' }} /> Interactive Code Snippet Explorer
          </div>

          <div className="dev-lang-tabs">
            {['javascript', 'python', 'flux', 'curl'].map((lang) => (
              <button 
                key={lang}
                className={`dev-lang-btn ${activeLang === lang ? 'active' : ''}`}
                onClick={() => setActiveLang(lang)}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="dev-code-editor">
          {CODE_SNIPPETS[activeLang]}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <button className="btn-secondary" onClick={handleCopyCode} style={{ borderColor: 'rgba(255, 255, 255, 0.3)', color: 'var(--white)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
            <Copy size={16} /> {copiedCode ? 'Code Copied!' : 'Copy Snippet'}
          </button>

          <button className="btn-primary" onClick={handleTestAPI} disabled={isExecuting} style={{ backgroundColor: 'var(--cyan-accent)', color: 'var(--deep-navy)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Play size={16} /> {isExecuting ? 'Executing Request...' : 'Run Console Request'}
          </button>
        </div>

        {apiResponse && (
          <div style={{ marginTop: 'var(--spacing-4)', backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid var(--cyan-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--cyan-accent)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={14} /> Simulated Live API Response
            </div>
            <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--white)' }}>{apiResponse}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperPortal;
