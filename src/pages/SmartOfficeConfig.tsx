import { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Shield,
  Brain,
  Bell,
  Save,
  RotateCcw,
  CheckCircle,
  Clock,
  Info,
} from 'lucide-react';
import type { SmartOfficeConfig, Camera } from '../types';
import { DEFAULT_SMART_OFFICE_CONFIG } from '../data/demoData';

interface SmartOfficeConfigPageProps {
  config: SmartOfficeConfig;
  cameras: Camera[];
  onSave: (config: SmartOfficeConfig) => void;
  onReset: () => void;
}

function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <div className="toggle-row">
      <div className="toggle-info">
        <span className="toggle-label">{label}</span>
        {description && <span className="toggle-desc">{description}</span>}
      </div>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className="toggle-slider" />
      </label>
    </div>
  );
}

export default function SmartOfficeConfigPage({
  config,
  cameras,
  onSave,
  onReset,
}: SmartOfficeConfigPageProps) {
  const [draft, setDraft] = useState<SmartOfficeConfig>(config);
  const [toast, setToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setDraft(config);
  }, [config]);

  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (!draft.siteName.trim()) errs.siteName = 'Site name is required';
    if (!draft.operatingHoursStart) errs.hoursStart = 'Start time is required';
    if (!draft.operatingHoursEnd) errs.hoursEnd = 'End time is required';
    if (draft.assignedCameras.length === 0) errs.cameras = 'At least one camera must be assigned';

    // Validate max occupancy values
    Object.entries(draft.policies.maxOccupancyPerZone).forEach(([zone, val]) => {
      if (val < 1 || val > 500) {
        errs[`occ-${zone}`] = `${zone}: must be 1–500`;
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [draft]);

  const handleSave = () => {
    if (!validate()) return;
    onSave(draft);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const handleReset = () => {
    setDraft(DEFAULT_SMART_OFFICE_CONFIG);
    onReset();
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const updatePolicies = (patch: Partial<SmartOfficeConfig['policies']>) => {
    setDraft((prev) => ({
      ...prev,
      policies: { ...prev.policies, ...patch },
    }));
  };

  const updateAnalytics = (patch: Partial<SmartOfficeConfig['analytics']>) => {
    setDraft((prev) => ({
      ...prev,
      analytics: { ...prev.analytics, ...patch },
    }));
  };

  const updateNotifications = (patch: Partial<SmartOfficeConfig['notifications']>) => {
    setDraft((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...patch },
    }));
  };

  const toggleCamera = (camId: string) => {
    setDraft((prev) => ({
      ...prev,
      assignedCameras: prev.assignedCameras.includes(camId)
        ? prev.assignedCameras.filter((c) => c !== camId)
        : [...prev.assignedCameras, camId],
    }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h2>Smart Office Configuration</h2>
            <p>Configure workplace policies, analytics, and notification preferences</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Clock size={14} style={{ color: 'var(--text-tertiary)' }} />
            <span className="config-meta">
              Last updated: {new Date(draft.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="demo-banner">
        <Info size={14} />
        Configuration is persisted in browser storage for demonstration. Changes will survive page refreshes.
      </div>

      {/* ── Section 1: General Settings ── */}
      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="form-section">
          <div className="form-section-title">
            <Building2 /> General Settings
          </div>
          <p className="form-section-desc">
            Basic site information, camera assignments, and operating schedule.
          </p>

          <div className="form-row" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div className="form-group">
              <label className="form-label">Site Name *</label>
              <input
                className="form-input"
                value={draft.siteName}
                onChange={(e) => setDraft((p) => ({ ...p, siteName: e.target.value }))}
                placeholder="e.g., Nexus Office — Main Building"
              />
              {errors.siteName && (
                <span style={{ color: 'var(--accent-red)', fontSize: 'var(--font-size-xs)' }}>
                  {errors.siteName}
                </span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Time Zone</label>
              <select
                className="form-select"
                value={draft.timezone}
                onChange={(e) => setDraft((p) => ({ ...p, timezone: e.target.value }))}
              >
                <option value="Asia/Riyadh">Asia/Riyadh (UTC+3)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (UTC-5)</option>
                <option value="Europe/London">Europe/London (UTC+0)</option>
                <option value="Asia/Dubai">Asia/Dubai (UTC+4)</option>
              </select>
            </div>
          </div>

          <div className="form-row" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div className="form-group">
              <label className="form-label">Operating Hours Start *</label>
              <input
                type="time"
                className="form-input"
                value={draft.operatingHoursStart}
                onChange={(e) => setDraft((p) => ({ ...p, operatingHoursStart: e.target.value }))}
              />
              {errors.hoursStart && (
                <span style={{ color: 'var(--accent-red-text)', fontSize: 'var(--font-size-xs)' }}>
                  {errors.hoursStart}
                </span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Operating Hours End *</label>
              <input
                type="time"
                className="form-input"
                value={draft.operatingHoursEnd}
                onChange={(e) => setDraft((p) => ({ ...p, operatingHoursEnd: e.target.value }))}
              />
              {errors.hoursEnd && (
                <span style={{ color: 'var(--accent-red-text)', fontSize: 'var(--font-size-xs)' }}>
                  {errors.hoursEnd}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Cameras *</label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 'var(--spacing-md)',
              }}
            >
              {cameras.map((cam) => (
                <label
                  key={cam.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-md) var(--spacing-lg)',
                    background: draft.assignedCameras.includes(cam.id) ? 'var(--accent-blue-bg)' : 'var(--bg-secondary)',
                    border: `1px solid ${draft.assignedCameras.includes(cam.id) ? 'rgba(56, 189, 248, 0.4)' : 'var(--border-primary)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={draft.assignedCameras.includes(cam.id)}
                    onChange={() => toggleCamera(cam.id)}
                    style={{ accentColor: 'var(--accent-blue)' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{cam.name}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                      {cam.zone} · {cam.id}
                    </div>
                  </div>
                  <span
                    className={`badge badge-${cam.status}`}
                    style={{ marginLeft: 'auto' }}
                  >
                    <span className="badge-dot" />
                    {cam.status}
                  </span>
                </label>
              ))}
            </div>
            {errors.cameras && (
              <span style={{ color: 'var(--accent-red-text)', fontSize: 'var(--font-size-xs)' }}>
                {errors.cameras}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Section 2: Workplace Policies ── */}
      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="form-section">
          <div className="form-section-title">
            <Shield /> Workplace Policies
          </div>
          <p className="form-section-desc">
            Define company-specific workplace rules. These policies determine which events the system flags for review.
          </p>

          <div className="form-row" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div className="form-group">
              <label className="form-label">Smoking Policy</label>
              <select
                className="form-select"
                value={draft.policies.smokingPolicy}
                onChange={(e) =>
                  updatePolicies({
                    smokingPolicy: e.target.value as SmartOfficeConfig['policies']['smokingPolicy'],
                  })
                }
              >
                <option value="allowed">Allowed</option>
                <option value="forbidden">Forbidden</option>
                <option value="designated_zones">Restricted to Designated Zones</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Usage Policy</label>
              <select
                className="form-select"
                value={draft.policies.phoneUsagePolicy}
                onChange={(e) =>
                  updatePolicies({
                    phoneUsagePolicy: e.target.value as SmartOfficeConfig['policies']['phoneUsagePolicy'],
                  })
                }
              >
                <option value="allowed">Allowed</option>
                <option value="breaks_only">Breaks Only</option>
                <option value="forbidden_work_zones">Forbidden in Work Zones</option>
                <option value="zone_based">Zone-Based</option>
              </select>
            </div>
          </div>

          <Toggle
            checked={draft.policies.restrictedZonesEnabled}
            onChange={(v) => updatePolicies({ restrictedZonesEnabled: v })}
            label="Enable Restricted Zones"
            description="Mark certain zones as restricted and alert on unauthorized entry."
          />

          <div style={{ marginTop: 'var(--spacing-xl)' }}>
            <label className="form-label" style={{ marginBottom: 'var(--spacing-md)' }}>
              Maximum Occupancy per Zone
            </label>
            <div className="form-row">
              {Object.entries(draft.policies.maxOccupancyPerZone).map(([zone, val]) => (
                <div className="form-group" key={zone}>
                  <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>
                    {zone}
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={val}
                    min={1}
                    max={500}
                    onChange={(e) => {
                      const num = parseInt(e.target.value) || 0;
                      updatePolicies({
                        maxOccupancyPerZone: {
                          ...draft.policies.maxOccupancyPerZone,
                          [zone]: num,
                        },
                      });
                    }}
                  />
                  {errors[`occ-${zone}`] && (
                    <span style={{ color: 'var(--accent-red-text)', fontSize: 'var(--font-size-xs)' }}>
                      {errors[`occ-${zone}`]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: AI Analytics ── */}
      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="form-section">
          <div className="form-section-title">
            <Brain /> AI Analytics Capabilities
          </div>
          <p className="form-section-desc">
            Enable or disable analytics features. Note: all detections in this prototype are simulated.
            Enabling a feature does not connect to a real AI model.
          </p>

          <Toggle
            checked={draft.analytics.peopleCounting}
            onChange={(v) => updateAnalytics({ peopleCounting: v })}
            label="People Counting"
            description="Count people entering and exiting monitored zones."
          />
          <Toggle
            checked={draft.analytics.occupancyMonitoring}
            onChange={(v) => updateAnalytics({ occupancyMonitoring: v })}
            label="Occupancy Monitoring"
            description="Track real-time zone occupancy against configured thresholds."
          />
          <Toggle
            checked={draft.analytics.smokingDetection}
            onChange={(v) => updateAnalytics({ smokingDetection: v })}
            label="Smoking Detection"
            description="Detect potential smoking activity using gesture and object recognition."
          />
          <Toggle
            checked={draft.analytics.phoneUsageDetection}
            onChange={(v) => updateAnalytics({ phoneUsageDetection: v })}
            label="Phone Usage Detection"
            description="Detect extended phone usage during working hours."
          />
          <Toggle
            checked={draft.analytics.restrictedZoneDetection}
            onChange={(v) => updateAnalytics({ restrictedZoneDetection: v })}
            label="Restricted-Zone Detection"
            description="Alert when a person enters a designated restricted zone. Requires restricted zones to be enabled."
            disabled={!draft.policies.restrictedZonesEnabled}
          />
        </div>
      </div>

      {/* ── Section 4: Notifications ── */}
      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="form-section">
          <div className="form-section-title">
            <Bell /> Notification Preferences
          </div>
          <p className="form-section-desc">
            Choose which event types generate alerts and which should require manual review.
          </p>

          <Toggle
            checked={draft.notifications.occupancyAlerts}
            onChange={(v) => updateNotifications({ occupancyAlerts: v })}
            label="Occupancy Threshold Alerts"
            description="Notify when a zone exceeds its configured maximum occupancy."
          />
          <Toggle
            checked={draft.notifications.smokingAlerts}
            onChange={(v) => updateNotifications({ smokingAlerts: v })}
            label="Smoking Detection Alerts"
            description="Notify when potential smoking activity is detected."
          />
          <Toggle
            checked={draft.notifications.phoneUsageAlerts}
            onChange={(v) => updateNotifications({ phoneUsageAlerts: v })}
            label="Phone Usage Alerts"
            description="Notify when extended phone usage is detected during restricted times."
          />
          <Toggle
            checked={draft.notifications.restrictedZoneAlerts}
            onChange={(v) => updateNotifications({ restrictedZoneAlerts: v })}
            label="Restricted-Zone Entry Alerts"
            description="Notify when a person enters a restricted zone."
          />

          <hr className="section-divider" />

          <label className="form-label" style={{ marginBottom: 'var(--spacing-md)' }}>
            Events Requiring Human Review
          </label>
          <p className="form-section-desc" style={{ marginBottom: 'var(--spacing-md)' }}>
            Selected event types will be flagged as "Pending Review" and require manual confirmation.
          </p>

          {[
            { value: 'smoking_detected', label: 'Smoking Detected' },
            { value: 'phone_usage_detected', label: 'Phone Usage Detected' },
            { value: 'restricted_zone_entry', label: 'Restricted-Zone Entry' },
            { value: 'occupancy_threshold', label: 'Occupancy Threshold' },
          ].map((item) => (
            <label
              key={item.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-md)',
                padding: 'var(--spacing-sm) 0',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              <input
                type="checkbox"
                checked={draft.notifications.requireReview.includes(item.value)}
                onChange={(e) => {
                  updateNotifications({
                    requireReview: e.target.checked
                      ? [...draft.notifications.requireReview, item.value]
                      : draft.notifications.requireReview.filter((r) => r !== item.value),
                  });
                }}
                style={{ accentColor: 'var(--accent-blue)' }}
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      {/* ── Save / Reset Actions ── */}
      <div className="config-actions">
        <div className="config-meta">
          Updated by: {draft.updatedBy}
        </div>
        <div className="config-actions-right">
          <button className="btn btn-danger" onClick={handleReset}>
            <RotateCcw size={16} />
            Reset to Defaults
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} />
            Save Configuration
          </button>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className="toast">
          <CheckCircle />
          Configuration saved successfully
        </div>
      )}
    </div>
  );
}
