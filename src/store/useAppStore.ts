import { useState, useCallback, useEffect } from 'react';
import type {
  Camera,
  Zone,
  SmartOfficeConfig,
  DetectionEvent,
  AuditEntry,
  ReviewStatus,
  EventReview,
} from '../types';
import {
  DEFAULT_CAMERAS,
  DEFAULT_ZONES,
  DEFAULT_SMART_OFFICE_CONFIG,
  DEFAULT_EVENTS,
  DEFAULT_AUDIT_LOG,
} from '../data/demoData';

const STORAGE_KEYS = {
  cameras: 'smartcctv_cameras',
  zones: 'smartcctv_zones',
  config: 'smartcctv_config',
  events: 'smartcctv_events',
  audit: 'smartcctv_audit',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore parse errors
  }
  return fallback;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

export function useAppStore() {
  const [cameras] = useState<Camera[]>(() =>
    loadFromStorage(STORAGE_KEYS.cameras, DEFAULT_CAMERAS)
  );
  const [zones] = useState<Zone[]>(() =>
    loadFromStorage(STORAGE_KEYS.zones, DEFAULT_ZONES)
  );
  const [config, setConfig] = useState<SmartOfficeConfig>(() =>
    loadFromStorage(STORAGE_KEYS.config, DEFAULT_SMART_OFFICE_CONFIG)
  );
  const [events, setEvents] = useState<DetectionEvent[]>(() =>
    loadFromStorage(STORAGE_KEYS.events, DEFAULT_EVENTS)
  );
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(() =>
    loadFromStorage(STORAGE_KEYS.audit, DEFAULT_AUDIT_LOG)
  );

  // Persist on change
  useEffect(() => saveToStorage(STORAGE_KEYS.cameras, cameras), [cameras]);
  useEffect(() => saveToStorage(STORAGE_KEYS.zones, zones), [zones]);
  useEffect(() => saveToStorage(STORAGE_KEYS.config, config), [config]);
  useEffect(() => saveToStorage(STORAGE_KEYS.events, events), [events]);
  useEffect(() => saveToStorage(STORAGE_KEYS.audit, auditLog), [auditLog]);

  const addAuditEntry = useCallback(
    (entry: Omit<AuditEntry, 'id' | 'timestamp'>) => {
      const newEntry: AuditEntry = {
        ...entry,
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      setAuditLog((prev) => [newEntry, ...prev]);
    },
    []
  );

  const updateConfig = useCallback(
    (newConfig: SmartOfficeConfig) => {
      const updated = {
        ...newConfig,
        updatedAt: new Date().toISOString(),
      };
      setConfig(updated);
      addAuditEntry({
        action: 'Configuration Updated',
        entity: 'SmartOfficeConfig',
        entityId: updated.id,
        previousValue: `Updated from previous settings`,
        newValue: `Site: ${updated.siteName}, Updated at ${updated.updatedAt}`,
        actor: 'ELRAMSESY',
      });
    },
    [addAuditEntry]
  );

  const reviewEvent = useCallback(
    (
      eventId: string,
      newStatus: ReviewStatus,
      note: string
    ) => {
      setEvents((prev) =>
        prev.map((evt) => {
          if (evt.id !== eventId) return evt;
          const review: EventReview = {
            reviewedBy: 'ELRAMSESY',
            reviewedAt: new Date().toISOString(),
            previousStatus: evt.reviewStatus,
            newStatus,
            note,
          };
          return { ...evt, reviewStatus: newStatus, review };
        })
      );
      addAuditEntry({
        action: 'Event Reviewed',
        entity: 'DetectionEvent',
        entityId: eventId,
        previousValue: `Status: ${events.find((e) => e.id === eventId)?.reviewStatus ?? 'unknown'}`,
        newValue: `Status: ${newStatus}`,
        actor: 'ELRAMSESY',
      });
    },
    [addAuditEntry, events]
  );

  const resetToDefaults = useCallback(() => {
    setConfig(DEFAULT_SMART_OFFICE_CONFIG);
    setEvents(DEFAULT_EVENTS);
    setAuditLog(DEFAULT_AUDIT_LOG);
    addAuditEntry({
      action: 'Reset to Defaults',
      entity: 'System',
      entityId: 'all',
      previousValue: 'Custom settings',
      newValue: 'Demo defaults restored',
      actor: 'ELRAMSESY',
    });
  }, [addAuditEntry]);

  // Derived stats
  const stats = {
    totalCameras: cameras.length,
    onlineCameras: cameras.filter((c) => c.status === 'online').length,
    offlineCameras: cameras.filter((c) => c.status === 'offline').length,
    currentOccupancy: zones.reduce((sum, z) => sum + z.currentOccupancy, 0),
    totalCapacity: zones.reduce((sum, z) => sum + z.maxOccupancy, 0),
    totalEventsToday: events.filter((e) => {
      const eventDate = new Date(e.timestamp).toDateString();
      const today = new Date().toDateString();
      return eventDate === today;
    }).length,
    pendingReviews: events.filter(
      (e) => e.reviewStatus === 'pending' || e.reviewStatus === 'needs_review'
    ).length,
  };

  return {
    cameras,
    zones,
    config,
    events,
    auditLog,
    stats,
    updateConfig,
    reviewEvent,
    resetToDefaults,
    addAuditEntry,
  };
}
