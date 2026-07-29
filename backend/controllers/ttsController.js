import { generateTextToSpeech } from '../services/ttsService.js';
import { sendError } from '../utils/responseHandler.js';

export const synthesizeSpeech = async (req, res) => {
  try {
    const { text, language, voiceStyle, speed } = req.body;
    if (!text) {
      return sendError(res, 400, 'Text parameter is required for TTS synthesis');
    }

    const ttsData = await generateTextToSpeech(req.user._id, {
      text,
      language,
      voiceStyle,
      speed
    });

    return res.status(200).json({
      success: true,
      message: 'Text-to-speech synthesized successfully',
      data: ttsData
    });
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    return sendError(res, 500, error.message || 'Text-to-speech synthesis failed');
  }
};

export default {
  synthesizeSpeech
};
