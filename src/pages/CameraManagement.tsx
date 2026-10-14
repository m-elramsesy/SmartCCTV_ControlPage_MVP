import { useState } from 'react';
import {
  Camera as CameraIcon,
  Wifi,
  WifiOff,
  MapPin,
  Clock,
  X,
  Eye,
  Info,
  Monitor,
  Calendar,
  Hash,
} from 'lucide-react';
import type { Camera } from '../types';

interface CameraManagementProps {
  cameras: Camera[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CameraManagement({ cameras }: CameraManagementProps) {
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Camera Management</h2>
        <p>Manage and monitor all registered cameras across the facility</p>
      </div>

      <div className="demo-banner">
        <Info size={14} />
        Simulated camera records — no real camera streams are connected in this prototype.
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Camera</th>
              <th>ID</th>
              <th>Zone</th>
              <th>Status</th>
              <th>Application</th>
              <th>Last Seen</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cameras.map((cam) => (
              <tr key={cam.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--radius-md)',
                        background: cam.status === 'online' ? 'var(--accent-green-bg)' : 'var(--accent-red-bg)',
                        border: `1px solid ${cam.status === 'online' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CameraIcon
                        size={16}
                        style={{
                          color: cam.status === 'online' ? 'var(--accent-green-text)' : 'var(--accent-red-text)',
                        }}
                      />
                    </div>
                    <span style={{ fontWeight: 600 }}>{cam.name}</span>
                  </div>
                </td>
                <td>
                  <code style={{ fontSize: 'var(--font-size-xs)', color: 'var(--accent-blue-text)', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4 }}>
                    {cam.id}
                  </code>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={13} style={{ color: 'var(--text-tertiary)' }} />
                    {cam.zone}
                  </div>
                </td>
                <td>
                  <span className={`badge badge-${cam.status}`}>
                    <span className="badge-dot" />
                    {cam.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </td>
                <td>
                  {cam.assignedApplication ? (
                    <span style={{ color: 'var(--accent-blue-text)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)' }}>Smart Office</span>
                  ) : (
                    <span style={{ color: 'var(--text-tertiary)' }}>Unassigned</span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                    <Clock size={12} />
                    {formatDate(cam.lastSeen)}
                  </div>
                </td>
                <td>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setSelectedCamera(cam)}
                  >
                    <Eye size={14} />
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Camera Detail Modal ── */}
      {selectedCamera && (
        <div className="modal-overlay" onClick={() => setSelectedCamera(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Camera Details</h3>
              <button className="btn btn-icon btn-ghost" onClick={() => setSelectedCamera(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-lg)',
                  marginBottom: 'var(--spacing-xl)',
                  padding: 'var(--spacing-lg)',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 'var(--radius-lg)',
                    background:
                      selectedCamera.status === 'online'
                        ? 'var(--accent-green-bg)'
                        : 'var(--accent-red-bg)',
                    border: `1px solid ${selectedCamera.status === 'online' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selectedCamera.status === 'online' ? (
                    <Wifi size={24} style={{ color: 'var(--accent-green-text)' }} />
                  ) : (
                    <WifiOff size={24} style={{ color: 'var(--accent-red-text)' }} />
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 2 }}>
                    {selectedCamera.name}
                  </h3>
                  <span className={`badge badge-${selectedCamera.status}`}>
                    <span className="badge-dot" />
                    {selectedCamera.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">
                    <Hash size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    Camera ID
                  </span>
                  <span className="detail-value">{selectedCamera.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">
                    <MapPin size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    Zone
                  </span>
                  <span className="detail-value">{selectedCamera.zone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">
                    <Monitor size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    Model
                  </span>
                  <span className="detail-value">{selectedCamera.model}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">IP Address</span>
                  <span className="detail-value">
                    <code style={{ color: 'var(--accent-cyan)' }}>{selectedCamera.ipAddress}</code>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">
                    <Calendar size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    Installed
                  </span>
                  <span className="detail-value">{selectedCamera.installedDate}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">
                    <Clock size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    Last Seen
                  </span>
                  <span className="detail-value">{formatDate(selectedCamera.lastSeen)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Application</span>
                  <span className="detail-value">
                    {selectedCamera.assignedApplication ? 'Smart Office' : 'None'}
                  </span>
                </div>
              </div>

              {selectedCamera.status === 'offline' && (
                <div
                  style={{
                    marginTop: 'var(--spacing-lg)',
                    padding: 'var(--spacing-md) var(--spacing-lg)',
                    background: 'var(--accent-red-bg)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--accent-red)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <WifiOff size={14} />
                  Camera is offline since {formatDate(selectedCamera.lastSeen)}. This may indicate a
                  network or hardware issue.
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedCamera(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
