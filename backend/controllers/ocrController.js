import OCRService from '../services/OCRService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const processVisionOCR = async (req, res) => {
  try {
    const { language = 'Tamil', fileType, imageBase64 } = req.body;
    let fileBuffer = req.file ? req.file.buffer : null;
    let detectedFileType = fileType || (req.file ? req.file.mimetype : 'png');

    if (!fileBuffer && !imageBase64) {
      return sendError(res, 400, 'No image file or base64 data provided');
    }

    const result = await OCRService.processGeminiVisionOCR({
      userId: req.user._id,
      imageBuffer: fileBuffer,
      base64Data: imageBase64,
      fileType: detectedFileType,
      language
    });

    return res.status(200).json({
      success: true,
      message: 'Gemini Vision OCR processed successfully',
      data: result
    });
  } catch (error) {
    console.error('Error processing Vision OCR:', error);
    return sendError(res, 500, error.message || 'Failed to process Vision OCR');
  }
};

export const getOCRHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const history = await OCRService.getHistory(req.user._id, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      search
    });

    return res.status(200).json({
      success: true,
      message: 'OCR history fetched successfully',
      data: history.data,
      pagination: history.pagination
    });
  } catch (error) {
    console.error('Error fetching OCR history:', error);
    return sendError(res, 500, error.message || 'Failed to fetch OCR history');
  }
};

export const processHandwritingOCR = async (req, res) => {
  return await processVisionOCR(req, res);
};

export const processPrintedOCR = async (req, res) => {
  return await processVisionOCR(req, res);
};

export default {
  processVisionOCR,
  getOCRHistory,
  processHandwritingOCR,
  processPrintedOCR
};
