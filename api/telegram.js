// api/telegram.js - Handles sending alerts from the web app
export default async function handler(req, res) {
  // Enable CORS for GitHub Pages
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { chatId, message, checkApproval } = req.body;

    // Get environment variables
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const KV_DATA = process.env.KV_DATA ? JSON.parse(process.env.KV_DATA) : {};

    // Handle approval check
    if (checkApproval) {
      const isApproved = KV_DATA[chatId] === 'approved';
      return res.status(200).json({ ok: true, approved: isApproved });
    }

    // Check if user is approved
    if (KV_DATA[chatId] !== 'approved') {
      return res.status(403).json({ 
        ok: false, 
        error: 'Not approved',
        description: 'Your Chat ID is not approved. Please message the bot with /start'
      });
    }

    // Send to Telegram
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
