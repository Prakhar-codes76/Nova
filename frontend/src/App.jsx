import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ConversationProvider } from '@elevenlabs/react';

import { Sidebar } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';
import { Toast } from './components/common/Toast';
import { VoiceAgentModal } from './components/voice/VoiceAgentModal';
import { SplashScreen } from './components/common/SplashScreen';
import { CinematicBackground } from './components/common/CinematicBackground';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';

import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { TimetablePage } from './pages/TimetablePage';
import { AIChatPage } from './pages/AIChatPage';
import { FocusPage } from './pages/FocusPage';
import { ProgressPage } from './pages/ProgressPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="status-dot-active" style={{ width: '14px', height: '14px', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Initialising NOVA...</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Authenticating user session & neural context</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <main className="main-content">
        <Navbar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile-setup" element={<ProfileSetupPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="/ai-chat" element={<AIChatPage />} />
          <Route path="/assistant" element={<AIChatPage />} />
          <Route path="/focus" element={<FocusPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/analytics" element={<ProgressPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      <VoiceAgentModal />
      <Toast />
    </div>
  );
}

export function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('nova_splash_seen');
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('nova_splash_seen', 'true');
    setShowSplash(false);
  };

  return (
    <AuthProvider>
      <AppProvider>
        <ConversationProvider>
          <CinematicBackground />
          {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
          <Router>
            <Routes>
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/*" element={<ProtectedLayout />} />
            </Routes>
          </Router>
        </ConversationProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
