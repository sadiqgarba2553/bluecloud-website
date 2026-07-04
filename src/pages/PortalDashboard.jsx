import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Receipt, 
  LifeBuoy, 
  Settings, 
  LogOut,
  CheckCircle2,
  Clock,
  Menu,
  X,
  Bell,
  Search,
  Download
} from 'lucide-react';
import './PortalDashboard.css';

const PortalDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/portal/login');
      } else {
        setUser(currentUser);
        // Fetch projects and invoices from Firestore
        try {
          const qProj = query(collection(db, "projects"), where("userEmail", "==", currentUser.email));
          const projSnap = await getDocs(qProj);
          setProjects(projSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

          const qInv = query(collection(db, "invoices"), where("userEmail", "==", currentUser.email));
          const invSnap = await getDocs(qInv);
          setInvoices(invSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/portal/login');
  };

  if (loading) {
    return <div className="portal-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading Dashboard...</div>;
  }

  // Fallback to demo data if no projects found in Firestore
  const displayProjects = projects.length > 0 ? projects : [
    {
      id: 'demo-1',
      title: 'AI Data Integration Platform',
      progress: 75,
      milestones: [
        { title: 'Phase 1: Architecture Design', completed: true, date: 'Sep 10' },
        { title: 'Phase 2: Database Migration', completed: true, date: 'Sep 28' },
        { title: 'Phase 3: UI Implementation', completed: false, date: 'Oct 15' }
      ]
    }
  ];

  const displayInvoices = invoices.length > 0 ? invoices : [
    { id: 'demo-inv-1', invoiceNumber: 'INV-2026-042', date: 'Sep 01, 2026', amount: 4500, status: 'Paid' }
  ];

  return (
    <div className="portal-layout">
      <SEO 
        title="Dashboard — BlueCloud Portal" 
        description="Client portal dashboard." 
        path="/portal/dashboard" 
      />

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div className="portal-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`portal-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="portal-sidebar-header">
          <h2 style={{ color: 'var(--deep-navy)', fontSize: '1.25rem', margin: 0 }}>Portal Menu</h2>
          <button className="portal-close-btn" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="portal-nav">
          <a href="#" className="portal-nav-item active" onClick={(e) => e.preventDefault()}>
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </a>
          <a href="#" className="portal-nav-item" onClick={(e) => e.preventDefault()}>
            <FolderKanban size={20} />
            <span>Active Projects</span>
          </a>
          <a href="#" className="portal-nav-item" onClick={(e) => e.preventDefault()}>
            <Receipt size={20} />
            <span>Invoices</span>
          </a>
          <a href="#" className="portal-nav-item" onClick={(e) => e.preventDefault()}>
            <LifeBuoy size={20} />
            <span>Support Tickets</span>
          </a>
          <a href="#" className="portal-nav-item" onClick={(e) => e.preventDefault()}>
            <Settings size={20} />
            <span>Settings</span>
          </a>
        </nav>

        <div className="portal-sidebar-footer">
          <button className="portal-logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="portal-main">
        {/* Topbar */}
        <header className="portal-topbar">
          <div className="portal-topbar-left">
            <button className="portal-menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="portal-search">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search projects, invoices..." />
            </div>
          </div>
          <div className="portal-topbar-right">
            <button className="portal-icon-btn">
              <Bell size={20} />
              <span className="portal-badge">2</span>
            </button>
            <div className="portal-avatar">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="portal-content">
          <div className="portal-welcome">
            <h1>Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Client'}</h1>
            <p>Here is what's happening with your projects today.</p>
          </div>

          <div className="portal-stats-grid">
            <div className="portal-stat-card">
              <h3>Active Projects</h3>
              <div className="stat-value">{displayProjects.length}</div>
              <p className="stat-trend positive">On track</p>
            </div>
            <div className="portal-stat-card">
              <h3>Next Milestone</h3>
              <div className="stat-value">Oct 15</div>
              <p className="stat-trend">UI Deployment</p>
            </div>
            <div className="portal-stat-card">
              <h3>Outstanding Balance</h3>
              <div className="stat-value">$0.00</div>
              <p className="stat-trend positive">All paid</p>
            </div>
          </div>

          <div className="portal-grid">
            {/* Project Progress */}
            <div className="portal-card col-span-2">
              {displayProjects.map(project => (
                <div key={project.id} style={{ marginBottom: '30px' }}>
                  <div className="portal-card-header">
                    <h2>{project.title}</h2>
                    <span className="status-badge in-progress">{project.progress === 100 ? 'Completed' : 'In Progress'}</span>
                  </div>
                  <div className="portal-card-body">
                    <div className="progress-section">
                      <div className="progress-info">
                        <span>Overall Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </div>

                    <div className="milestone-list">
                      {project.milestones && project.milestones.map((milestone, idx) => (
                        <div key={idx} className={`milestone-item ${milestone.completed ? 'completed' : 'current'}`}>
                          {milestone.completed ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                          <div className="milestone-details">
                            <h4>{milestone.title}</h4>
                            <p>{milestone.completed ? 'Completed on ' : 'Target: '}{milestone.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Invoices */}
            <div className="portal-card">
              <div className="portal-card-header">
                <h2>Recent Invoices</h2>
              </div>
              <div className="portal-card-body p-0">
                <div className="invoice-list">
                  {displayInvoices.map(inv => (
                    <div key={inv.id} className="invoice-item">
                      <div className="invoice-info">
                        <h4>{inv.invoiceNumber}</h4>
                        <p>{inv.date}</p>
                      </div>
                      <div className="invoice-amount">
                        <h4>${inv.amount}</h4>
                        <span className={`status-badge ${inv.status.toLowerCase()}`}>{inv.status}</span>
                      </div>
                      <button className="invoice-download"><Download size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortalDashboard;
