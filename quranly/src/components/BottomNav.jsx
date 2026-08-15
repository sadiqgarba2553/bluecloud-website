import { NavLink } from 'react-router-dom';
import { Home, Users, BookOpen, LayoutGrid, Settings } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import './BottomNav.css';

const BottomNav = () => {
  const { openReciterProfile } = usePlayer();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/reciters', icon: Users, label: 'Reciters' },
    { path: '/mushaf', icon: BookOpen, label: 'Mushaf' },
    { path: '/playlists', icon: LayoutGrid, label: 'Playlists' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="bottom-nav glass-panel">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {
              if (item.path === '/reciters') {
                openReciterProfile(null);
              }
            }}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} strokeWidth={2.2} />
            <span className="nav-label">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomNav;


