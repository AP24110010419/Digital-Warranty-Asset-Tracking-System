import { HTTP_STATUS } from '../config/constants.js';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export const getAIResponse = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Please provide a prompt for the AI assistant.',
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'AI assistant is not configured. Set OPENAI_API_KEY in the backend environment.',
      });
    }

    const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful digital warranty assistant. Answer clearly and concisely with a focus on products, warranties, maintenance, and asset tracking.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      const errorMessage = data.error?.message || 'OpenAI request failed';
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: errorMessage,
      });
    }

    const aiReply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate an answer.';

    res.status(HTTP_STATUS.OK).json({
      success: true,
      reply: aiReply.trim(),
    });
  } catch (error) {
    next(error);
  }
};
