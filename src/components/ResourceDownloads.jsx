import { useState } from 'react';
import { Download, FileText, CheckCircle, X, BookOpen } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import './ResourceDownloads.css';

const RESOURCES = [
  {
    id: 'ai-blueprint',
    title: 'Enterprise AI Integration Guide 2026',
    category: 'Whitepaper',
    desc: 'A comprehensive technical blueprint on embedding generative AI models and automated LLM pipelines into enterprise web architectures.',
    file: '/BlueCloud_Rate_Card.pdf'
  },
  {
    id: 'cloud-security',
    title: 'Cloud Security & Infrastructure Scalability',
    category: 'Architecture Guide',
    desc: 'Best practices for zero-trust authorization, Firebase Security Rules auditing, and scaling real-time databases under high user loads.',
    file: '/BlueCloud_Rate_Card.pdf'
  },
  {
    id: 'rate-card-doc',
    title: 'BlueCloud Official Rate Card & Services Guide',
    category: 'Service Guide',
    desc: 'Full breakdown of web app development packages, retainer tiers, custom AI solution pricing, and social media management rates.',
    file: '/BlueCloud_Rate_Card.pdf'
  }
];

const ResourceDownloads = () => {
  const [selectedResource, setSelectedResource] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!email || !name) return;

    try {
      await addDoc(collection(db, 'resource_downloads'), {
        name,
        email,
        resourceId: selectedResource.id,
        resourceTitle: selectedResource.title,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error logging download:', err);
    }

    setDownloaded(true);

    // Trigger file download
    const a = document.createElement('a');
    a.href = selectedResource.file;
    a.download = selectedResource.title + '.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      setSelectedResource(null);
      setDownloaded(false);
      setEmail('');
      setName('');
    }, 2000);
  };

  return (
    <div className="resources-container">
      <div className="resources-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--cyan-accent)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>
          <BookOpen size={18} /> Thought Leadership & Technical Resources
        </div>
        <h2>Download Free Technical Guides</h2>
        <p style={{ color: '#94A3B8', maxWidth: '600px', margin: '0 auto' }}>
          Access enterprise whitepapers, architecture guides, and rate cards curated by BLUECLOUD engineers.
        </p>
      </div>

      <div className="resources-grid">
        {RESOURCES.map((res) => (
          <div key={res.id} className="resource-card">
            <div>
              <span className="resource-tag">{res.category}</span>
              <h3 className="resource-title">{res.title}</h3>
              <p className="resource-desc">{res.desc}</p>
            </div>
            <button 
              className="resource-download-btn"
              onClick={() => setSelectedResource(res)}
            >
              <Download size={16} /> Download Free PDF
            </button>
          </div>
        ))}
      </div>

      {/* Email Capture Modal */}
      {selectedResource && (
        <div className="resource-modal-overlay" onClick={() => setSelectedResource(null)}>
          <div className="resource-modal" onClick={(e) => e.stopPropagation()}>
            <button className="resource-modal-close" onClick={() => setSelectedResource(null)}>
              <X size={20} />
            </button>

            {downloaded ? (
              <div style={{ textAlign: 'center', padding: 'var(--spacing-3)' }}>
                <CheckCircle size={40} style={{ color: 'var(--primary-blue)', margin: '0 auto 12px', display: 'block' }} />
                <h3>Download Started!</h3>
                <p>Check your downloads folder for <strong>{selectedResource.title}</strong>.</p>
              </div>
            ) : (
              <form onSubmit={handleDownload}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', marginBottom: '8px' }}>
                  <FileText size={20} />
                  <strong>Download Resource</strong>
                </div>
                <h3>{selectedResource.title}</h3>
                <p>Please enter your work details to unlock instant PDF access.</p>

                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
                <input 
                  type="email" 
                  placeholder="Your Work Email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />

                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Download size={16} /> Unlock & Download PDF
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceDownloads;
