// api/webhook.js - Handles incoming Telegram bot commands
export default async function handler(req, res) {
  // Only accept POST from Telegram
  if (req.method !== 'POST') {
    return res.status(200).end();
  }

  try {
    const update = req.body;
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const DEVELOPER_CHAT_ID = process.env.DEVELOPER_CHAT_ID;
    
    // Parse KV data (simple JSON storage)
    let KV_DATA = process.env.KV_DATA ? JSON.parse(process.env.KV_DATA) : {};

    // Check if it's a message
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const username = update.message.from.username || 'No username';
      const firstName = update.message.from.first_name || 'Unknown';
      const text = update.message.text;

      // Handle /start command
      if (text === '/start') {
        const isApproved = KV_DATA[chatId] === 'approved';

        if (isApproved) {
          await sendTelegramMessage(TELEGRAM_BOT_TOKEN, chatId, 
            `✅ Welcome back! You're already approved to receive alerts.`);
        } else {
          // Store as pending
          KV_DATA[chatId] = 'pending';
          await updateKVData(KV_DATA);

          await sendTelegramMessage(TELEGRAM_BOT_TOKEN, chatId,
            `👋 Hello ${firstName}!\n\n` +
            `Your request has been sent to the developer for approval.\n` +
            `You'll be notified once approved.\n\n` +
            `Your Chat ID: <code>${chatId}</code>`);

          // Notify developer
          await sendTelegramMessage(TELEGRAM_BOT_TOKEN, DEVELOPER_CHAT_ID,
            `🔔 <b>New User Request</b>\n\n` +
            `Name: ${firstName}\n` +
            `Username: @${username}\n` +
            `Chat ID: <code>${chatId}</code>\n\n` +
            `To approve, visit:\n` +
            `https://vercel.com/your-project/settings/environment-variables`);
        }
      }

      // Handle approve command (simplified - needs manual KV update)
      else if (text.startsWith('/approve ') && chatId.toString() === DEVELOPER_CHAT_ID) {
        const targetChatId = text.split(' ')[1];
        if (targetChatId) {
          KV_DATA[targetChatId] = 'approved';
          await updateKVData(KV_DATA);

          await sendTelegramMessage(TELEGRAM_BOT_TOKEN, parseInt(targetChatId),
            `✅ <b>Approved!</b>\n\n` +
            `You can now enter your Chat ID in the Trading Bias Messenger app.`);

          await sendTelegramMessage(TELEGRAM_BOT_TOKEN, DEVELOPER_CHAT_ID,
            `✅ User <code>${targetChatId}</code> approved.`);
        }
      }

      // Handle list command
      else if (text === '/list' && chatId.toString() === DEVELOPER_CHAT_ID) {
        const approved = Object.entries(KV_DATA)
          .filter(([_, status]) => status === 'approved')
          .map(([id]) => id)
          .join('\n');

        await sendTelegramMessage(TELEGRAM_BOT_TOKEN, DEVELOPER_CHAT_ID,
          `📋 <b>Approved Users</b>\n\n${approved || 'None'}`);
      }
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(200).json({ ok: true });
  }
}

// Helper to send Telegram messages
async function sendTelegramMessage(botToken, chatId, text) {
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    })
  });
}

// Helper to update KV data (simulated with environment variable)
async function updateKVData(newData) {
  // Note: In production, you'd use a real database
  // For demo, we'll just log that it needs updating
  console.log('KV Update needed:', JSON.stringify(newData, null, 2));
  console.log('Please update VERCEL_ KV_DATA environment variable');
}
