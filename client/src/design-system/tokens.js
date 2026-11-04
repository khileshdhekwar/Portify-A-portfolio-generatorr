/**
 * Portify AI — Design System Design Tokens
 * Restrained, enterprise-grade SaaS design tokens.
 */

export const typography = {
  fontFamily: {
    sans: 'Plus Jakarta Sans, Inter, system-ui, -apple-system, sans-serif',
    mono: 'JetBrains Mono, Menlo, monospace',
    serif: 'Newsreader, Georgia, serif',
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
    sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0' }],
    base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em' }],
    lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.015em' }],
    xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.02em' }],
    '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.03em' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.035em' }],
    '5xl': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.04em' }],
  },
};

export const colors = {
  brand: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    950: '#2e1065',
  },
  surface: {
    base: '#f8fafc',
    card: '#ffffff',
    raised: '#ffffff',
    overlay: '#0f172a',
  },
  border: {
    subtle: '#f1f5f9',
    default: '#e2e8f0',
    strong: '#cbd5e1',
    interactive: '#94a3b8',
  },
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    muted: '#94a3b8',
    inverse: '#ffffff',
  },
  status: {
    success: '#059669',
    warning: '#d97706',
    error: '#e11d48',
    info: '#2563eb',
  },
};

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
};

export const transitions = {
  fast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
  default: '200ms cubic-bezier(0.16, 1, 0.3, 1)',
  smooth: '300ms cubic-bezier(0.16, 1, 0.3, 1)',
};

