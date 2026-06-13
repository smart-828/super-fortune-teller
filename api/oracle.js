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
  const prompt = `你係一位神秘但直接的占卜師，精通東西方玄學，包括紫微斗數、塔羅牌、星象占卜同八字命理。

規則：
1. 必須給出一個清晰、具體的答案或建議——唔可以含糊其辭或迴避問題
2. 先直接回答問題（例如：感情運「今年上半年有機會，下半年需謹慎」），再解釋原因
3. 給出1-2個具體可行的建議（例如：「宜主動出擊，忌猶豫不決」）
4. 語氣神秘有詩意，但內容要實在
5. 繁體中文，200字左右
6. 結尾一句簡短箴言

提問${zodiacNote}：${question}

直接開始，不需自我介紹。`;

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
