// Stitch MCP wrapper — tries real Stitch API, falls back gracefully
// Stitches MCP: REMOVED_API_KEY

import { getNextQuestionText } from './fallbackQuestions';

interface StitchResponse {
  text?: string;
  content?: string;
  result?: { text?: string };
}

export async function callStitchChat(prompt: string): Promise<string> {
  try {
    const response = await fetch('https://stitch.googleapis.com/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': 'REMOVED_API_KEY',
      },
      body: JSON.stringify({
        method: 'tools/call',
        params: {
          name: 'stitch_chat',
          arguments: { prompt },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Stitch HTTP ${response.status}`);
    }

    const data: StitchResponse = await response.json();

    const text =
      data.text ?? data.content ?? data.result?.text ?? '';

    if (text) return text;
    throw new Error('Empty response from Stitch');
  } catch (err) {
    console.warn('[Stitch] Falling back to placeholder:', err);
    throw err; // let caller handle fallback
  }
}

// Safe wrapper — always returns a string (uses fallback on any error)
export async function getAIResponse(
  prompt: string,
  questionIndex: number
): Promise<string> {
  try {
    return await callStitchChat(prompt);
  } catch {
    // Return the next pre-defined question text as fallback
    return getNextQuestionText(questionIndex);
  }
}