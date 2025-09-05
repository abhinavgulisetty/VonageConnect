const express = require('express');
const router = express.Router();

class ChatRoutes {
  constructor(rasaService, webhookData) {
    this.rasaService = rasaService;
    this.webhookData = webhookData;
    this.setupRoutes();
  }

  setupRoutes() {
    router.post('/', this.handleChat.bind(this));
    router.get('/health', this.getHealth.bind(this));
  }

  async handleChat(req, res) {
    const { message, sender } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }
    
    const senderId = sender || 'web-user';
    this.webhookData.save('web_chat_in', { sender: senderId, message });
    
    const result = await this.rasaService.sendMessage(senderId, message);
    
    this.webhookData.save('web_chat_out', { 
      sender: senderId, 
      responses: result.messages, 
      fallback: result.fallback 
    });
    
    return res.json(result.messages);
  }

  async getHealth(req, res) {
    const status = await this.rasaService.checkStatus();
    return res.json({ rasa: status.available });
  }

  getRouter() {
    return router;
  }
}

module.exports = ChatRoutes;
