const pdfParse = require('pdf-parse');

/**
 * Extract clean raw text from PDF buffer
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    if (!data || !data.text) {
      throw new Error('No readable text found in PDF.');
    }
    // Clean redundant carriage returns while preserving meaningful paragraph breaks
    return data.text.replace(/\r\n/g, '\n').trim();
  } catch (error) {
    console.error('[PDF Extraction Error]:', error.message);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

module.exports = { extractTextFromPDF };

