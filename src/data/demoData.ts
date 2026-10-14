import type {
  Camera,
  Zone,
  Application,
  SmartOfficeConfig,
  DetectionEvent,
  AuditEntry,
  OccupancyDataPoint,
} from '../types';

// ── Cameras ─────────────────────────────────────────────────
export const DEFAULT_CAMERAS: Camera[] = [
  {
    id: 'CAM-001',
    name: 'Main Entrance Camera',
    zone: 'Entrance Lobby',
    status: 'online',
    assignedApplication: 'smart-office',
    ipAddress: '192.168.1.101',
    model: 'Axis P3265-LVE',
    lastSeen: '2026-10-14T01:50:00Z',
    installedDate: '2026-06-15',
  },
  {
    id: 'CAM-002',
    name: 'Open Workspace Camera',
    zone: 'Open Workspace',
    status: 'online',
    assignedApplication: 'smart-office',
    ipAddress: '192.168.1.102',
    model: 'Hikvision DS-2CD2347G2',
    lastSeen: '2026-10-14T01:52:00Z',
    installedDate: '2026-06-15',
  },
  {
    id: 'CAM-003',
    name: 'Conference Room A Camera',
    zone: 'Conference Room A',
    status: 'offline',
    assignedApplication: 'smart-office',
    ipAddress: '192.168.1.103',
    model: 'Dahua IPC-HDBW5442R',
    lastSeen: '2026-10-13T18:30:00Z',
    installedDate: '2026-07-01',
  },
  {
    id: 'CAM-004',
    name: 'Break Room Camera',
    zone: 'Break Room',
    status: 'online',
    assignedApplication: 'smart-office',
    ipAddress: '192.168.1.104',
    model: 'Axis M3077-PLVE',
    lastSeen: '2026-10-14T01:51:00Z',
    installedDate: '2026-08-10',
  },
];

// ── Zones ───────────────────────────────────────────────────
export const DEFAULT_ZONES: Zone[] = [
  {
    id: 'ZONE-01',
    name: 'Entrance Lobby',
    floor: '1st Floor',
    maxOccupancy: 15,
    currentOccupancy: 4,
    cameras: ['CAM-001'],
  },
  {
    id: 'ZONE-02',
    name: 'Open Workspace',
    floor: '2nd Floor',
    maxOccupancy: 40,
    currentOccupancy: 22,
    cameras: ['CAM-002'],
  },
  {
    id: 'ZONE-03',
    name: 'Conference Room A',
    floor: '2nd Floor',
    maxOccupancy: 12,
    currentOccupancy: 0,
    cameras: ['CAM-003'],
  },
  {
    id: 'ZONE-04',
    name: 'Break Room',
    floor: '1st Floor',
    maxOccupancy: 20,
    currentOccupancy: 6,
    cameras: ['CAM-004'],
  },
];

// ── Applications ────────────────────────────────────────────
export const DEFAULT_APPLICATIONS: Application[] = [
  {
    id: 'smart-office',
    name: 'Smart Office',
    description:
      'AI-powered office monitoring for occupancy tracking, workplace policy compliance, and space utilization analytics. Configure workplace rules and let the system detect potential violations.',
    status: 'available',
    icon: 'Building2',
    features: [
      'People Counting',
      'Occupancy Monitoring',
      'Smoking Detection',
      'Phone Usage Detection',
      'Restricted-Zone Alerts',
    ],
    category: 'Workplace',
  },
  {
    id: 'smart-parking',
    name: 'Smart Parking',
    description:
      'Automated parking space monitoring with real-time availability, license plate recognition, and parking violation detection for efficient lot management.',
    status: 'coming_soon',
    icon: 'Car',
    features: [
      'Space Availability',
      'License Plate Recognition',
      'Violation Detection',
      'Usage Analytics',
    ],
    category: 'Facilities',
  },
  {
    id: 'smart-traffic',
    name: 'Smart Traffic',
    description:
      'Intelligent traffic flow monitoring with vehicle counting, congestion detection, and intersection analytics for urban traffic management.',
    status: 'coming_soon',
    icon: 'TrafficCone',
    features: [
      'Vehicle Counting',
      'Congestion Detection',
      'Flow Analytics',
      'Incident Detection',
    ],
    category: 'Infrastructure',
  },
];

