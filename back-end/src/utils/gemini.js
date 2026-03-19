// gemini.js  →  now uses local Ollama instead of Google Gemini cloud API

// const OLLAMA_URL = "http://localhost:11434/api/generate"; // for localhost. 
const OLLAMA_URL = "https://ollama-revisionflow.cfargotunnel.com/api/generate"; // cloudfare tunnel. 
const OLLAMA_MODEL = "gpt-oss:120b-cloud"; // swap to whichever model you've pulled e.g. "llama3", "mistral", etc.

/**
 * Send a prompt to local Ollama and get clean JSON back
 */
export const generateJSON = async (prompt, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt: prompt,
          stream: false,       // get the full response at once
          format: "json",      // ask Ollama to constrain output to JSON
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.response;
      const clean = text.replace(/```json|```/g, "").trim();
      return JSON.parse(clean);

    } catch (err) {
      const isLastAttempt = i === retries - 1;
      if (!isLastAttempt) {
        await new Promise(res => setTimeout(res, 2000 * (i + 1)));
        continue;
      }
      throw err;
    }
  }
};

// Kept for any code that imports geminiModel directly (safe no-op stub)
export const geminiModel = null;