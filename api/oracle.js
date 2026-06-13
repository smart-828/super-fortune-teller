export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, zodiac } = req.body;

  if (!question || question.trim().length === 0) {
    return res.status(400).json({ error: '請先提問' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const zodiacNote = zodiac ? `（提問者星座：${zodiac}）` : '';
  const prompt = `你係一位神秘古老嘅占卜師，精通東西方玄學，包括紫微斗數、塔羅牌、星象占卜同八字命理。你嘅語言神秘而優美，帶有古典詩意，中英夾雜少少英文詞彙令感覺更神秘。

請用繁體中文回應以下問題，語氣要神秘、有智慧、帶點詩意，但同時要有具體指引。回應長度大約200-300字。不要太正面或太負面，要平衡。結尾加一句神秘的箴言。

提問${zodiacNote}：${question}

請直接開始占卜，不需要自我介紹。`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(500).json({ error: err.error?.message || 'API error' });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '命運之鏡暫時無法顯示...';
    return res.status(200).json({ result: text });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
