<!DOCTYPE html>
<html>
<head>
  <title>Trading Bias Messenger - EMA Alerts with Telegram</title>
  <script src="https://unpkg.com/lightweight-charts@4.0.0/dist/lightweight-charts.standalone.production.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
      color: white;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
      background: rgba(255, 255, 255, 0.1);
      padding: 20px;
      border-radius: 15px;
      backdrop-filter: blur(10px);
    }

    .logo {
      font-size: 48px;
    }

    .title {
      font-size: 32px;
      font-weight: bold;
      background: linear-gradient(135deg, #FFD700, #FFA500);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      color: rgba(255, 255, 255, 0.8);
      margin-top: 5px;
    }

    .status-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(0, 0, 0, 0.3);
      padding: 15px;
      border-radius: 12px;
      margin-bottom: 20px;
    }

    .timer {
      background: rgba(255, 215, 0, 0.2);
      padding: 8px 16px;
      border-radius: 30px;
      font-weight: bold;
      border: 1px solid #FFD700;
    }

    .price-panel {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 20px;
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      align-items: center;
    }

    .price-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .price-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
    }

    .price-value {
      font-size: 28px;
      font-weight: bold;
      color: #FFD700;
    }

    .ema-value {
      font-size: 24px;
      color: #FFD700;
    }

    .signal-tag {
      padding: 8px 20px;
      border-radius: 30px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .bullish { background: linear-gradient(135deg, #4CAF50, #2E7D32); }
    .neutral { background: linear-gradient(135deg, #FFC107, #FF8F00); color: #333; }
    .bearish { background: linear-gradient(135deg, #f44336, #c62828); }

    .approval-box {
      background: rgba(0, 136, 204, 0.2);
      border-left: 4px solid #0088cc;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
    }

    .bot-username {
      background: rgba(255, 215, 0, 0.2);
      padding: 10px 20px;
      border-radius: 30px;
      display: inline-block;
      font-weight: bold;
      border: 1px solid #FFD700;
      font-size: 18px;
    }

    .status-badge {
      padding: 8px 16px;
      border-radius: 30px;
      font-weight: bold;
    }

    .approved { background: #4CAF50; }
    .pending { background: #FFC107; color: #333; }
    .denied { background: #f44336; }

    .telegram-section {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid #F68222;
      border-radius: 15px;
      padding: 20px;
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      align-items: flex-end;
    }

    .input-group {
      flex: 1;
      min-width: 250px;
    }

    .input-group label {
      display: block;
      font-size: 12px;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 5px;
    }

    .input-group input {
      width: 100%;
      padding: 12px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: white;
      font-size: 14px;
    }

    .input-group input:focus {
      outline: none;
      border-color: #FFD700;
    }

    button {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    }

    .btn-primary { background: linear-gradient(135deg, #0088cc, #0055aa); }
    .btn-success { background: linear-gradient(135deg, #4CAF50, #2E7D32); }
    .btn-warning { background: linear-gradient(135deg, #FFD700, #FFA500); }
    .btn-danger { background: linear-gradient(135deg, #f44336, #c62828); }

    .tab-container {
      margin: 20px 0;
    }

    .tab-buttons {
      display: flex;
      gap: 5px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    }

    .tab-btn {
      padding: 12px 24px;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: 10px 10px 0 0;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      font-weight: bold;
    }

    .tab-btn.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .tab-pane {
      display: none;
      padding: 20px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 0 0 12px 12px;
    }

    .tab-pane.active {
      display: block;
    }

    #chart-container {
      height: 400px;
      background: #1a1a2e;
      border-radius: 12px;
      margin: 20px 0;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }

    .asset-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 15px;
      border-left: 4px solid;
      transition: transform 0.3s;
    }

    .asset-card:hover {
      transform: translateY(-5px);
    }

    .asset-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .asset-name {
      font-weight: bold;
      font-size: 16px;
    }

    .asset-price {
      color: #FFD700;
      font-weight: bold;
    }

    .asset-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
    }

    .asset-ema {
      color: #FFD700;
      opacity: 0.9;
    }

    .asset-position {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: bold;
    }

    .timeframe-table {
      width: 100%;
      border-collapse: collapse;
      color: white;
    }

    .timeframe-table th {
      background: rgba(0, 0, 0, 0.3);
      padding: 12px;
      text-align: left;
      color: #FFD700;
    }

    .timeframe-table td {
      padding: 10px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .timeframe-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: bold;
      display: inline-block;
      min-width: 80px;
      text-align: center;
    }

    .slider-container {
      display: flex;
      align-items: center;
      gap: 15px;
      min-width: 250px;
    }

    input[type=range] {
      flex: 1;
      height: 6px;
      background: linear-gradient(90deg, #4CAF50, #FFC107, #f44336);
      border-radius: 10px;
      -webkit-appearance: none;
    }

    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid #FFD700;
    }

    .threshold-value {
      font-weight: bold;
      color: #FFD700;
      min-width: 60px;
    }

    #signal-history {
      max-height: 150px;
      overflow-y: auto;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      padding: 10px;
      margin-top: 20px;
    }

    .alert-touch {
      color: #FFD700;
      border-left: 3px solid #FFD700;
      padding: 8px;
      margin-bottom: 5px;
      background: rgba(255, 215, 0, 0.1);
    }

    @media (max-width: 768px) {
      .telegram-section {
        flex-direction: column;
        align-items: stretch;
      }
      
      .price-panel {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <span class="logo">📨</span>
      <div>
        <h1 class="title">Trading Bias Messenger</h1>
        <div class="subtitle">Real-time EMA alerts delivered to Telegram</div>
      </div>
    </div>

    <!-- Status Bar -->
    <div class="status-bar">
      <div id="status">Initializing...</div>
      <div class="timer" id="next-candle-timer">Next candle: --:--</div>
    </div>

    <!-- Price Panel -->
    <div class="price-panel">
      <div class="price-item">
        <span class="price-label">Current Price</span>
        <span class="price-value" id="current-price">--</span>
      </div>
      <div class="price-item">
        <span class="price-label">EMA <span id="ema-period-display">350</span></span>
        <span class="ema-value" id="current-ema">--</span>
      </div>
      <div class="price-item">
        <span class="price-label">Position</span>
        <span id="position-tag" class="signal-tag neutral">Neutral</span>
      </div>
      <div class="price-item">
        <span class="price-label">Signal</span>
        <span id="signal-tag" class="signal-tag neutral">--</span>
      </div>
      <div class="price-item">
        <span class="price-label">Data Source</span>
        <span id="data-source-badge">Binance</span>
      </div>
    </div>

    <!-- Approval Box -->
    <div class="approval-box">
      <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap; margin-bottom: 15px;">
        <span class="bot-username" id="bot-username">🤖 @TradingBiasBot</span>
        <span id="approval-badge" class="status-badge pending">⏳ Checking Status...</span>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
        <div>
          <h3>📋 How to Get Access</h3>
          <ol style="margin-top: 10px; padding-left: 20px;">
            <li>Message <strong id="bot-name">@TradingBiasBot</strong> on Telegram</li>
            <li>Send <code>/start</code> command</li>
            <li>Wait for developer approval</li>
            <li>Enter your Chat ID below</li>
          </ol>
        </div>
        <div>
          <h3>🔐 Your Status</h3>
          <div style="margin-top: 10px;">
            <div>Chat ID: <span id="display-chat-id">Not set</span></div>
            <div>Approval: <span id="display-approval">Unknown</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Telegram Settings -->
    <div class="telegram-section">
      <div class="input-group">
        <label>🔑 Your Telegram Chat ID</label>
        <input type="text" id="chat-id-input" placeholder="Enter your Chat ID (e.g., 123456789)">
      </div>
      
      <button class="btn-primary" onclick="checkApproval()">✅ Check Status</button>
      <button class="btn-success" onclick="saveChatId()">💾 Save Chat ID</button>
      <button class="btn-warning" onclick="testTelegram()">📨 Test Alert</button>
      <button class="btn-danger" onclick="clearChatId()">🗑️ Clear</button>
      
      <div style="flex: 1; min-width: 200px;">
        <div style="font-size: 12px; color: rgba(255,255,255,0.7);">Status:</div>
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <span id="telegram-status">⚫ Not Configured</span>
          <span id="stored-badge" style="display: none;">💾 Saved</span>
          <span id="last-sent" style="font-size: 11px;"></span>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
      <div style="display: flex; flex-wrap: wrap; gap: 15px; align-items: flex-end;">
        <div class="input-group">
          <label>📊 Chart Pair</label>
          <select id="trading-pair">
            <option value="PAXGUSDT" selected>🥇 PAXG/USDT (Gold)</option>
            <option value="ETHUSDT">⟠ ETH/USDT</option>
            <option value="BTCUSDT">₿ BTC/USDT</option>
            <option value="XAGUSDT">🥈 XAG/USDT (Silver)</option>
            <option value="JPYUSDT">💴 JPY/USDT</option>
            <option value="EURUSDT">💶 EUR/USDT</option>
            <option value="CADUSDT">💵 CAD/USDT</option>
            <option value="GBPUSDT">💷 GBP/USDT</option>
          </select>
        </div>

        <div class="input-group">
          <label>⏱️ Time Frame</label>
          <select id="timeframe">
            <option value="1m" selected>1 Minute</option>
            <option value="5m">5 Minutes</option>
            <option value="15m">15 Minutes</option>
            <option value="1h">1 Hour</option>
            <option value="1d">1 Day</option>
          </select>
        </div>

        <div class="input-group">
          <label>📐 EMA Period</label>
          <input type="number" id="ema-period" value="350" min="1" max="1000">
        </div>

        <div class="input-group" style="flex: 2;">
          <label>🎚️ Neutral Threshold <span id="threshold-display">0.10%</span></label>
          <div class="slider-container">
            <input type="range" id="threshold-slider" min="0.01" max="2" step="0.01" value="0.1">
            <span class="threshold-value" id="threshold-value">0.10%</span>
          </div>
        </div>

        <div class="input-group">
          <label>🎨 EMA Color</label>
          <input type="color" id="ema-color" value="#FFD700">
        </div>

        <button onclick="applySettings()">✅ Apply</button>
        <button onclick="testAlert()">🔔 Test Alert</button>
        <button onclick="clearHistory()">🗑️ Clear History</button>
        <button onclick="refreshAll()">🔄 Refresh</button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tab-container">
      <div class="tab-buttons">
        <button class="tab-btn active" onclick="switchTab('assets')">📊 Market Overview</button>
        <button class="tab-btn" onclick="switchTab('timeframes')">📈 Timeframe Analysis</button>
      </div>

      <!-- Assets Tab -->
      <div id="tab-assets" class="tab-pane active">
        <div style="background: rgba(0,0,0,0.2); border-radius: 12px; padding: 15px;">
          <h3 style="color: #FFD700; margin-bottom: 15px;">📊 Multi-Market Dashboard</h3>
          <div id="dashboard-grid" class="dashboard-grid">
            <!-- Assets will be loaded here -->
          </div>
          <div style="text-align: right; margin-top: 10px; color: rgba(255,255,255,0.5);" id="dashboard-timestamp"></div>
        </div>
      </div>

      <!-- Timeframes Tab -->
      <div id="tab-timeframes" class="tab-pane">
        <div style="background: rgba(0,0,0,0.2); border-radius: 12px; padding: 15px;">
          <h3 style="color: #FFD700; margin-bottom: 15px;">📈 Multi-Timeframe Analysis</h3>
          
          <div style="margin-bottom: 20px; display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">
            <select id="mtf-asset" style="padding: 10px; background: rgba(255,255,255,0.1); border: 1px solid #FFD700; border-radius: 8px; color: white;">
              <option value="PAXGUSDT">🥇 PAXG/Gold</option>
              <option value="ETHUSDT">⟠ ETH/USDT</option>
              <option value="BTCUSDT">₿ BTC/USDT</option>
              <option value="XAGUSDT">🥈 XAG/Silver</option>
              <option value="JPYUSDT">💴 JPY/USDT</option>
              <option value="EURUSDT">💶 EUR/USDT</option>
              <option value="CADUSDT">💵 CAD/USDT</option>
              <option value="GBPUSDT">💷 GBP/USDT</option>
            </select>
            <button onclick="updateTimeframeAnalysis()">🔄 Refresh Analysis</button>
          </div>

          <table class="timeframe-table">
            <thead>
              <tr>
                <th>Timeframe</th>
                <th>Price</th>
                <th>EMA</th>
                <th>Position</th>
                <th>Signal</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody id="timeframe-tbody">
              <tr><td colspan="6" style="text-align: center;">Select an asset to view analysis</td></tr>
            </tbody>
          </table>
          <div style="text-align: right; margin-top: 10px; color: rgba(255,255,255,0.5);" id="mtf-timestamp"></div>
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div id="chart-container"></div>

    <!-- Signal History -->
    <div id="signal-history"></div>
  </div>

  <script>
    // ============================================
    // CONFIGURATION - UPDATE THESE WITH YOUR VALUES
    // ============================================
    const VERCEL_API_URL = 'https://your-project.vercel.app/api/telegram'; // Your Vercel URL
    const BOT_USERNAME = '@TradingBiasBot'; // Your bot's username

    // All available assets
    const ALL_ASSETS = ['PAXGUSDT', 'ETHUSDT', 'BTCUSDT', 'XAGUSDT', 'JPYUSDT', 'EURUSDT', 'CADUSDT', 'GBPUSDT'];
    const TIMEFRAMES = ['1m', '5m', '15m', '1h', '1d'];

    // App state
    let SYMBOL = 'PAXGUSDT';
    let TF = '1m';
    let EMA_PERIOD = 350;
    let THRESHOLD = 0.1;
    let EMA_COLOR = '#FFD700';
    let alertCooldown = 30000;
    let lastAlert = 0;
    let chart, candlesSeries, emaSeries;
    let socket, rawCandles = [];
    let userChatId = '';
    let assetData = {};

    // Initialize asset data
    ALL_ASSETS.forEach(asset => {
      assetData[asset] = { price: null, ema: null, position: '--', source: 'Binance' };
    });

    // Load saved Chat ID
    function loadChatId() {
      const saved = localStorage.getItem('tradingBiasChatId');
      if (saved) {
        document.getElementById('chat-id-input').value = saved;
        userChatId = saved;
        document.getElementById('display-chat-id').textContent = saved;
        document.getElementById('stored-badge').style.display = 'inline';
        checkApproval();
      }
    }

    // Save Chat ID
    function saveChatId() {
      const chatId = document.getElementById('chat-id-input').value.trim();
      if (chatId) {
        localStorage.setItem('tradingBiasChatId', chatId);
        userChatId = chatId;
        document.getElementById('display-chat-id').textContent = chatId;
        document.getElementById('stored-badge').style.display = 'inline';
        updateStatus('Chat ID saved');
        checkApproval();
      }
    }

    // Clear Chat ID
    function clearChatId() {
      localStorage.removeItem('tradingBiasChatId');
      document.getElementById('chat-id-input').value = '';
      userChatId = '';
      document.getElementById('display-chat-id').textContent = 'Not set';
      document.getElementById('stored-badge').style.display = 'none';
      document.getElementById('approval-badge').textContent = '⚫ No Chat ID';
      document.getElementById('approval-badge').className = 'status-badge pending';
      updateStatus('Chat ID cleared');
    }

    // Check approval status
    async function checkApproval() {
      const chatId = document.getElementById('chat-id-input').value.trim();
      if (!chatId) {
        alert('Please enter a Chat ID first');
        return;
      }

      const badge = document.getElementById('approval-badge');
      badge.textContent = '⏳ Checking...';
      badge.className = 'status-badge pending';

      try {
        const response = await fetch(VERCEL_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId, checkApproval: true })
        });

        const data = await response.json();

        if (data.approved) {
          badge.textContent = '✅ Approved';
          badge.className = 'status-badge approved';
          document.getElementById('display-approval').textContent = 'Approved ✓';
          document.getElementById('telegram-status').textContent = '✅ Ready';
        } else {
          badge.textContent = '❌ Not Approved';
          badge.className = 'status-badge denied';
          document.getElementById('display-approval').textContent = 'Pending';
          document.getElementById('telegram-status').textContent = '❌ Not Approved';
        }
      } catch (error) {
        badge.textContent = '⚠️ Check Failed';
        badge.className = 'status-badge pending';
        updateStatus('Connection error');
      }
    }

    // Test Telegram
    async function testTelegram() {
      const chatId = document.getElementById('chat-id-input').value.trim();
      if (!chatId) {
        alert('Please enter your Chat ID');
        return;
      }

      const isApproved = document.getElementById('approval-badge').textContent === '✅ Approved';
      if (!isApproved) {
        alert('You are not approved yet. Please message the bot with /start and wait for approval.');
        return;
      }

      const testMessage = `
📨 <b>Trading Bias Messenger Test</b>

✅ Connection successful!
👤 Chat ID: <code>${chatId}</code>
⏰ Time: ${new Date().toLocaleString()}
📊 Threshold: ${THRESHOLD}%

<i>You will now receive real alerts</i>
      `;

      updateStatus('Sending test message...');

      try {
        const response = await fetch(VERCEL_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId, message: testMessage })
        });

        const data = await response.json();
        
        if (data.ok) {
          updateStatus('Test message sent!');
          document.getElementById('last-sent').textContent = `📨 Last: ${new Date().toLocaleTimeString()}`;
        } else {
          updateStatus('Failed to send');
        }
      } catch (error) {
        updateStatus('Connection error');
      }
    }

    // Initialize chart and data
    function init() {
      loadChatId();
      setupSlider();
      initChart();
      loadData();
      connectWebSocket();
      startTimer();
      updateDashboard();
      
      // Update bot username display
      document.getElementById('bot-username').textContent = `🤖 ${BOT_USERNAME}`;
      document.getElementById('bot-name').textContent = BOT_USERNAME;
    }

    function setupSlider() {
      const slider = document.getElementById('threshold-slider');
      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value).toFixed(2);
        document.getElementById('threshold-value').textContent = val + '%';
        document.getElementById('threshold-display').textContent = val + '%';
        THRESHOLD = parseFloat(val);
      });
    }

    function initChart() {
      chart = LightweightCharts.createChart(document.getElementById('chart-container'), {
        layout: { background: '#1a1a2e', textColor: 'white' },
        grid: { vertLines: { color: 'rgba(255,255,255,0.1)' }, horzLines: { color: 'rgba(255,255,255,0.1)' } },
        timeScale: { timeVisible: true, secondsVisible: false }
      });
      
      candlesSeries = chart.addCandlestickSeries({
        upColor: '#4CAF50',
        downColor: '#f44336',
        borderVisible: false
      });
      
      emaSeries = chart.addLineSeries({ color: EMA_COLOR, lineWidth: 2 });
    }

    async function loadData() {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${SYMBOL}&interval=${TF}&limit=500`);
        const data = await response.json();
        
        rawCandles = data.map(candle => ({
          time: candle[0] / 1000,
          open: parseFloat(candle[1]),
          high: parseFloat(candle[2]),
          low: parseFloat(candle[3]),
          close: parseFloat(candle[4])
        }));
        
        candlesSeries.setData(rawCandles);
        plotEMA();
        updatePriceSummary();
        updateStatus(`Loaded ${rawCandles.length} candles`);
      } catch (error) {
        updateStatus('Error loading data');
      }
    }

    function plotEMA() {
      if (rawCandles.length < EMA_PERIOD) return;
      
      const closes = rawCandles.map(c => c.close);
      const ema = calculateEMA(closes, EMA_PERIOD);
      const emaData = rawCandles.slice(EMA_PERIOD - 1).map((c, i) => ({
        time: c.time,
        value: ema[i]
      }));
      
      emaSeries.setData(emaData);
    }

    function calculateEMA(prices, period) {
      const k = 2 / (period + 1);
      const ema = [];
      let sum = prices.slice(0, period).reduce((a, b) => a + b, 0);
      ema[period - 1] = sum / period;
      
      for (let i = period; i < prices.length; i++) {
        ema[i] = prices[i] * k + ema[i - 1] * (1 - k);
      }
      
      return ema.slice(period - 1);
    }

    function connectWebSocket() {
      if (socket) socket.close();
      
      socket = new WebSocket(`wss://stream.binance.com:9443/ws/${SYMBOL.toLowerCase()}@kline_${TF}`);
      
      socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (!data.k) return;
        
        const candle = {
          time: data.k.t / 1000,
          open: parseFloat(data.k.o),
          high: parseFloat(data.k.h),
          low: parseFloat(data.k.l),
          close: parseFloat(data.k.c)
        };
        
        if (data.k.x) {
          rawCandles.push(candle);
          if (rawCandles.length > 500) rawCandles.shift();
          candlesSeries.update(candle);
          plotEMA();
          checkAlert();
        } else {
          candlesSeries.update(candle);
        }
        
        updatePriceSummary();
      };
    }

    function updatePriceSummary() {
      if (rawCandles.length === 0) return;
      
      const current = rawCandles[rawCandles.length - 1];
      document.getElementById('current-price').textContent = '$' + current.close.toFixed(2);
      
      if (rawCandles.length >= EMA_PERIOD) {
        const closes = rawCandles.map(c => c.close);
        const ema = calculateEMA(closes, EMA_PERIOD).pop();
        document.getElementById('current-ema').textContent = '$' + ema.toFixed(2);
        
        const diff = ((current.close - ema) / ema) * 100;
        const position = Math.abs(diff) <= THRESHOLD ? 'AT' : (current.close > ema ? 'ABOVE' : 'BELOW');
        
        const tag = document.getElementById('position-tag');
        const signal = document.getElementById('signal-tag');
        
        if (position === 'AT') {
          tag.textContent = 'AT EMA';
          tag.className = 'signal-tag neutral';
          signal.textContent = 'NEUTRAL';
          signal.className = 'signal-tag neutral';
        } else if (position === 'ABOVE') {
          tag.textContent = 'ABOVE EMA';
          tag.className = 'signal-tag bullish';
          signal.textContent = 'BULLISH';
          signal.className = 'signal-tag bullish';
        } else {
          tag.textContent = 'BELOW EMA';
          tag.className = 'signal-tag bearish';
          signal.textContent = 'BEARISH';
          signal.className = 'signal-tag bearish';
        }
      }
    }

    async function checkAlert() {
      const now = Date.now();
      if (now - lastAlert < alertCooldown) return;
      if (rawCandles.length < EMA_PERIOD) return;

      const candle = rawCandles[rawCandles.length - 1];
      const closes = rawCandles.map(c => c.close);
      const ema = calculateEMA(closes, EMA_PERIOD).pop();
      
      const diff = Math.abs((candle.close - ema) / ema) * 100;
      
      if (diff <= THRESHOLD && userChatId) {
        const isApproved = document.getElementById('approval-badge').textContent === '✅ Approved';
        
        if (isApproved) {
          const message = `
🚨 <b>EMA ALERT</b> 🚨

📊 ${SYMBOL}
💰 Price: $${candle.close.toFixed(2)}
📈 EMA: $${ema.toFixed(2)}
⚡️ Threshold: ${THRESHOLD}%
🕐 ${new Date().toLocaleTimeString()}
          `;
          
          await fetch(VERCEL_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatId: userChatId, message })
          });
        }
        
        lastAlert = now;
      }
    }

    function startTimer() {
      setInterval(() => {
        const now = new Date();
        const next = new Date(now);
        next.setMinutes(next.getMinutes() + 1);
        next.setSeconds(0);
        
        const diff = next - now;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        document.getElementById('next-candle-timer').textContent = 
          `Next: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }, 1000);
    }

    async function updateDashboard() {
      const grid = document.getElementById('dashboard-grid');
      
      for (const asset of ALL_ASSETS) {
        try {
          const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${asset}USDT`);
          const data = await response.json();
          const price = parseFloat(data.price);
          
          grid.innerHTML += `
            <div class="asset-card neutral">
              <div class="asset-header">
                <span class="asset-name">${asset}</span>
                <span class="asset-price">$${price.toFixed(2)}</span>
              </div>
              <div class="asset-details">
                <span class="asset-ema">Loading EMA...</span>
                <span class="asset-position neutral">NEUTRAL</span>
              </div>
            </div>
          `;
        } catch (error) {
          console.error('Error loading asset:', asset);
        }
      }
    }

    async function updateTimeframeAnalysis() {
      const asset = document.getElementById('mtf-asset').value;
      const tbody = document.getElementById('timeframe-tbody');
      
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Loading...</td></tr>';
      
      for (const tf of TIMEFRAMES) {
        try {
          const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${asset}&interval=${tf}&limit=100`);
          const data = await response.json();
          const price = parseFloat(data[data.length - 1][4]);
          
          tbody.innerHTML += `
            <tr>
              <td><strong>${tf}</strong></td>
              <td>$${price.toFixed(4)}</td>
              <td>--</td>
              <td>--</td>
              <td><span class="timeframe-badge neutral">NEUTRAL</span></td>
              <td>Binance</td>
            </tr>
          `;
        } catch (error) {
          console.error('Error loading timeframe:', tf);
        }
      }
      
      document.getElementById('mtf-timestamp').textContent = `Updated: ${new Date().toLocaleTimeString()}`;
    }

    function switchTab(tab) {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      
      if (tab === 'assets') {
        document.querySelector('.tab-btn').classList.add('active');
        document.getElementById('tab-assets').classList.add('active');
      } else {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('tab-timeframes').classList.add('active');
        updateTimeframeAnalysis();
      }
    }

    function testAlert() {
      alert('🔔 Test Alert - Check your browser console for details');
      updateStatus('Test alert triggered');
    }

    function applySettings() {
      EMA_PERIOD = parseInt(document.getElementById('ema-period').value);
      THRESHOLD = parseFloat(document.getElementById('threshold-slider').value);
      EMA_COLOR = document.getElementById('ema-color').value;
      
      emaSeries.applyOptions({ color: EMA_COLOR });
      plotEMA();
      
      updateStatus('Settings applied');
    }

    function clearHistory() {
      document.getElementById('signal-history').innerHTML = '';
      updateStatus('History cleared');
    }

    function refreshAll() {
      updateDashboard();
      updateTimeframeAnalysis();
      loadData();
      updateStatus('Refreshed all data');
    }

    function updateStatus(message) {
      document.getElementById('status').textContent = message;
    }

    // Initialize on load
    window.onload = init;
  </script>
</body>
</html>
