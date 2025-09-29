const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const config = require('./config');
const VonageService = require('./services/vonageService');
const RasaService = require('./services/rasaService');
const WebhookData = require('./utils/webhookData');
const WebhookRoutes = require('./routes/webhooks');
const ChatRoutes = require('./routes/chat');

class App {
  constructor() {
    this.app = express();
    this.vonageService = new VonageService();
    this.rasaService = new RasaService();
    this.webhookData = new WebhookData();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(__dirname, '..', 'public')));
    
    // Add CORS middleware for Postman testing
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
      }
      next();
    });
  }

  setupRoutes() {
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    });

    const webhookRoutes = new WebhookRoutes(
      this.vonageService, 
      this.rasaService, 
      this.webhookData
    );
    this.app.use('/webhooks', webhookRoutes.getRouter());

    const chatRoutes = new ChatRoutes(this.rasaService, this.webhookData);
    this.app.post('/chat', chatRoutes.handleChat.bind(chatRoutes));
    this.app.get('/health', chatRoutes.getHealth.bind(chatRoutes));
  }

  async start() {
    const port = config.server.port;
    
    this.app.listen(port, async () => {
      console.log('\n🚀 Multi-Channel Customer Service Bot Starting...');
      console.log('================================================');
      console.log(`✅ Node.js server listening at http://localhost:${port}`);
      
      if (this.vonageService.isDemoMode()) {
        console.log('🎭 Running in DEMO MODE - Vonage simulation enabled');
      } else {
        console.log('🌐 Vonage integration active');
      }
      
      console.log('\n🤖 Checking RASA server connection...');
      const rasaStatus = await this.rasaService.checkStatus();
      if (rasaStatus.available) {
        console.log('✅ RASA server is running and ready!');
        console.log(`   Model: ${rasaStatus.status.model_file || 'default'}`);
      } else {
        console.log('⚠️  RASA server not available - fallback responses will be used');
        console.log('   To start RASA server: npm run rasa:server');
        console.log('   Error:', rasaStatus.error);
      }
      
      console.log('\n🎯 Demo Instructions:');
      console.log('1. Open http://localhost:3000 in your browser');
      console.log('2. Try: "Hello", "track order #12345", "Where is my order?"');
      console.log('3. Use curl commands from WHATSAPP_DEMO.md for WhatsApp/SMS testing');
      console.log('4. Import Postman collection from ./postman/VonageConnect.postman_collection.json');
      console.log('\n📚 For detailed demo guide, see DEMO_GUIDE.md');
      console.log('📱 For WhatsApp/SMS curl commands, see WHATSAPP_DEMO.md');
      console.log('📬 For Postman testing, see POSTMAN_GUIDE.md');
      console.log('================================================\n');
    });
  }

  getApp() {
    return this.app;
  }
}

module.exports = App;
