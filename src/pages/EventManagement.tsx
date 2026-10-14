import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  Info,
  Clock,
  Camera,
  MapPin,
  Shield,
  Brain,
} from 'lucide-react';
import type { DetectionEvent, EventType, ReviewStatus } from '../types';
import { EVENT_TYPE_LABELS, REVIEW_STATUS_LABELS } from '../types';

interface EventManagementProps {
  events: DetectionEvent[];
  onReview: (eventId: string, status: ReviewStatus, note: string) => void;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function EventManagement({ events, onReview }: EventManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<EventType | ''>('');
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | ''>('');
  const [selectedEvent, setSelectedEvent] = useState<DetectionEvent | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [toast, setToast] = useState(false);

  const filteredEvents = useMemo(() => {
    let result = [...events].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.id.toLowerCase().includes(q) ||
          e.cameraName.toLowerCase().includes(q) ||
          e.zone.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }

    if (typeFilter) {
      result = result.filter((e) => e.eventType === typeFilter);
    }

    if (statusFilter) {
      result = result.filter((e) => e.reviewStatus === statusFilter);
    }

    return result;
  }, [events, searchQuery, typeFilter, statusFilter]);

  const handleReview = (status: ReviewStatus) => {
    if (!selectedEvent) return;
    onReview(selectedEvent.id, status, reviewNote);
    // Update the local selected event for immediate feedback
    setSelectedEvent({
      ...selectedEvent,
      reviewStatus: status,
      review: {
        reviewedBy: 'ELRAMSESY',
        reviewedAt: new Date().toISOString(),
        previousStatus: selectedEvent.reviewStatus,
        newStatus: status,
        note: reviewNote,
      },
    });
    setReviewNote('');
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Event Management</h2>
        <p>Review and manage AI-detected events across all monitored zones</p>
      </div>

      <div className="demo-banner">
        <Info size={14} />
        All events are simulated. Confidence scores are illustrative — no real AI model is running.
      </div>

      {/* ── Filter Bar ── */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search />
          <input
            className="form-input"
            placeholder="Search by camera, event ID, or zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as EventType | '')}
          style={{ minWidth: 200 }}
        >
          <option value="">All Event Types</option>
          <option value="occupancy_threshold">Occupancy Threshold</option>
          <option value="smoking_detected">Smoking Detected</option>
          <option value="phone_usage_detected">Phone Usage</option>
          <option value="restricted_zone_entry">Restricted Zone</option>
        </select>

        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ReviewStatus | '')}
          style={{ minWidth: 170 }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="false_positive">False Positive</option>
          <option value="needs_review">Needs Review</option>
        </select>

        {(searchQuery || typeFilter || statusFilter) && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('');
              setStatusFilter('');
            }}
          >
            <X size={14} />
            Clear Filters
          </button>
        )}

        <span style={{ marginLeft: 'auto', fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
          {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Event Table ── */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Timestamp</th>
              <th>Camera</th>
              <th>Zone</th>
              <th>Event Type</th>
              <th>Confidence</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="empty-state">
                    <Filter />
                    <span>No events match the current filters.</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredEvents.map((evt) => (
                <tr key={evt.id}>
                  <td>
                    <code style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                      {evt.id}
                    </code>
                  </td>
                  <td style={{ whiteSpace: 'nowrap', fontSize: 'var(--font-size-xs)' }}>
                    <Clock size={12} style={{ marginRight: 4, verticalAlign: 'middle', color: 'var(--text-tertiary)' }} />
                    {formatDateTime(evt.timestamp)}
                  </td>
                  <td>{evt.cameraName}</td>
                  <td>{evt.zone}</td>
                  <td>
                    <span className={`event-type-tag event-type-${evt.eventType}`}>
                      {EVENT_TYPE_LABELS[evt.eventType]}
                    </span>
                  </td>
                  <td>
                    <div className="confidence-bar">
                      <div className="confidence-track">
                        <div
                          className={`confidence-fill ${
                            evt.confidence >= 80 ? 'high' : evt.confidence >= 60 ? 'medium' : 'low'
                          }`}
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
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setSelectedEvent(evt);
                        setReviewNote('');
                      }}
                    >
                      <Eye size={14} />
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Event Detail / Review Modal ── */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: 650 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Event Details — {selectedEvent.id}</h3>
              <button className="btn btn-icon btn-ghost" onClick={() => setSelectedEvent(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              {/* Event summary */}
              <div
                style={{
                  padding: 'var(--spacing-lg)',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--spacing-xl)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                  <span className={`event-type-tag event-type-${selectedEvent.eventType}`}>
                    {EVENT_TYPE_LABELS[selectedEvent.eventType]}
                  </span>
                  <span className={`badge badge-${selectedEvent.reviewStatus}`}>
                    {REVIEW_STATUS_LABELS[selectedEvent.reviewStatus]}
                  </span>
                </div>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {selectedEvent.description}
                </p>
              </div>

              {/* Details grid */}
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">
                    <Clock size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    Timestamp
                  </span>
                  <span className="detail-value">{formatDateTime(selectedEvent.timestamp)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">
                    <Camera size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    Camera
                  </span>
                  <span className="detail-value">{selectedEvent.cameraName} ({selectedEvent.cameraId})</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">
                    <MapPin size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    Zone
                  </span>
                  <span className="detail-value">{selectedEvent.zone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">
                    <Brain size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    AI Confidence
                  </span>
                  <span className="detail-value">
                    <div className="confidence-bar">
                      <div className="confidence-track" style={{ width: 80 }}>
                        <div
                          className={`confidence-fill ${
                            selectedEvent.confidence >= 80
                              ? 'high'
                              : selectedEvent.confidence >= 60
                              ? 'medium'
                              : 'low'
                          }`}
                          style={{ width: `${selectedEvent.confidence}%` }}
                        />
                      </div>
                      <span className="confidence-value">{selectedEvent.confidence}%</span>
                    </div>
                  </span>
                </div>
              </div>

              {/* Previous review info */}
              {selectedEvent.review && (
                <div
                  style={{
                    marginTop: 'var(--spacing-xl)',
                    padding: 'var(--spacing-lg)',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                    <Shield size={14} style={{ color: 'var(--accent-blue-text)' }} />
                    Review History
                  </div>
                  <div className="detail-list">
                    <div className="detail-item">
                      <span className="detail-label">Reviewed by</span>
                      <span className="detail-value">{selectedEvent.review.reviewedBy}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Reviewed at</span>
                      <span className="detail-value">{formatDateTime(selectedEvent.review.reviewedAt)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Decision</span>
                      <span className="detail-value">
                        <span className={`badge badge-${selectedEvent.review.newStatus}`}>
                          {REVIEW_STATUS_LABELS[selectedEvent.review.newStatus]}
                        </span>
                      </span>
                    </div>
                    {selectedEvent.review.note && (
                      <div className="detail-item">
                        <span className="detail-label">Note</span>
                        <span className="detail-value">{selectedEvent.review.note}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Review actions */}
              <hr className="section-divider" />
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--spacing-sm)' }}>
                  <MessageSquare size={14} />
                  Reviewer Note (optional)
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Add a note about this event..."
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                <button
                  className="btn"
                  onClick={() => handleReview('confirmed')}
                  style={{ background: 'var(--accent-green)', borderColor: '#059669', color: '#090b10', fontWeight: 700 }}
                >
                  <CheckCircle size={16} />
                  Confirm Event
                </button>
                <button className="btn btn-danger" onClick={() => handleReview('false_positive')}>
                  <XCircle size={16} />
                  Mark as False Positive
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleReview('needs_review')}
                  style={{ color: 'var(--accent-purple-text)', borderColor: 'rgba(129, 140, 248, 0.35)', background: 'var(--accent-purple-bg)' }}
                >
                  <AlertCircle size={16} />
                  Needs Further Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="toast">
          <CheckCircle />
          Event review saved successfully
        </div>
      )}
    </div>
  );
}
