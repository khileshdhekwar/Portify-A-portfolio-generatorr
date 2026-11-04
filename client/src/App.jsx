import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import EditorPage from './pages/EditorPage';
import PublicPortfolioPage from './pages/PublicPortfolioPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        {/* Public Landing & Marketing */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <main className="flex-1">
                <HomePage />
              </main>
              <Footer />
            </>
          }
        />

        {/* Auth Pages */}
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <main className="flex-1">
                <LoginPage />
              </main>
              <Footer />
            </>
          }
        />

        <Route
          path="/register"
          element={
            <>
              <Navbar />
              <main className="flex-1">
                <RegisterPage />
              </main>
              <Footer />
            </>
          }
        />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navbar />
              <main className="flex-1">
                <DashboardPage />
              </main>
              <Footer />
            </ProtectedRoute>
          }
        />

        {/* Protected Upload Resume */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Navbar />
              <main className="flex-1">
                <UploadPage />
              </main>
              <Footer />
            </ProtectedRoute>
          }
        />

        {/* Protected Split-Screen Editor Studio */}
        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute>
              <Navbar />
              <main className="flex-1">
                <EditorPage />
              </main>
            </ProtectedRoute>
          }
        />

        {/* Public Portfolio View (Unique Slug) */}
        <Route path="/p/:slug" element={<PublicPortfolioPage />} />

        {/* 404 Catch-All */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <main className="flex-1">
                <NotFoundPage />
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}
