// thin wrapper around an external AI API (OpenAI-style chat completion endpoint).
// this is completely optional - if AI_API_KEY isn't set, everything in this
// project just falls back to the rule based logic in recommendationService.js
// swap the fetch call below for whatever provider you want to use.

const fetch = require('node-fetch');

const isAIEnabled = () => Boolean(process.env.AI_API_KEY);

// asks the AI for a short list of product suggestions, given a text prompt
// describing what the user has been looking at. returns null if AI isn't
// configured or the call fails, so callers should always have a fallback.
const getAISuggestions = async (promptContext) => {
  if (!isAIEnabled()) return null;

  try {
    const response = await fetch(process.env.AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.AI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a product recommendation assistant for an online store. Reply with a short comma separated list of relevant product keywords only, no extra text.'
          },
          { role: 'user', content: promptContext }
        ],
        max_tokens: 100
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) return null;

    return text.split(',').map((k) => k.trim().toLowerCase()).filter(Boolean);
  } catch (err) {
    console.error('AI suggestion call failed, falling back to rule based recommender:', err.message);
    return null;
  }
};

module.exports = { isAIEnabled, getAISuggestions };
