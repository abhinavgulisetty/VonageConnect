require('dotenv').config();

const config = {
  server: {
    port: process.env.PORT || 3000,
    dataFile: 'webhook_data.json'
  },
  vonage: {
    applicationId: process.env.VONAGE_APPLICATION_ID,
    privateKeyPath: process.env.VONAGE_PRIVATE_KEY_PATH,
    whatsappNumber: process.env.VONAGE_WHATSAPP_NUMBER,
    smsNumber: process.env.VONAGE_SMS_NUMBER
  },
  rasa: {
    webhookUrl: process.env.RASA_REST_WEBHOOK || 'http://localhost:5005/webhooks/rest/webhook',
    statusUrl: 'http://localhost:5005/status'
  },
  demo: {
    mode: process.env.DEMO_MODE === 'true' || false
  }
};

module.exports = config;
