/**
 * Portify AI — Centralized Application Constants
 */

const THEMES = {
  MINIMAL_PRO: 'minimal-pro',
  DARK_DEVELOPER: 'dark-developer',
  CREATIVE_GRADIENT: 'creative-gradient',
  CORPORATE_ELITE: 'corporate-elite',
  MODERN_GLASS: 'modern-glass',
};

const THEME_LIST = Object.values(THEMES);

const EXTRACTION_SOURCES = {
  AI_GEMINI: 'ai_gemini',
  DETERMINISTIC_ENGINE: 'deterministic_engine',
  MANUAL: 'manual',
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const PORTFOLIO_SECTIONS = [
  'personalInfo',
  'summary',
  'experience',
  'education',
  'skills',
  'softSkills',
  'projects',
  'certifications',
  'achievements',
];

const ALLOWED_UPDATE_FIELDS = [
  'title',
  'slug',
  'theme',
  'isPublished',
  'personalInfo',
  'summary',
  'experience',
  'education',
  'skills',
  'softSkills',
  'projects',
  'certifications',
  'achievements',
  'customSections',
  'themeSettings',
];

module.exports = {
  THEMES,
  THEME_LIST,
  EXTRACTION_SOURCES,
  HTTP_STATUS,
  PORTFOLIO_SECTIONS,
  ALLOWED_UPDATE_FIELDS,
};

