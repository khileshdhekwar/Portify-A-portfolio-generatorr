import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import ThemeRenderer, { THEMES } from './components/themes/ThemeRenderer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';

const mockPortfolio = {
  theme: 'minimal-pro',
  title: 'Test Portfolio',
  personalInfo: {
    fullName: 'Jane Doe',
    headline: 'Senior Full Stack Engineer',
    email: 'jane@example.com',
    location: 'Seattle, WA',
  },
  summary: 'Passionate developer building resilient systems.',
  experience: [
    {
      role: 'Staff Engineer',
      company: 'CloudWorks',
      startDate: '2020',
      endDate: 'Present',
      current: true,
      highlights: ['Designed distributed cache layer.'],
    },
  ],
  education: [
    {
      degree: 'B.S.',
      fieldOfStudy: 'Computer Engineering',
      institution: 'University of Washington',
      graduationDate: '2019',
    },
  ],
  skills: [
    { category: 'Languages', items: ['TypeScript', 'Go', 'Rust'] },
  ],
  projects: [
    {
      title: 'Microservices Framework',
      description: 'Ultra-fast event bus in Go.',
      technologies: ['Go', 'gRPC'],
    },
  ],
};

describe('Portify AI Client Theme Suite', () => {
  it('should render all 5 themes cleanly without errors', () => {
    THEMES.forEach((themeItem) => {
      const themedPortfolio = { ...mockPortfolio, theme: themeItem.id };
      const { unmount } = render(
        <ThemeRenderer portfolio={themedPortfolio} qrCodeUrl="https://api.qrserver.com/test" />
      );
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText(/Senior Full Stack Engineer/i)).toBeInTheDocument();
      unmount();
    });
  });

  it('should render the HomePage with tagline and call to action', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Your Resume, Your Identity,/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Resume & Generate/i)).toBeInTheDocument();
  });

  it('should render the LoginPage with 1-click demo button', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Sign in to Portify AI/i)).toBeInTheDocument();
    expect(screen.getByText(/1-Click Demo Sign In/i)).toBeInTheDocument();
  });
});
