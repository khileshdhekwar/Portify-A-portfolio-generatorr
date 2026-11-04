const mammoth = require('mammoth');

/**
 * Extract clean raw text from DOCX buffer
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
const extractTextFromDOCX = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    if (!result || !result.value) {
      throw new Error('No readable text found in DOCX.');
    }
    return result.value.replace(/\r\n/g, '\n').trim();
  } catch (error) {
    console.error('[DOCX Extraction Error]:', error.message);
    throw new Error(`Failed to extract text from DOCX: ${error.message}`);
  }
};

module.exports = { extractTextFromDOCX };

