import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import './PortalLogin.css';

const PortalLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/portal/dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid email or password. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
      navigate('/portal/dashboard');
    } catch (err) {
      console.error(err);
      setError('Google Sign-In failed. Please try again.');
      setIsLoading(false);
    }
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
          <div style={{ marginBottom: '20px' }}></div>
          <h2>Welcome Back</h2>
          <p>Sign in to access your project dashboard.</p>
        </div>

        {error && <div className="portal-error">{error}</div>}

        <button onClick={handleGoogleLogin} className="portal-btn-google" disabled={isLoading} style={{ width: '100%', padding: '12px', marginBottom: '20px', backgroundColor: '#fff', color: '#333', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: '500' }}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px', marginRight: '10px' }} />
          Sign in with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#64748b' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
          <span style={{ padding: '0 10px', fontSize: '0.85rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
        </div>

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
            <Lock size={14} /> Secure Connection to Firebase
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortalLogin;
