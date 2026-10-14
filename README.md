# SmartCCTV Control Center — MVP

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An interactive, cloud-based **Smart CCTV Management Control Center MVP** designed for workplace physical security and spatial analytics. The platform bridges the gap between raw edge camera detections (YOLO, posture estimation, spatial counting) and customer-facing business policies, transforming computer vision data into structured events, configurable threshold policies, and auditable human-in-the-loop review workflows.

---

## 🏛️ System Architecture

```
┌──────────────────┐       ┌──────────────────────┐       ┌────────────────────────┐
│  IP / CCTV Cam   │ ───▶  │ Cloud AI Pipeline    │ ───▶  │ Structured Events      │
│  (Simulated Edge)│       │ (YOLO/Posture/Zones) │       │ (Confidence, Type, Z)  │
└──────────────────┘       └──────────────────────┘       └───────────┬────────────┘
                                                                      │
                                                                      ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     SmartCCTV Central Management Console                         │
│                                                                                  │
│   [ Overview Dashboard ]   [ Camera Management ]   [ Application Catalog ]       │
│   • Live occupancy chart   • Hardware specs & IP   • Smart Office (Active)       │
│   • Zone capacity bars     • Diagnostic modal      • Parking & Traffic (Roadmap) │
│   • Critical telemetry     • Status telemetry                                    │
│                                                                                  │
│   [ Smart Office Config ]  [ Event Review Center ] [ Immutable Audit Trail ]     │
│   • Policy enforcement     • Multi-filter triage   • Chronological log           │
│   • AI capabilities        • Confidence score bars • Actor identity tracking     │
│   • Alerting rules         • Confirm / False +     • State transition diffs      │
│                                                                                  │
│                     ┌──────────────────────────────────┐                         │
│                     │ Persistent State Store           │                         │
│                     │ (Preserves Demo Across Sessions) │                         │
│                     └──────────────────────────────────┘                         │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

### Local Installation & Development

```bash
# 1. Clone the repository
git clone https://github.com/m-elramsesy/SmartCCTV_ControlPage_MVP.git
cd SmartCCTV_ControlPage_MVP

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The application will launch on your local development server (typically `http://localhost:5173`).

To specify a custom port:
```bash
npm run dev -- --port 3000
```

### Production Build & Preview

```bash
# Compile TypeScript and bundle for production
npm run build

# Preview the production build locally
npm run preview
```

---

## ☁️ Deployment

### Deploying to Vercel

