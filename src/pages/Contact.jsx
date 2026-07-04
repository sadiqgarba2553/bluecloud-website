import { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import './Contact.css';

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '0ec62a62-2bec-47cb-9e5f-cb2ac429f907',
          ...formData
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Error sending message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <SEO
        title="Contact BlueCloud Technologies | Get a Quote for Your Project"
        description="Ready to start your next enterprise project? Contact BlueCloud Technologies today for web development, AI integration, and cybersecurity services."
        path="/contact"
      />
      <div className="contact-header">
        <div className="container">
          <h1>Get in Touch</h1>
          <p>Ready to start a project? Reach out to our technical team today.</p>
        </div>
      </div>

      <div className="container">
        <div className="contact-content">
          
          {/* Contact Information */}
          <div className="contact-info-panel">
            <h3>Contact Information</h3>
            <div className="contact-details-list">
              <div className="contact-detail-item">
                <div className="contact-icon-wrapper">
                  <MapPin size={24} />
                </div>
                <div className="contact-detail-text">
                  <h4>Headquarters</h4>
                  <p>Plot 1743, Cadastral Zone B, Mabushi, Abuja</p>
                </div>
              </div>
              
              <div className="contact-detail-item">
                <div className="contact-icon-wrapper">
                  <Phone size={24} />
                </div>
                <div className="contact-detail-text">
                  <h4>Phone</h4>
                  <p>08125531111</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-wrapper">
                  <Mail size={24} />
                </div>
                <div className="contact-detail-text">
                  <h4>Email</h4>
                  <p>sadeeqsgi@icloud.com</p>
                </div>
              </div>
              
              <div className="contact-detail-item">
                <div className="contact-icon-wrapper">
                  <Clock size={24} />
                </div>
                <div className="contact-detail-text">
                  <h4>Business Hours</h4>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            <div className="map-wrapper" style={{ marginTop: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid #CBD5E1' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15882.355152541347!2d7.4332906!3d9.0664539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0b38c2380327%3A0xc0dbbf33dfc2789!2sMabushi%2C%20Abuja!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng" 
                width="100%" 
                height="250" 
                style={{ border: 0, display: 'block' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-panel">
            <h3 className="mb-4">Send us a message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input type="text" id="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="John Doe" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="john@example.com" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject</label>
                <input type="text" id="subject" value={formData.subject} onChange={handleChange} className="form-control" placeholder="How can we help?" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea id="message" value={formData.message} onChange={handleChange} className="form-control" placeholder="Describe your project requirements..." required></textarea>
              </div>
              
              <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%', backgroundColor: isSubmitted ? 'var(--mint-accent)' : 'var(--primary-blue)', color: isSubmitted ? 'var(--deep-navy)' : 'var(--white)', opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Sending...' : isSubmitted ? 'Message Sent successfully!' : 'Send Message'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