// ── Smart Office Configuration ──────────────────────────────
export const DEFAULT_SMART_OFFICE_CONFIG: SmartOfficeConfig = {
  id: 'config-001',
  siteName: 'Nexus Office — Main Building',
  assignedCameras: ['CAM-001', 'CAM-002', 'CAM-003', 'CAM-004'],
  operatingHoursStart: '08:00',
  operatingHoursEnd: '18:00',
  timezone: 'Asia/Riyadh',
  policies: {
    smokingPolicy: 'forbidden',
    phoneUsagePolicy: 'breaks_only',
    restrictedZonesEnabled: true,
    maxOccupancyPerZone: {
      'Entrance Lobby': 15,
      'Open Workspace': 40,
      'Conference Room A': 12,
      'Break Room': 20,
    },
  },
  analytics: {
    peopleCounting: true,
    occupancyMonitoring: true,
    smokingDetection: true,
    phoneUsageDetection: true,
    restrictedZoneDetection: false,
  },
  notifications: {
    occupancyAlerts: true,
    smokingAlerts: true,
    phoneUsageAlerts: true,
    restrictedZoneAlerts: false,
    requireReview: ['smoking_detected', 'phone_usage_detected', 'restricted_zone_entry'],
  },
  updatedAt: '2026-10-13T14:00:00Z',
  updatedBy: 'ELRAMSESY (Office Manager)',
};

// ── Detection Events ────────────────────────────────────────
export const DEFAULT_EVENTS: DetectionEvent[] = [
  {
    id: 'EVT-1001',
    timestamp: '2026-10-14T01:45:12Z',
    cameraId: 'CAM-002',
    cameraName: 'Open Workspace Camera',
    zone: 'Open Workspace',
    eventType: 'occupancy_threshold',
    confidence: 94,
    description:
      'Occupancy in Open Workspace estimated at 42 persons, exceeding the configured threshold of 40.',
    reviewStatus: 'confirmed',
    review: {
      reviewedBy: 'ELRAMSESY',
      reviewedAt: '2026-10-14T01:50:00Z',
      previousStatus: 'pending',
      newStatus: 'confirmed',
      note: 'Team event in progress — temporarily expected.',
    },
  },
  {
    id: 'EVT-1002',
    timestamp: '2026-10-14T01:30:05Z',
    cameraId: 'CAM-004',
    cameraName: 'Break Room Camera',
    zone: 'Break Room',
    eventType: 'smoking_detected',
    confidence: 78,
    description:
      'Potential smoking activity detected near the south window area. Detection based on gesture and object recognition.',
    reviewStatus: 'pending',
  },
  {
    id: 'EVT-1003',
    timestamp: '2026-10-14T00:15:30Z',
    cameraId: 'CAM-002',
    cameraName: 'Open Workspace Camera',
    zone: 'Open Workspace',
    eventType: 'phone_usage_detected',
    confidence: 85,
    description:
      'Phone usage detected at workstation cluster B during working hours. Detection based on object and posture recognition.',
    reviewStatus: 'false_positive',
    review: {
      reviewedBy: 'ELRAMSESY',
      reviewedAt: '2026-10-14T00:20:00Z',
      previousStatus: 'pending',
      newStatus: 'false_positive',
      note: 'Employee was using a calculator device, not a phone.',
    },
  },
  {
    id: 'EVT-1004',
    timestamp: '2026-10-13T23:45:18Z',
    cameraId: 'CAM-001',
    cameraName: 'Main Entrance Camera',
    zone: 'Entrance Lobby',
    eventType: 'restricted_zone_entry',
    confidence: 91,
    description:
      'Person detected in the restricted server room corridor after operating hours.',
    reviewStatus: 'needs_review',
  },
  {
    id: 'EVT-1005',
    timestamp: '2026-10-13T22:10:44Z',
    cameraId: 'CAM-002',
    cameraName: 'Open Workspace Camera',
    zone: 'Open Workspace',
    eventType: 'occupancy_threshold',
    confidence: 88,
    description:
      'Occupancy in Open Workspace briefly reached 41 persons during the evening shift change.',
    reviewStatus: 'confirmed',
    review: {
      reviewedBy: 'ELRAMSESY',
      reviewedAt: '2026-10-13T22:30:00Z',
      previousStatus: 'pending',
      newStatus: 'confirmed',
      note: 'Shift overlap caused temporary spike. Normal.',
    },
  },
  {
    id: 'EVT-1006',
    timestamp: '2026-10-13T16:55:22Z',
    cameraId: 'CAM-004',
    cameraName: 'Break Room Camera',
    zone: 'Break Room',
    eventType: 'smoking_detected',
    confidence: 62,
    description:
      'Low-confidence smoking detection near the vending area. May be vaping or a false positive.',
    reviewStatus: 'pending',
  },
  {
    id: 'EVT-1007',
    timestamp: '2026-10-13T14:20:11Z',
    cameraId: 'CAM-002',
    cameraName: 'Open Workspace Camera',
    zone: 'Open Workspace',
    eventType: 'phone_usage_detected',
    confidence: 72,
    description:
      'Extended phone usage detected at desk area near the north window.',
    reviewStatus: 'pending',
  },
  {
    id: 'EVT-1008',
    timestamp: '2026-10-13T11:05:33Z',
    cameraId: 'CAM-001',
    cameraName: 'Main Entrance Camera',
    zone: 'Entrance Lobby',
    eventType: 'occupancy_threshold',
    confidence: 96,
    description:
      'Morning rush: lobby occupancy estimated at 18 persons, exceeding the threshold of 15.',
    reviewStatus: 'confirmed',
    review: {
      reviewedBy: 'ELRAMSESY',
      reviewedAt: '2026-10-13T11:15:00Z',
      previousStatus: 'pending',
      newStatus: 'confirmed',
      note: 'Expected during morning arrival window.',
    },
  },
];

