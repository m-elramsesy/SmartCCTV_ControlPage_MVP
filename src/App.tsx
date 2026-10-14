import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CameraManagement from './pages/CameraManagement';
import SmartOfficeConfigPage from './pages/SmartOfficeConfig';
import EventManagement from './pages/EventManagement';
import ApplicationCatalog from './pages/ApplicationCatalog';
import AuditLog from './pages/AuditLog';
import { useAppStore } from './store/useAppStore';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const store = useAppStore();

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((p) => !p)}
          pendingReviews={store.stats.pendingReviews}
        />
        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  cameras={store.cameras}
                  events={store.events}
                  zones={store.zones}
                  stats={store.stats}
                />
              }
            />
            <Route
              path="/cameras"
              element={<CameraManagement cameras={store.cameras} />}
            />
            <Route
              path="/config"
              element={
                <SmartOfficeConfigPage
                  config={store.config}
                  cameras={store.cameras}
                  onSave={store.updateConfig}
                  onReset={store.resetToDefaults}
                />
              }
            />
            <Route
              path="/events"
              element={
                <EventManagement
                  events={store.events}
                  onReview={store.reviewEvent}
                />
              }
            />
            <Route path="/applications" element={<ApplicationCatalog />} />
            <Route
              path="/audit"
              element={<AuditLog auditLog={store.auditLog} />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
