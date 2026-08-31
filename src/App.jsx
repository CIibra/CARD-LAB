import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { IssueProvider } from './context/IssueContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import BottomTabBar from './components/common/BottomTabBar';
import HomePage from './pages/HomePage';
import ValeursPage from './pages/ValeursPage';
import ContactPage from './pages/ContactPage';
import AboutMacPage from './pages/AboutMacPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProfilePage from './pages/ProfilePage';
import ResetPasswordPage from './pages/ResetPasswordPage';

export default function App() {
  return (
    <AuthProvider>
      <IssueProvider>
        <BrowserRouter>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', color: '#0f172a', backgroundColor: '#f8fafc' }}>
            <Navbar />
            <div className="app-content" style={{ flex: 1, paddingBottom: '24px' }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/valeurs" element={<ValeursPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/a-propos" element={<AboutMacPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/profil" element={<ProfilePage />} />
                <Route path="/reinitialiser-mot-de-passe" element={<ResetPasswordPage />} />
              </Routes>
            </div>
            <div className="site-footer">
              <Footer />
            </div>
            <BottomTabBar />
          </div>
        </BrowserRouter>
      </IssueProvider>
    </AuthProvider>
  );
}
