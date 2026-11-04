import React from 'react';
import MinimalProTheme from './MinimalProTheme';
import DarkDeveloperTheme from './DarkDeveloperTheme';
import CreativeGradientTheme from './CreativeGradientTheme';
import CorporateEliteTheme from './CorporateEliteTheme';
import ModernGlassTheme from './ModernGlassTheme';

export const THEMES = [
  { id: 'minimal-pro', name: 'Minimal Pro', description: 'Editorial typography, generous whitespace, clean slate aesthetic' },
  { id: 'dark-developer', name: 'Dark Developer', description: 'Terminal header, code-like branch tree, developer aesthetics' },
  { id: 'creative-gradient', name: 'Creative Gradient', description: 'Restrained pastel mesh accents, vibrant yet polished layout' },
  { id: 'corporate-elite', name: 'Corporate Elite', description: 'Executive navy/charcoal layout, structured credential hierarchy' },
  { id: 'modern-glass', name: 'Modern Glass', description: 'Frosted glassmorphism, 1px subtle borders, dark ambient space' },
];

export default function ThemeRenderer({ portfolio, qrCodeUrl }) {
  if (!portfolio) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400 text-sm">
        No portfolio data available.
      </div>
    );
  }

  const theme = portfolio.theme || 'minimal-pro';

  switch (theme) {
    case 'dark-developer':
      return <DarkDeveloperTheme portfolio={portfolio} qrCodeUrl={qrCodeUrl} />;
    case 'creative-gradient':
      return <CreativeGradientTheme portfolio={portfolio} qrCodeUrl={qrCodeUrl} />;
    case 'corporate-elite':
      return <CorporateEliteTheme portfolio={portfolio} qrCodeUrl={qrCodeUrl} />;
    case 'modern-glass':
      return <ModernGlassTheme portfolio={portfolio} qrCodeUrl={qrCodeUrl} />;
    case 'minimal-pro':
    default:
      return <MinimalProTheme portfolio={portfolio} qrCodeUrl={qrCodeUrl} />;
  }
}
