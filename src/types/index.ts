// ── Camera ──────────────────────────────────────────────────
export type CameraStatus = 'online' | 'offline';

export interface Camera {
  id: string;
  name: string;
  zone: string;
  status: CameraStatus;
  assignedApplication: string | null;
  ipAddress: string;
  model: string;
  lastSeen: string; // ISO timestamp
  installedDate: string;
}

// ── Zones ───────────────────────────────────────────────────
export interface Zone {
  id: string;
  name: string;
  floor: string;
  maxOccupancy: number;
  currentOccupancy: number;
  cameras: string[]; // camera IDs
}

// ── Applications ────────────────────────────────────────────
export type ApplicationStatus = 'available' | 'coming_soon';

export interface Application {
  id: string;
  name: string;
  description: string;
  status: ApplicationStatus;
  icon: string;
  features: string[];
  category: string;
}

// ── Smart Office Configuration ──────────────────────────────
export type SmokingPolicy = 'allowed' | 'forbidden' | 'designated_zones';
export type PhonePolicy = 'allowed' | 'breaks_only' | 'forbidden_work_zones' | 'zone_based';

export interface WorkplacePolicies {
  smokingPolicy: SmokingPolicy;
  phoneUsagePolicy: PhonePolicy;
  restrictedZonesEnabled: boolean;
  maxOccupancyPerZone: Record<string, number>;
}

export interface AnalyticsConfig {
  peopleCounting: boolean;
  occupancyMonitoring: boolean;
  smokingDetection: boolean;
  phoneUsageDetection: boolean;
  restrictedZoneDetection: boolean;
}

export interface NotificationConfig {
  occupancyAlerts: boolean;
  smokingAlerts: boolean;
  phoneUsageAlerts: boolean;
  restrictedZoneAlerts: boolean;
  requireReview: string[]; // event types requiring review
}

export interface SmartOfficeConfig {
  id: string;
  siteName: string;
  assignedCameras: string[];
  operatingHoursStart: string;
  operatingHoursEnd: string;
  timezone: string;
  policies: WorkplacePolicies;
  analytics: AnalyticsConfig;
  notifications: NotificationConfig;
  updatedAt: string;
  updatedBy: string;
}

// ── Detection Events ────────────────────────────────────────
export type EventType =
  | 'occupancy_threshold'
  | 'smoking_detected'
  | 'phone_usage_detected'
  | 'restricted_zone_entry';

export type ReviewStatus = 'pending' | 'confirmed' | 'false_positive' | 'needs_review';

export interface DetectionEvent {
  id: string;
  timestamp: string;
  cameraId: string;
  cameraName: string;
  zone: string;
  eventType: EventType;
  confidence: number; // 0-100
  description: string;
  reviewStatus: ReviewStatus;
  review?: EventReview;
  metadata?: Record<string, unknown>;
}

export interface EventReview {
  reviewedBy: string;
  reviewedAt: string;
  previousStatus: ReviewStatus;
  newStatus: ReviewStatus;
  note: string;
}

// ── Audit Log ───────────────────────────────────────────────
export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  entity: string;
  entityId: string;
  previousValue: string;
  newValue: string;
  actor: string;
}

// ── Occupancy History ───────────────────────────────────────
export interface OccupancyDataPoint {
  hour: string;
  occupancy: number;
  capacity: number;
}

// ── Event type labels ───────────────────────────────────────
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  occupancy_threshold: 'Occupancy Threshold Exceeded',
  smoking_detected: 'Potential Smoking Detected',
  phone_usage_detected: 'Potential Phone Usage Detected',
  restricted_zone_entry: 'Restricted-Zone Entry',
};

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: 'Pending Review',
  confirmed: 'Confirmed',
  false_positive: 'False Positive',
  needs_review: 'Needs Review',
};
