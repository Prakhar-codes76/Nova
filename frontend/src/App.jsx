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

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';

import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { TimetablePage } from './pages/TimetablePage';
import { AIChatPage } from './pages/AIChatPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { FocusPage } from './pages/FocusPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProfilePage } from './pages/ProfilePage';

function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="cinematic-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Loading Nova...</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Authenticating user context</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
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
          <Route path="/profile-setup" element={<ProfileSetupPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="/ai-chat" element={<AIChatPage />} />
          <Route path="/study-planner" element={<StudyPlannerPage />} />
          <Route path="/focus" element={<FocusPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <VoiceAgentModal />
      <Toast />
    </div>
  );
}

export function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // Show splash screen on first app load per session
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

