import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Car,
  TrafficCone,
  ArrowRight,
  Lock,
  Info,
} from 'lucide-react';
import { DEFAULT_APPLICATIONS } from '../data/demoData';

const ICON_MAP: Record<string, React.FC<{ size?: number; style?: React.CSSProperties }>> = {
  Building2,
  Car,
  TrafficCone,
};

const ICON_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  'smart-office': { bg: 'var(--accent-blue-bg)', color: 'var(--accent-blue-text)', border: 'rgba(56, 189, 248, 0.25)' },
  'smart-parking': { bg: 'var(--accent-green-bg)', color: 'var(--accent-green-text)', border: 'rgba(16, 185, 129, 0.25)' },
  'smart-traffic': { bg: 'var(--accent-amber-bg)', color: 'var(--accent-amber-text)', border: 'rgba(245, 158, 11, 0.25)' },
};

export default function ApplicationCatalog() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Application Catalog</h2>
        <p>Browse available AI-powered applications for your camera infrastructure</p>
      </div>

      <div className="demo-banner">
        <Info size={14} />
        Only Smart Office is available in this prototype. Other applications are planned for future releases.
      </div>

      <div className="catalog-grid">
        {DEFAULT_APPLICATIONS.map((app) => {
          const IconComponent = ICON_MAP[app.icon] || Building2;
          const colors = ICON_COLORS[app.id] || ICON_COLORS['smart-office'];
          const isAvailable = app.status === 'available';

          return (
            <div className="catalog-card" key={app.id}>
              <div className="catalog-card-header">
                <div className="catalog-icon" style={{ background: colors.bg, borderColor: colors.border }}>
                  <IconComponent size={24} style={{ color: colors.color }} />
                </div>
                <div>
                  <div className="catalog-card-title">{app.name}</div>
                  <span className={`badge badge-${app.status}`} style={{ marginTop: 4 }}>
                    {isAvailable ? 'Available' : 'Coming Soon'}
                  </span>
                </div>
              </div>

              <p className="catalog-card-desc">{app.description}</p>

              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Capabilities
              </div>
              <div className="catalog-features">
                {app.features.map((feat) => (
                  <span className="catalog-feature-tag" key={feat}>{feat}</span>
                ))}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-md)' }}>
                {isAvailable ? (
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => navigate('/config')}
                  >
                    Configure Application
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', cursor: 'not-allowed', opacity: 0.6 }}
                    disabled
                  >
                    <Lock size={14} />
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
