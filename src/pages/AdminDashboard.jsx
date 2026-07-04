import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import SEO from '../components/SEO';
import { Plus, Edit2, Trash2, LogOut, X, ShieldAlert } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({ userEmail: '', title: '', progress: 0 });
  const [invoiceData, setInvoiceData] = useState({ userEmail: '', invoiceNumber: '', amount: '', date: '', status: 'Pending' });

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const projSnap = await getDocs(collection(db, "projects"));
      setProjects(projSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      const invSnap = await getDocs(collection(db, "invoices"));
      setInvoices(invSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching admin data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/portal/login');
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "projects"), {
        userEmail: formData.userEmail,
        title: formData.title,
        progress: parseInt(formData.progress),
        milestones: [
          { title: 'Project Kickoff', completed: true, date: new Date().toLocaleDateString() }
        ]
      });
      setIsProjectModalOpen(false);
      setFormData({ userEmail: '', title: '', progress: 0 });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddInvoice = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "invoices"), {
        userEmail: invoiceData.userEmail,
        invoiceNumber: invoiceData.invoiceNumber,
        amount: parseFloat(invoiceData.amount),
        date: invoiceData.date,
        status: invoiceData.status
      });
      setIsInvoiceModalOpen(false);
      setInvoiceData({ userEmail: '', invoiceNumber: '', amount: '', date: '', status: 'Pending' });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const updateProgress = async (id, newProgress) => {
    try {
      await updateDoc(doc(db, "projects", id), { progress: parseInt(newProgress) });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProject = async (id) => {
    if(window.confirm("Delete this project?")) {
      await deleteDoc(doc(db, "projects", id));
      fetchData();
    }
  };

  return (
    <div className="admin-layout">
      <SEO title="Master Admin — BlueCloud" description="Admin Panel" path="/portal/admin" />
      
      <header className="admin-header">
        <h1><ShieldAlert size={24} /> Master Admin Panel</h1>
        <div className="admin-header-actions">
          <button className="admin-btn secondary" onClick={handleLogout}>
            <LogOut size={18} /> Exit Admin
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-grid">
          {/* Projects Management */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2>Client Projects</h2>
              <button className="admin-btn" onClick={() => setIsProjectModalOpen(true)}>
                <Plus size={18} /> New Project
              </button>
            </div>
            <div className="admin-card-body p-0">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Client Email</th>
                    <th>Project Title</th>
                    <th>Progress (%)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => (
                    <tr key={p.id}>
                      <td>{p.userEmail}</td>
                      <td>{p.title}</td>
                      <td>
                        <input 
                          type="range" 
                          min="0" max="100" 
                          value={p.progress}
                          onChange={(e) => updateProgress(p.id, e.target.value)}
                        />
                        <span style={{ marginLeft: '10px' }}>{p.progress}%</span>
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <button className="icon-btn delete" onClick={() => deleteProject(p.id)}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {projects.length === 0 && (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No projects found. Create one to test!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Management */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2>Invoices</h2>
              <button className="admin-btn" onClick={() => setIsInvoiceModalOpen(true)}>
                <Plus size={18} /> New
              </button>
            </div>
            <div className="admin-card-body p-0">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id}>
                      <td title={inv.userEmail}>{inv.userEmail.split('@')[0]}</td>
                      <td>${inv.amount}</td>
                      <td>{inv.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Project Modal */}
      {isProjectModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>Create New Project</h2>
              <button className="admin-modal-close" onClick={() => setIsProjectModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddProject}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Client Email Address</label>
                  <input type="email" required value={formData.userEmail} onChange={e => setFormData({...formData, userEmail: e.target.value})} placeholder="client@company.com" />
                </div>
                <div className="admin-form-group">
                  <label>Project Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. AI Integration App" />
                </div>
                <div className="admin-form-group">
                  <label>Initial Progress (%)</label>
                  <input type="number" min="0" max="100" required value={formData.progress} onChange={e => setFormData({...formData, progress: e.target.value})} />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn secondary" onClick={() => setIsProjectModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-btn">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>Create Invoice</h2>
              <button className="admin-modal-close" onClick={() => setIsInvoiceModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddInvoice}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Client Email</label>
                  <input type="email" required value={invoiceData.userEmail} onChange={e => setInvoiceData({...invoiceData, userEmail: e.target.value})} />
                </div>
                <div className="admin-form-group">
                  <label>Invoice Number</label>
                  <input type="text" required value={invoiceData.invoiceNumber} onChange={e => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})} placeholder="INV-2026-001" />
                </div>
                <div className="admin-form-group">
                  <label>Amount ($)</label>
                  <input type="number" step="0.01" required value={invoiceData.amount} onChange={e => setInvoiceData({...invoiceData, amount: e.target.value})} />
                </div>
                <div className="admin-form-group">
                  <label>Date</label>
                  <input type="text" required value={invoiceData.date} onChange={e => setInvoiceData({...invoiceData, date: e.target.value})} placeholder="Oct 12, 2026" />
                </div>
                <div className="admin-form-group">
                  <label>Status</label>
                  <select value={invoiceData.status} onChange={e => setInvoiceData({...invoiceData, status: e.target.value})}>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn secondary" onClick={() => setIsInvoiceModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-btn">Create Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
