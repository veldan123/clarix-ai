export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  const { messages, system } = req.body;

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const body = {
    system_instruction: system ? { parts: [{ text: system }] } : undefined,
    contents,
    generationConfig: { maxOutputTokens: 400 },
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const geminiRes = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!geminiRes.ok) {
    const err = await geminiRes.text();
    return res.status(geminiRes.status).json({ error: err });
  }

  const data = await geminiRes.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  res.status(200).json({ text });
}