// ── Occupancy History (past 12 hours) ───────────────────────
export const DEFAULT_OCCUPANCY_HISTORY: OccupancyDataPoint[] = [
  { hour: '06:00', occupancy: 2, capacity: 87 },
  { hour: '07:00', occupancy: 8, capacity: 87 },
  { hour: '08:00', occupancy: 18, capacity: 87 },
  { hour: '09:00', occupancy: 35, capacity: 87 },
  { hour: '10:00', occupancy: 45, capacity: 87 },
  { hour: '11:00', occupancy: 52, capacity: 87 },
  { hour: '12:00', occupancy: 38, capacity: 87 },
  { hour: '13:00', occupancy: 48, capacity: 87 },
  { hour: '14:00', occupancy: 50, capacity: 87 },
  { hour: '15:00', occupancy: 44, capacity: 87 },
  { hour: '16:00', occupancy: 36, capacity: 87 },
  { hour: '17:00', occupancy: 20, capacity: 87 },
];

// ── Audit Entries (seed) ────────────────────────────────────
export const DEFAULT_AUDIT_LOG: AuditEntry[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-10-13T14:00:00Z',
    action: 'Configuration Updated',
    entity: 'SmartOfficeConfig',
    entityId: 'config-001',
    previousValue: 'Phone policy: allowed',
    newValue: 'Phone policy: breaks_only',
    actor: 'ELRAMSESY',
  },
  {
    id: 'AUD-002',
    timestamp: '2026-10-13T11:15:00Z',
    action: 'Event Reviewed',
    entity: 'DetectionEvent',
    entityId: 'EVT-1008',
    previousValue: 'Status: pending',
    newValue: 'Status: confirmed',
    actor: 'ELRAMSESY',
  },
  {
    id: 'AUD-003',
    timestamp: '2026-10-13T22:30:00Z',
    action: 'Event Reviewed',
    entity: 'DetectionEvent',
    entityId: 'EVT-1005',
    previousValue: 'Status: pending',
    newValue: 'Status: confirmed',
    actor: 'ELRAMSESY',
  },
  {
    id: 'AUD-004',
    timestamp: '2026-10-14T00:20:00Z',
    action: 'Event Reviewed',
    entity: 'DetectionEvent',
    entityId: 'EVT-1003',
    previousValue: 'Status: pending',
    newValue: 'Status: false_positive',
    actor: 'ELRAMSESY',
  },
  {
    id: 'AUD-005',
    timestamp: '2026-10-14T01:50:00Z',
    action: 'Event Reviewed',
    entity: 'DetectionEvent',
    entityId: 'EVT-1001',
    previousValue: 'Status: pending',
    newValue: 'Status: confirmed',
    actor: 'ELRAMSESY',
  },
];
