const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/env');
const { parseResumeDeterministically } = require('./deterministicParser');

// Model preference: Gemini 2.5 Flash / 1.5 Flash (free tier eligible, high speed, structured JSON support)
const MODEL_NAME = 'gemini-1.5-flash';

let genAI = null;
if (config.geminiApiKey) {
  try {
    genAI = new GoogleGenerativeAI(config.geminiApiKey);
  } catch (err) {
    console.warn('[AI Service] Failed to initialize GoogleGenerativeAI:', err.message);
  }
}

/**
 * Check if AI service is active and properly configured
 */
const isAIAvailable = () => {
  return Boolean(config.geminiApiKey && config.geminiApiKey.trim().length > 0 && genAI);
};

/**
 * Extract structured resume data with Google Gemini, or seamlessly fall back to Deterministic Parser
 * @param {string} rawResumeText
 * @returns {Promise<{ data: object, source: 'ai_gemini' | 'deterministic_engine', message?: string }>}
 */
const extractResumeData = async (rawResumeText) => {
  if (!isAIAvailable()) {
    console.log('[AI Service] Gemini API key not detected. Falling back to deterministic rule-based parser.');
    const deterministicData = parseResumeDeterministically(rawResumeText);
    return {
      data: deterministicData,
      source: 'deterministic_engine',
      message: 'Processed using Portify Deterministic Rule Engine (Gemini API key not configured). All resume facts preserved 100% faithfully.',
    };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1, // Low temperature to prevent hallucination
      },
    });

    const prompt = `
You are an expert ATS and resume parsing AI.
Your task is to extract structured portfolio data from the following resume text.

STRICT GROUNDING RULES:
1. Extract ONLY facts, roles, titles, companies, dates, skills, and accomplishments explicitly present in the text.
2. DO NOT invent, fabricate, extrapolate or exaggerate experience, degrees, skills, or metrics.
3. If a detail is missing (e.g. phone, github, gpa), leave it as an empty string "".
4. Categorize skills appropriately into logical categories (e.g. "Languages", "Frameworks & Libraries", "Databases & Cloud", "Developer Tools").

Return valid JSON adhering strictly to this schema:
{
  "personalInfo": {
    "fullName": "string",
    "headline": "string (e.g. Senior Full Stack Engineer)",
    "email": "string",
    "phone": "string",
    "location": "string",
    "avatarUrl": "",
    "website": "string",
    "github": "string",
    "linkedin": "string",
    "twitter": "string"
  },
  "summary": "string (1-3 sentences summary faithfully synthesized from experience)",
  "experience": [
    {
      "role": "string",
      "company": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "current": boolean,
      "description": "string",
      "highlights": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "fieldOfStudy": "string",
      "graduationDate": "string",
      "gpa": "string",
      "highlights": ["string"]
    }
  ],
  "skills": [
    {
      "category": "string",
      "items": ["string"]
    }
  ],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "technologies": ["string"],
      "liveUrl": "string",
      "repoUrl": "string",
      "highlights": ["string"]
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "issueDate": "string",
      "credentialUrl": "string"
    }
  ]
}

RESUME TEXT:
"""
${rawResumeText}
"""
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    const parsedJson = JSON.parse(responseText);

    // Validate and sanitize data
    const structuredData = {
      extractionSource: 'ai_gemini',
      title: parsedJson.personalInfo?.headline
        ? `${parsedJson.personalInfo.fullName || 'Professional'} — ${parsedJson.personalInfo.headline}`
        : 'Professional Portfolio',
      personalInfo: {
        fullName: parsedJson.personalInfo?.fullName || '',
        headline: parsedJson.personalInfo?.headline || '',
        email: parsedJson.personalInfo?.email || '',
        phone: parsedJson.personalInfo?.phone || '',
        location: parsedJson.personalInfo?.location || '',
        avatarUrl: parsedJson.personalInfo?.avatarUrl || '',
        website: parsedJson.personalInfo?.website || '',
        github: parsedJson.personalInfo?.github || '',
        linkedin: parsedJson.personalInfo?.linkedin || '',
        twitter: parsedJson.personalInfo?.twitter || '',
      },
      summary: parsedJson.summary || '',
      experience: Array.isArray(parsedJson.experience) ? parsedJson.experience : [],
      education: Array.isArray(parsedJson.education) ? parsedJson.education : [],
      skills: Array.isArray(parsedJson.skills) ? parsedJson.skills : [],
      projects: Array.isArray(parsedJson.projects) ? parsedJson.projects : [],
      certifications: Array.isArray(parsedJson.certifications) ? parsedJson.certifications : [],
      customSections: [],
    };

    return {
      data: structuredData,
      source: 'ai_gemini',
      message: 'Successfully extracted and structured with Google Gemini AI.',
    };
  } catch (err) {
    console.error('[AI Service Error]: Gemini API call failed:', err.message);
    const deterministicData = parseResumeDeterministically(rawResumeText);
    return {
      data: deterministicData,
      source: 'deterministic_engine',
      message: `AI service temporarily unavailable (${err.message}). Safely extracted via Portify Rule Engine.`,
    };
  }
};

/**
 * AI-assisted professional summary enhancement
 */
const enhanceSummary = async (currentSummary, experienceList, skillsList) => {
  if (!isAIAvailable()) {
    return {
      enhancedText: currentSummary,
      source: 'deterministic_engine',
      message: 'AI enhancement unavailable (Gemini API key not configured). Current summary kept.',
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const prompt = `
You are an executive resume and portfolio writer.
Craft a compelling, polished 2-3 sentence professional summary for a portfolio hero section.
Do NOT fabricate skills, metrics, or credentials not mentioned in the context below.
Use active, punchy professional phrasing.

