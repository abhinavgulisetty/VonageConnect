const fs = require('fs');
const { Auth } = require('@vonage/auth');
const { Messages } = require('@vonage/messages');
const config = require('../config');

class VonageService {
  constructor() {
    this.messagesClient = null;
    this.demoMode = config.demo.mode;
    this.initializeClient();
  }

  initializeClient() {
    if (config.vonage.applicationId && config.vonage.privateKeyPath) {
      try {
        const auth = new Auth({ 
          applicationId: config.vonage.applicationId, 
          privateKey: fs.readFileSync(config.vonage.privateKeyPath) 
        });
        this.messagesClient = new Messages(auth);
        console.log('✅ Vonage Messages client initialized successfully');
      } catch (e) {
        console.warn('⚠️  Vonage Messages client not initialized. Running in demo mode.');
        console.warn('Error:', e.message);
        this.demoMode = true;
      }
    } else {
      console.warn('⚠️  Vonage credentials not found. Running in demo mode.');
      this.demoMode = true;
    }
  }

  async sendMessage(channel, from, to, text) {
    if (this.messagesClient && (channel === 'whatsapp' || channel === 'sms')) {
      try {
        const messageConfig = {
          to: { type: channel, number: from },
          from: { 
            type: channel, 
            number: channel === 'whatsapp' ? config.vonage.whatsappNumber : config.vonage.smsNumber 
          },
          message_type: 'text',
          text: text
        };

        await this.messagesClient.send(messageConfig);
        console.log(`✅ Sent ${channel.toUpperCase()} reply to ${from}: ${text}`);
        return true;
      } catch (sendError) {
        console.error('Error sending Vonage message:', sendError.message);
        this.logDemoMessage(channel, from, text);
        return false;
      }
    } else {
      this.logDemoMessage(channel, from, text);
      return true;
    }
  }

  logDemoMessage(channel, from, text) {
    console.log(`🎭 DEMO MODE: Simulating ${channel.toUpperCase()} reply to ${from}:`);
    console.log(`   📱 ${text}`);
  }

  isDemoMode() {
    return this.demoMode;
  }
}

module.exports = VonageService;
