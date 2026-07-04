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
  Download,
  FolderOpen
} from 'lucide-react';
import './PortalDashboard.css';

const PortalDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
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

  // Dynamic calculations
  const calculateOutstandingBalance = () => {
    return invoices
      .filter(inv => inv.status === 'Pending' || inv.status === 'Overdue')
      .reduce((acc, curr) => acc + parseFloat(curr.amount), 0)
      .toFixed(2);
  };

  const getNextMilestone = () => {
    let next = null;
    projects.forEach(p => {
      if (p.milestones) {
        const uncompleted = p.milestones.find(m => !m.completed);
        if (uncompleted && (!next || new Date(uncompleted.date) < new Date(next.date))) {
          next = uncompleted;
        }
      }
    });
    return next;
  };

  const outstandingBalance = calculateOutstandingBalance();
  const nextMilestone = getNextMilestone();

  return (
    <div className="portal-layout">
      <SEO 
        title={`${activeTab} — BlueCloud Portal`} 
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
          <a href="#" className={`portal-nav-item ${activeTab === 'Overview' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Overview'); setIsSidebarOpen(false); }}>
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </a>
          <a href="#" className={`portal-nav-item ${activeTab === 'Active Projects' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Active Projects'); setIsSidebarOpen(false); }}>
            <FolderKanban size={20} />
            <span>Active Projects</span>
          </a>
          <a href="#" className={`portal-nav-item ${activeTab === 'Invoices' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Invoices'); setIsSidebarOpen(false); }}>
            <Receipt size={20} />
            <span>Invoices</span>
          </a>
          <a href="#" className={`portal-nav-item ${activeTab === 'Support Tickets' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Support Tickets'); setIsSidebarOpen(false); }}>
            <LifeBuoy size={20} />
            <span>Support Tickets</span>
          </a>
          <a href="#" className={`portal-nav-item ${activeTab === 'Settings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Settings'); setIsSidebarOpen(false); }}>
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
              <input type="text" placeholder={`Search ${activeTab.toLowerCase()}...`} />
            </div>
          </div>
          <div className="portal-topbar-right">
            <button className="portal-icon-btn">
              <Bell size={20} />
              {invoices.filter(i => i.status === 'Overdue').length > 0 && <span className="portal-badge">{invoices.filter(i => i.status === 'Overdue').length}</span>}
            </button>
            <div className="portal-avatar">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="portal-content">
          <div className="portal-welcome">
            <h1>{activeTab === 'Overview' ? `Welcome back, ${user?.displayName || user?.email?.split('@')[0] || 'Client'}` : activeTab}</h1>
            <p>
              {activeTab === 'Overview' && "Here is what's happening with your projects today."}
              {activeTab === 'Active Projects' && "Detailed view of all your ongoing and completed projects."}
              {activeTab === 'Invoices' && "View your billing history and outstanding invoices."}
              {activeTab === 'Support Tickets' && "Get help from our technical support team."}
              {activeTab === 'Settings' && "Manage your account preferences."}
            </p>
          </div>

          {activeTab === 'Overview' && (
            <>
              <div className="portal-stats-grid">
                <div className="portal-stat-card">
                  <h3>Active Projects</h3>
                  <div className="stat-value">{projects.filter(p => p.progress < 100).length}</div>
                  <p className="stat-trend positive">Total {projects.length} projects</p>
                </div>
                <div className="portal-stat-card">
                  <h3>Next Milestone</h3>
                  <div className="stat-value" style={{ fontSize: nextMilestone ? '1.5rem' : '1.2rem' }}>{nextMilestone ? nextMilestone.date : 'None'}</div>
                  <p className="stat-trend">{nextMilestone ? nextMilestone.title : 'All caught up'}</p>
                </div>
                <div className="portal-stat-card">
                  <h3>Outstanding Balance</h3>
                  <div className="stat-value">${outstandingBalance}</div>
                  <p className={`stat-trend ${parseFloat(outstandingBalance) === 0 ? 'positive' : ''}`}>
                    {parseFloat(outstandingBalance) === 0 ? 'All paid' : 'Action required'}
                  </p>
                </div>
              </div>

              <div className="portal-grid">
                {/* Project Progress */}
                <div className="portal-card col-span-2">
                  <div className="portal-card-header">
                    <h2>Recent Projects</h2>
                    {projects.length > 0 && <button onClick={() => setActiveTab('Active Projects')} style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', cursor: 'pointer', fontWeight: 600 }}>View All</button>}
                  </div>
                  <div className="portal-card-body p-0">
                    {projects.length === 0 ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--slate-text)' }}>
                        <FolderOpen size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                        <p>You have no active projects.</p>
                      </div>
                    ) : (
                      projects.slice(0, 2).map(project => (
                        <div key={project.id} style={{ padding: '20px', borderBottom: '1px solid var(--light-gray)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{project.title}</h3>
                            <span className="status-badge in-progress">{project.progress === 100 ? 'Completed' : 'In Progress'}</span>
                          </div>
                          
                          <div className="progress-section" style={{ marginBottom: 0 }}>
                            <div className="progress-info">
                              <span>Overall Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <div className="progress-bar-bg">
                              <div className="progress-bar-fill" style={{ width: `${project.progress}%` }}></div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Invoices */}
                <div className="portal-card">
                  <div className="portal-card-header">
                    <h2>Recent Invoices</h2>
                    {invoices.length > 0 && <button onClick={() => setActiveTab('Invoices')} style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', cursor: 'pointer', fontWeight: 600 }}>View All</button>}
                  </div>
                  <div className="portal-card-body p-0">
                    {invoices.length === 0 ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--slate-text)' }}>
                        <Receipt size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                        <p>No invoices found.</p>
                      </div>
                    ) : (
                      <div className="invoice-list">
                        {invoices.slice(0, 4).map(inv => (
                          <div key={inv.id} className="invoice-item">
                            <div className="invoice-info">
                              <h4>{inv.invoiceNumber}</h4>
                              <p>{inv.date}</p>
                            </div>
                            <div className="invoice-amount">
                              <h4>${inv.amount}</h4>
                              <span className={`status-badge ${inv.status.toLowerCase()}`}>{inv.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'Active Projects' && (
            <div className="portal-grid">
              <div className="portal-card col-span-2" style={{ gridColumn: '1 / -1' }}>
                {projects.length === 0 ? (
                  <div style={{ padding: '60px', textAlign: 'center', color: 'var(--slate-text)' }}>
                    <FolderKanban size={64} style={{ opacity: 0.2, margin: '0 auto 20px' }} />
                    <h3 style={{ color: 'var(--deep-navy)', marginBottom: '10px' }}>No Projects Found</h3>
                    <p>There are currently no projects associated with your account.</p>
                  </div>
                ) : (
                  projects.map(project => (
                    <div key={project.id} style={{ borderBottom: '1px solid var(--light-gray)', padding: '30px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{project.title}</h2>
                        <span className="status-badge in-progress">{project.progress === 100 ? 'Completed' : 'In Progress'}</span>
                      </div>
                      
                      <div className="progress-section" style={{ marginBottom: '30px' }}>
                        <div className="progress-info">
                          <span>Overall Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${project.progress}%` }}></div>
                        </div>
                      </div>

                      {project.milestones && project.milestones.length > 0 && (
                        <div>
                          <h4 style={{ marginBottom: '15px', color: 'var(--deep-navy)' }}>Project Milestones</h4>
                          <div className="milestone-list">
                            {project.milestones.map((milestone, idx) => (
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
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'Invoices' && (
            <div className="portal-card">
              <div className="portal-card-body p-0">
                {invoices.length === 0 ? (
                  <div style={{ padding: '60px', textAlign: 'center', color: 'var(--slate-text)' }}>
                    <Receipt size={64} style={{ opacity: 0.2, margin: '0 auto 20px' }} />
                    <h3 style={{ color: 'var(--deep-navy)', marginBottom: '10px' }}>No Invoices</h3>
                    <p>You have no billing history.</p>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--light-gray)', textAlign: 'left' }}>
                        <th style={{ padding: '15px 20px', color: 'var(--slate-text)', fontWeight: 600 }}>Invoice #</th>
                        <th style={{ padding: '15px 20px', color: 'var(--slate-text)', fontWeight: 600 }}>Date</th>
                        <th style={{ padding: '15px 20px', color: 'var(--slate-text)', fontWeight: 600 }}>Amount</th>
                        <th style={{ padding: '15px 20px', color: 'var(--slate-text)', fontWeight: 600 }}>Status</th>
                        <th style={{ padding: '15px 20px', color: 'var(--slate-text)', fontWeight: 600 }}>Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map(inv => (
                        <tr key={inv.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                          <td style={{ padding: '15px 20px', fontWeight: 500, color: 'var(--deep-navy)' }}>{inv.invoiceNumber}</td>
                          <td style={{ padding: '15px 20px', color: 'var(--slate-text)' }}>{inv.date}</td>
                          <td style={{ padding: '15px 20px', fontWeight: 600, color: 'var(--deep-navy)' }}>${inv.amount}</td>
                          <td style={{ padding: '15px 20px' }}>
                            <span className={`status-badge ${inv.status.toLowerCase()}`}>{inv.status}</span>
                          </td>
                          <td style={{ padding: '15px 20px' }}>
                            <button className="invoice-download"><Download size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Support Tickets' && (
            <div className="portal-card" style={{ padding: '60px', textAlign: 'center' }}>
              <LifeBuoy size={64} style={{ opacity: 0.2, margin: '0 auto 20px', color: 'var(--slate-text)' }} />
              <h3 style={{ color: 'var(--deep-navy)', marginBottom: '10px' }}>Support Tickets Coming Soon</h3>
              <p style={{ color: 'var(--slate-text)', maxWidth: '400px', margin: '0 auto' }}>We are currently building out our dedicated support ticket system. For now, please email us directly with any issues.</p>
              <a href="mailto:sadiqgarbaibrahimadeel@gmail.com" className="portal-btn" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', backgroundColor: 'var(--primary-blue)', color: 'white', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>Email Support</a>
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="portal-card" style={{ padding: '30px' }}>
              <h3 style={{ color: 'var(--deep-navy)', marginBottom: '20px' }}>Account Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--slate-text)', fontSize: '0.85rem', marginBottom: '5px' }}>Email Address</label>
                  <input type="text" value={user?.email || ''} readOnly style={{ width: '100%', padding: '10px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: 'var(--deep-navy)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--slate-text)', fontSize: '0.85rem', marginBottom: '5px' }}>Account Type</label>
                  <input type="text" value="Client Account" readOnly style={{ width: '100%', padding: '10px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: 'var(--deep-navy)' }} />
                </div>
                <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: 'var(--deep-navy)' }}>Security</h4>
                  <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: 'var(--slate-text)' }}>Need to update your password? Send a password reset email to your address.</p>
                  <button style={{ padding: '8px 16px', border: '1px solid #cbd5e1', backgroundColor: 'transparent', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Send Reset Link</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PortalDashboard;
