import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Camera,
  Settings,
  AlertTriangle,
  AppWindow,
  FileText,
  ChevronLeft,
  ChevronRight,
  Cctv,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  pendingReviews: number;
}

const navItems = [
  {
    section: 'Main',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Overview' },
      { to: '/cameras', icon: Camera, label: 'Cameras' },
      { to: '/events', icon: AlertTriangle, label: 'Events', badgeKey: 'pending' as const },
      { to: '/applications', icon: AppWindow, label: 'Applications' },
    ],
  },
  {
    section: 'Configuration',
    items: [
      { to: '/config', icon: Settings, label: 'Smart Office' },
      { to: '/audit', icon: FileText, label: 'Audit Log' },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle, pendingReviews }: SidebarProps) {


  return (
    <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Cctv />
        </div>
        <div className="sidebar-brand">
          <h1>SmartCCTV</h1>
          <span>Control Center</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((section) => (
          <div key={section.section}>
            <div className="nav-section-label">{section.section}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <item.icon />
                <span className="nav-link-label">{item.label}</span>
                {item.badgeKey === 'pending' && pendingReviews > 0 && (
                  <span className="nav-badge">{pendingReviews}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="user-info">
        <div className="user-avatar">EL</div>
        <div className="user-details">
          <div className="user-name">ELRAMSESY</div>
          <div className="user-role">Operations Lead</div>
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-toggle" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
