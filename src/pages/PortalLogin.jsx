import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import './PortalLogin.css';

const PortalLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    // Mock authentication delay
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, any email works
      navigate('/portal/dashboard');
    }, 1500);
  };

  return (
    <div className="portal-login-container">
      <SEO 
        title="Client Login — BlueCloud Portal" 
        description="Secure client portal for BlueCloud Technologies." 
        path="/portal/login" 
      />
      
      <div className="portal-login-box">
        <div className="portal-login-header">
          <Link to="/" className="portal-logo">
            <img src="/icon_no_background.PNG" alt="BlueCloud" />
            <span>BLUECLOUD</span>
          </Link>
          <h2>Welcome Back</h2>
          <p>Sign in to access your project dashboard.</p>
        </div>

        {error && <div className="portal-error">{error}</div>}

        <form onSubmit={handleLogin} className="portal-form">
          <div className="portal-form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="client@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="portal-form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="portal-form-options">
            <label className="portal-remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="portal-forgot" onClick={(e) => e.preventDefault()}>Forgot password?</a>
          </div>

          <button type="submit" className="portal-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="flex-center"><Loader2 className="spinner" size={20} /> Authenticating...</span>
            ) : (
              <span className="flex-center">Sign In <ArrowRight size={18} style={{ marginLeft: '8px' }} /></span>
            )}
          </button>
        </form>

        <div className="portal-login-footer">
          <p>
            <Lock size={14} /> Secure Connection
          </p>
          <p className="mt-2 text-sm text-slate">
            Demo Portal: Enter any email to continue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortalLogin;
