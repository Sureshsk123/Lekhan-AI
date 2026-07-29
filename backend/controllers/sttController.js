import { processSpeechToText, getSTTHistory } from '../services/sttService.js';
import { sendError } from '../utils/responseHandler.js';

export const transcribeSpeech = async (req, res) => {
  try {
    const { language = 'Tamil', expectedText = '', audioBase64, mimeType } = req.body;
    let audioBuffer = req.file ? req.file.buffer : null;
    let detectedMime = mimeType || (req.file ? req.file.mimetype : 'audio/mp3');

    if (!audioBuffer && !audioBase64) {
      return sendError(res, 400, 'No audio file or base64 data provided');
    }

    const result = await processSpeechToText({
      userId: req.user._id,
      audioBuffer,
      audioBase64,
      mimeType: detectedMime,
      language,
      expectedText
    });

    return res.status(200).json({
      success: true,
      message: 'Speech transcribed and evaluated successfully',
      data: {
        transcription: result.transcription,
        pronunciationScore: result.pronunciationScore,
        detectedMistakes: result.detectedMistakes,
        accentFeedback: result.accentFeedback,
        logId: result.log ? result.log._id : null
      }
    });
  } catch (error) {
    console.error('Error transcribing speech:', error);
    return sendError(res, 500, error.message || 'Speech transcription failed');
  }
};

export const fetchSTTHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const history = await getSTTHistory(req.user._id, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });

    return res.status(200).json({
      success: true,
      message: 'Speech transcription history fetched successfully',
      data: history.data,
      pagination: history.pagination
    });
  } catch (error) {
    console.error('Error fetching STT history:', error);
    return sendError(res, 500, error.message || 'Failed to fetch STT history');
  }
};

export default {
  transcribeSpeech,
  fetchSTTHistory
};