This repository is optimized for zero-configuration deployment on [Vercel](https://vercel.com):

1. **Via Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel --prod
   ```
2. **Via Vercel Web Dashboard**:
   - Import your repository `SmartCCTV_ControlPage_MVP`.
   - Framework Preset: **Vite**.
   - Build Command: `npm run build` (or `vite build`).
   - Output Directory: `dist`.
   - Click **Deploy**.

---

## ✨ Core Workflows & Capabilities

### 1. Operations Overview Dashboard (`/`)
- **Key Performance Indicators**: Total registered cameras, online/offline breakdown, real-time occupancy vs. rated facility capacity, events detected today, and events awaiting review.
- **Occupancy Trend Visualizer**: Hourly telemetry comparison graph plotting live office occupancy against building capacity limit.
- **Camera Health Status**: Real-time operational status (Online / Offline) with visual indicators.
- **Zone Occupancy**: Live capacity tracking across all monitored zones (Lobby, Open Workspace, Conference Rooms, Break Rooms).

### 2. Camera Infrastructure Management (`/cameras`)
- Fictional camera directory across corporate zones (`CAM-001` through `CAM-004`).
- Comprehensive metadata: IP address, hardware model, installation date, last-seen timestamp, and assigned application.
- **Diagnostic Inspection Modal**: Detailed camera telemetry modal with connection status indicators and diagnostic notices for offline hardware.

### 3. Smart Office Policy & AI Configuration (`/config`)
- **General Settings**: Facility name, timezone configuration, operating schedules, and camera binding.
- **Workplace Policies**:
  - Smoking Policy (*Allowed*, *Forbidden*, *Restricted to Designated Zones*).
  - Phone Usage Policy (*Allowed*, *Breaks Only*, *Forbidden in Work Zones*, *Zone-Based*).
  - Restricted Zones authorization enforcement.
  - Per-zone maximum occupancy thresholds.
- **AI Analytics Capabilities**: Independent toggles for People Counting, Occupancy Monitoring, Smoking Detection, Phone Usage Detection, and Restricted-Zone Entry.
- **Notification Preferences**: Selective alerting triggers and granular selection of event types that mandate human review.
- **State Management**: Client validation, "Reset to Demo Defaults", reactive updates, and automatic audit entry generation.

### 4. Event Triage & Human-in-the-Loop Review (`/events`)
- **Telemetry Table**: Event ID, timestamp, camera, zone, event type, AI confidence meter, and review badge.
- **Multi-Parameter Filtering**: Full-text keyword search across camera names, IDs, and zones; filter by event type; filter by review status.
- **Human Verification Modal**:
  - Decision pathways: **Confirm Event**, **Mark as False Positive**, or **Needs Further Review**.
  - Optional reviewer justification note.
  - Preserves original raw AI detection data and confidence score (human review never overwrites raw model outputs).
  - Synchronous recalculation of dashboard KPIs and pending review badges.

### 5. Application Catalog (`/applications`)
- Demonstrates platform extensibility beyond Smart Office:
  - **Smart Office**: Marked **Available** with direct routing to active configuration.
  - **Smart Parking**: Marked **Coming Soon** (license plate recognition, parking stall availability).
  - **Smart Traffic**: Marked **Coming Soon** (vehicle counting, congestion analytics).

### 6. Audit Trail (`/audit`)
- Immutable log recording all administrative modifications, policy changes, and human event review decisions.
- Tracks timestamp, action type, affected entity, previous value, new value, and responsible actor (`ELRAMSESY`).

---

## 🔬 Prototype Scope & Operational Context

1. **Simulated Video Stream**: To maintain lightweight execution suitable for rapid demonstration, cameras use simulated telemetry rather than heavy live RTSP/WebRTC video pipelines.
2. **Deterministic AI Detections**: Detection events, confidence scores, and posture flags are generated from a consistent mock dataset rather than a live GPU server.
3. **Client-Side Persistence**: State is stored in browser `localStorage`. In enterprise deployment, this is replaced by a backend REST API with PostgreSQL/MongoDB and Redis caching.
4. **Privacy-Preserving Design**: The system does not perform facial recognition or biometric identification; all occupancy and event detections are tracked anonymously.

---

## 🎓 Evaluator Demonstration Scenario (5-Minute Walkthrough)

When demonstrating the prototype to evaluators or supervisors:

1. **Platform Introduction (1 min)**:
   - Navigate to the **Overview Dashboard**.
   - Explain the core architecture: An extensible AI operating system that decouples camera hardware from modular computer vision applications.
   - Point out the real-time KPIs: 4 registered cameras (3 online, 1 offline), occupancy trend graph, and the pending events badge in the sidebar.
2. **Workplace Policy Configuration (1.5 min)**:
   - Navigate to **Smart Office** in the sidebar.
   - Change the **Phone Usage Policy** from *Breaks Only* to *Forbidden in Work Zones*.
   - Adjust the **Open Workspace** maximum capacity from `40` to `35`.
   - Click **Save Configuration** and observe the confirmation toast and updated timestamp.
3. **Human-in-the-Loop Event Triage (1.5 min)**:
   - Navigate to **Events** in the sidebar.
   - Filter by status `Pending`.
   - Click **Review** on `EVT-1002` (Break Room potential smoking event, 78% confidence).
   - Enter a reviewer note: *"Inspected clip; employee holding pen, no smoke detected."*
   - Click **Mark as False Positive**.
   - Verify that the status updates immediately, the pending badge count decrements, and the raw AI confidence score remains intact.
4. **Audit Trail Verification (1 min)**:
   - Open the **Audit Log**.
   - Confirm that both the policy modification and the event review were recorded with timestamps, before/after values, and the actor name (`ELRAMSESY`).
   - Refresh the browser to demonstrate that all state changes persist across reloads.
   - Open the **Application Catalog** to demonstrate platform readiness for future AI modules (Smart Parking and Smart Traffic).