Context:
Current Summary: ${currentSummary || 'None provided'}
Experience Overview: ${JSON.stringify(experienceList || [])}
Key Skills: ${JSON.stringify(skillsList || [])}

Return ONLY the enhanced summary text, with no quotes or introductory remarks.
`;

    const result = await model.generateContent(prompt);
    const enhancedText = result.response.text().trim();

    return {
      enhancedText,
      source: 'ai_gemini',
      message: 'Summary enhanced with Gemini AI.',
    };
  } catch (err) {
    console.error('[AI Enhance Summary Error]:', err.message);
    return {
      enhancedText: currentSummary,
      source: 'deterministic_engine',
      message: `Enhancement failed: ${err.message}`,
    };
  }
};

/**
 * AI-assisted bullet point / highlight optimization
 */
const enhanceHighlights = async (role, company, highlights) => {
  if (!isAIAvailable() || !highlights || highlights.length === 0) {
    return {
      enhancedHighlights: highlights,
      source: 'deterministic_engine',
    };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: { responseMimeType: 'application/json' },
    });

    const prompt = `
You are a technical career coach.
Refine the following bullet points for the role "${role}" at "${company}".
Make them impact-focused using strong action verbs (e.g. "Architected", "Engineered", "Optimized", "Streamlined").
DO NOT fabricate metrics, users, or revenue numbers that are not in the original text.
Preserve the factual integrity of each item.

Original highlights:
${JSON.stringify(highlights)}

Return a JSON array of strings:
["enhanced bullet 1", "enhanced bullet 2"]
`;

    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());

    return {
      enhancedHighlights: Array.isArray(parsed) ? parsed : highlights,
      source: 'ai_gemini',
      message: 'Bullet points enhanced with Gemini AI.',
    };
  } catch (err) {
    console.error('[AI Enhance Highlights Error]:', err.message);
    return {
      enhancedHighlights: highlights,
      source: 'deterministic_engine',
      message: `Enhancement failed: ${err.message}`,
    };
  }
};

module.exports = {
  isAIAvailable,
  extractResumeData,
  enhanceSummary,
  enhanceHighlights,
};
