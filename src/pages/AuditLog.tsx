import {
  FileText,
  Clock,
  ArrowRight,
  User,
  Info,
} from 'lucide-react';
import type { AuditEntry } from '../types';

interface AuditLogProps {
  auditLog: AuditEntry[];
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function getActionColor(action: string): string {
  if (action.includes('Reviewed')) return 'var(--accent-green-text)';
  if (action.includes('Updated') || action.includes('Configuration')) return 'var(--accent-blue-text)';
  if (action.includes('Reset')) return 'var(--accent-amber-text)';
  return 'var(--text-secondary)';
}

export default function AuditLog({ auditLog }: AuditLogProps) {
  const sorted = [...auditLog].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Audit Log</h2>
        <p>Complete history of configuration changes and event reviews</p>
      </div>

      <div className="demo-banner">
        <Info size={14} />
        Audit entries are recorded automatically when configuration is saved or events are reviewed.
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Previous Value</th>
              <th>New Value</th>
              <th>Actor</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">
                    <FileText />
                    <span>No audit entries yet.</span>
                  </div>
                </td>
              </tr>
            ) : (
              sorted.map((entry) => (
                <tr key={entry.id}>
                  <td style={{ whiteSpace: 'nowrap', fontSize: 'var(--font-size-xs)' }}>
                    <Clock size={12} style={{ marginRight: 4, verticalAlign: 'middle', color: 'var(--text-tertiary)' }} />
                    {formatDateTime(entry.timestamp)}
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: 600,
                        color: getActionColor(entry.action),
                        fontSize: 'var(--font-size-sm)',
                      }}
                    >
                      {entry.action}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 'var(--font-size-sm)' }}>{entry.entity}</span>
                      <code style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                        {entry.entityId}
                      </code>
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      <span style={{
                        padding: '2px 8px',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-sm)',
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {entry.previousValue}
                      </span>
                      <ArrowRight size={12} style={{ flexShrink: 0 }} />
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        padding: '2px 8px',
                        background: 'var(--accent-blue-bg)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--accent-blue-text)',
                        fontFamily: 'var(--font-mono)',
                        display: 'inline-block',
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {entry.newValue}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-size-sm)' }}>
                      <User size={13} style={{ color: 'var(--text-tertiary)' }} />
                      {entry.actor}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
