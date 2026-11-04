const path = require('path');
const { extractTextFromPDF } = require('../services/pdfService');
const { extractTextFromDOCX } = require('../services/docxService');
const { extractResumeData } = require('../services/aiService');
const { Portfolio, THEME_LIST } = require('../models/Portfolio');
const User = require('../models/User');
const { generateUniqueSlug } = require('../utils/slugify');

/**
 * Handle resume upload (PDF / DOCX), extract text, parse with AI / fallback, rotate theme, save portfolio
 * POST /api/resume/upload
 */
const uploadAndParseResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded. Please upload a PDF or DOCX file.',
      });
    }

    const { originalname, buffer } = req.file;
    const ext = path.extname(originalname).toLowerCase();
    let rawText = '';

    // 1. Extract raw text based on file format
    if (ext === '.pdf') {
      try {
        rawText = await extractTextFromPDF(buffer);
      } catch (pdfErr) {
        // Fallback: If buffer is text-based
        const textFallback = buffer.toString('utf-8');
        if (textFallback.length > 50 && !textFallback.includes('\x00')) {
          rawText = textFallback;
        } else {
          throw pdfErr;
        }
      }
    } else if (ext === '.docx' || ext === '.doc') {
      rawText = await extractTextFromDOCX(buffer);
    } else if (ext === '.txt') {
      rawText = buffer.toString('utf-8');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Unsupported format. Only PDF and DOCX files are allowed.',
      });
    }

    if (!rawText || rawText.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract sufficient text from the uploaded file. Please ensure it is not scanned/empty.',
      });
    }

    // 2. Extract structured data with Gemini AI or Deterministic Fallback
    const extractionResult = await extractResumeData(rawText);
    const parsedData = extractionResult.data;

    // 3. Automatic Theme Rotation for consecutive uploads
    const user = await User.findById(req.user._id);
    let nextTheme = 'minimal-pro';
    if (user) {
      const lastIndex = THEME_LIST.indexOf(user.lastThemeUsed || 'minimal-pro');
      const nextIndex = (lastIndex + 1) % THEME_LIST.length;
      nextTheme = THEME_LIST[nextIndex];
    }

    // 4. Generate Unique Slug
    const baseSlugName = parsedData.personalInfo?.fullName || user.name || 'portfolio';
    const slug = await generateUniqueSlug(baseSlugName);

    // 5. Create Portfolio Record
    const portfolio = await Portfolio.create({
      user: req.user._id,
      title: parsedData.title || `${parsedData.personalInfo?.fullName || user.name}'s Portfolio`,
      slug,
      theme: nextTheme,
      isPublished: true,
      extractionSource: extractionResult.source,
      originalFileName: originalname,
      personalInfo: parsedData.personalInfo,
      summary: parsedData.summary,
      experience: parsedData.experience,
      education: parsedData.education,
      skills: parsedData.skills,
      projects: parsedData.projects,
      certifications: parsedData.certifications,
      customSections: parsedData.customSections || [],
    });

    // 6. Update user's lastThemeUsed and portfolioCount
    if (user) {
      user.lastThemeUsed = nextTheme;
      user.portfolioCount = (user.portfolioCount || 0) + 1;
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: 'Resume parsed and portfolio generated successfully!',
      source: extractionResult.source,
      sourceMessage: extractionResult.message,
      portfolio,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Parse raw resume text without saving immediately (for previewing extraction)
 * POST /api/resume/preview-extract
 */
const previewResumeExtract = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded.',
      });
    }

    const { originalname, buffer } = req.file;
    const ext = path.extname(originalname).toLowerCase();
    let rawText = '';

    if (ext === '.pdf') {
      try {
        rawText = await extractTextFromPDF(buffer);
      } catch (pdfErr) {
        rawText = buffer.toString('utf-8');
      }
    } else if (ext === '.docx' || ext === '.doc') {
      rawText = await extractTextFromDOCX(buffer);
    } else {
      rawText = buffer.toString('utf-8');
    }

    const extractionResult = await extractResumeData(rawText);

    res.json({
      success: true,
      fileName: originalname,
      rawTextLength: rawText.length,
      source: extractionResult.source,
      sourceMessage: extractionResult.message,
      data: extractionResult.data,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadAndParseResume,
  previewResumeExtract,
};
