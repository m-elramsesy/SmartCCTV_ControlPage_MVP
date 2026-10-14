import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Wifi,
  WifiOff,
  Users,
  AlertTriangle,
  ClipboardCheck,
  Activity,
  Settings,
  Info,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Camera as CameraType, DetectionEvent, Zone } from '../types';
import { EVENT_TYPE_LABELS, REVIEW_STATUS_LABELS } from '../types';
import { DEFAULT_OCCUPANCY_HISTORY } from '../data/demoData';

interface DashboardProps {
  cameras: CameraType[];
  events: DetectionEvent[];
  zones: Zone[];
  stats: {
    totalCameras: number;
    onlineCameras: number;
    offlineCameras: number;
    currentOccupancy: number;
    totalCapacity: number;
    totalEventsToday: number;
    pendingReviews: number;
  };
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Dashboard({ cameras, events, zones, stats }: DashboardProps) {
  const navigate = useNavigate();
  const recentEvents = [...events]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h2>Overview Dashboard</h2>
            <p>Nexus Office — Real-time monitoring summary</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/config')}>
            <Settings size={16} />
            Configure Smart Office
          </button>
        </div>
      </div>

      <div className="demo-banner">
        <Info size={14} />
        Prototype mode — all data is simulated for demonstration purposes. No real cameras or AI models are connected.
      </div>

      {/* ── Stat Cards ── */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Cameras</span>
            <div className="stat-card-icon" style={{ background: 'var(--accent-blue-bg)', borderColor: 'rgba(56, 189, 248, 0.25)' }}>
              <Camera style={{ color: 'var(--accent-blue-text)' }} />
            </div>
          </div>
          <div className="stat-card-value">{stats.totalCameras}</div>
          <div className="stat-card-detail">
            {stats.onlineCameras} online · {stats.offlineCameras} offline
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Cameras Online</span>
            <div className="stat-card-icon" style={{ background: 'var(--accent-green-bg)', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
              <Wifi style={{ color: 'var(--accent-green-text)' }} />
            </div>
          </div>
          <div className="stat-card-value">{stats.onlineCameras}</div>
          <div className="stat-card-detail">
            {Math.round((stats.onlineCameras / stats.totalCameras) * 100)}% availability
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Current Occupancy</span>
            <div className="stat-card-icon" style={{ background: 'var(--accent-blue-bg)', borderColor: 'rgba(56, 189, 248, 0.25)' }}>
              <Users style={{ color: 'var(--accent-blue-text)' }} />
            </div>
          </div>
          <div className="stat-card-value">
            {stats.currentOccupancy}
            <span style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-tertiary)', fontWeight: 400 }}>
              {' '}
              / {stats.totalCapacity}
            </span>
          </div>
          <div className="stat-card-detail">
            {Math.round((stats.currentOccupancy / stats.totalCapacity) * 100)}% of total capacity
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Events Today</span>
            <div className="stat-card-icon" style={{ background: 'var(--accent-amber-bg)', borderColor: 'rgba(245, 158, 11, 0.25)' }}>
              <AlertTriangle style={{ color: 'var(--accent-amber-text)' }} />
            </div>
          </div>
          <div className="stat-card-value">{stats.totalEventsToday}</div>
          <div className="stat-card-detail">Detected by AI analytics</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Pending Reviews</span>
            <div
              className="stat-card-icon"
              style={{
                background: stats.pendingReviews > 0 ? 'var(--accent-red-bg)' : 'var(--accent-green-bg)',
                borderColor: stats.pendingReviews > 0 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)',
              }}
            >
              <ClipboardCheck
                style={{ color: stats.pendingReviews > 0 ? 'var(--accent-red-text)' : 'var(--accent-green-text)' }}
              />
            </div>
          </div>
          <div className="stat-card-value">{stats.pendingReviews}</div>
          <div className="stat-card-detail">
            {stats.pendingReviews > 0 ? 'Awaiting human review' : 'All events reviewed'}
          </div>
        </div>
      </div>

      {/* ── Occupancy Chart + Camera Status ── */}
      <div className="grid-2" style={{ marginBottom: 'var(--spacing-2xl)' }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Activity size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Occupancy Trend (Today)
            </span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEFAULT_OCCUPANCY_HISTORY}>
                <defs>
                  <linearGradient id="occGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="2 2"
                  stroke="#1c2434"
                  vertical={false}
                />
                <XAxis
                  dataKey="hour"
                  stroke="#64748b"
                  fontSize={11}
                  fontFamily="'JetBrains Mono', monospace"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  fontFamily="'JetBrains Mono', monospace"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0e121a',
                    border: '1px solid #273248',
                    borderRadius: 6,
                    fontSize: 12,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: '#f1f5f9',
                  }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area
                  type="monotone"
                  dataKey="capacity"
                  stroke="#334155"
                  strokeDasharray="4 4"
                  fill="none"
                  name="Capacity Limit"
                />
                <Area
                  type="monotone"
                  dataKey="occupancy"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fill="url(#occGradient)"
                  name="Live Occupancy"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Camera size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Camera Status
            </span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/cameras')}>
              View All
            </button>
          </div>
          <div className="detail-list">
            {cameras.map((cam) => (
              <div className="detail-item" key={cam.id}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{cam.name}</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                    {cam.zone} · {cam.id}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`badge badge-${cam.status}`}>
                    <span className="badge-dot" />
                    {cam.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                  {cam.status === 'online' ? (
                    <Wifi size={14} style={{ color: 'var(--accent-green)' }} />
                  ) : (
                    <WifiOff size={14} style={{ color: 'var(--accent-red)' }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Zone Occupancy ── */}
      <div className="card" style={{ marginBottom: 'var(--spacing-2xl)' }}>
        <div className="card-header">
          <span className="card-title">
            <Users size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Zone Occupancy
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--spacing-lg)' }}>
          {zones.map((zone) => {
            const pct = Math.round((zone.currentOccupancy / zone.maxOccupancy) * 100);
            const color = pct > 90 ? 'var(--accent-red)' : pct > 70 ? 'var(--accent-amber)' : 'var(--accent-green)';
            return (
              <div key={zone.id} style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-lg)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{zone.name}</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{zone.floor}</span>
                </div>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 4 }}>
                  {zone.currentOccupancy}
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)', fontWeight: 400 }}>
                    {' '}/ {zone.maxOccupancy}
                  </span>
                </div>
                <div style={{ height: 4, background: 'var(--border-primary)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 0.3s' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Recent Events ── */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <AlertTriangle size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Recent Events
          </span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/events')}>
            View All
          </button>
        </div>
        <div className="table-container" style={{ border: 'none', background: 'transparent' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Event Type</th>
                <th>Camera</th>
                <th>Zone</th>
                <th>Confidence</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((evt) => (
                <tr key={evt.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/events')}>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDateTime(evt.timestamp)}</td>
                  <td>
                    <span className={`event-type-tag event-type-${evt.eventType}`}>
                      {EVENT_TYPE_LABELS[evt.eventType]}
                    </span>
                  </td>
                  <td>{evt.cameraName}</td>
                  <td>{evt.zone}</td>
                  <td>
                    <div className="confidence-bar">
                      <div className="confidence-track">
                        <div
                          className={`confidence-fill ${evt.confidence >= 80 ? 'high' : evt.confidence >= 60 ? 'medium' : 'low'}`}
                          style={{ width: `${evt.confidence}%` }}
                        />
                      </div>
                      <span className="confidence-value">{evt.confidence}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${evt.reviewStatus}`}>
                      {REVIEW_STATUS_LABELS[evt.reviewStatus]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
