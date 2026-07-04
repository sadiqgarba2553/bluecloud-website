import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const ADMIN_EMAIL = 'sadiqgarbaibrahimadeel@gmail.com';

const AdminRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/portal/login');
      } else if (user.email !== ADMIN_EMAIL) {
        // Normal client tried to access admin panel
        navigate('/portal/dashboard');
      } else {
        // It is the admin
        setIsAuthorized(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#0f172a', color: 'white' }}>Verifying permissions...</div>;
  }

  return isAuthorized ? children : null;
};

export default AdminRoute;
