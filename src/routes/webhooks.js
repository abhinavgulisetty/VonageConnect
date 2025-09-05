const express = require('express');
const fetch = global.fetch || require('node-fetch');
const config = require('../config');

const router = express.Router();

class WebhookRoutes {
  constructor(vonageService, rasaService, webhookData) {
    this.vonageService = vonageService;
    this.rasaService = rasaService;
    this.webhookData = webhookData;
    this.setupRoutes();
  }

  setupRoutes() {
    router.post('/inbound-message', this.handleInboundMessage.bind(this));
    router.post('/message-status', this.handleMessageStatus.bind(this));
    router.post('/simulate/inbound', this.handleSimulate.bind(this));
    router.get('/data', this.getWebhookData.bind(this));
    router.get('/export', this.exportWebhookData.bind(this));
    router.post('/clear', this.clearWebhookData.bind(this));
  }

  async handleInboundMessage(req, res) {
    console.log('INBOUND MESSAGE RECEIVED:');
    console.log(req.body);
    this.webhookData.save('inbound_message', req.body);

    const msgObj = req.body.message || req.body;
    const content = msgObj?.content || {};
    const text = content?.text || msgObj?.text || '';
    const from = msgObj?.from?.number || req.body.msisdn || req.body.from;
    const to = msgObj?.to?.number || req.body.to;
    const channel = (msgObj?.from?.type || req.body.channel || '').toLowerCase();
    const senderId = `vonage-${from || 'unknown'}`;

    if (!text) {
      return res.status(200).send('No text to process');
    }

    const rasaResult = await this.rasaService.sendMessage(senderId, text);
    this.webhookData.save('rasa_response', { 
      to: from, 
      channel, 
      messages: rasaResult.messages, 
      fallback: rasaResult.fallback 
    });

    for (const message of rasaResult.messages) {
      if (message?.text) {
        await this.vonageService.sendMessage(channel, from, to, message.text);
      }
    }

    res.status(200).send('OK');
  }

  handleMessageStatus(req, res) {
    console.log('MESSAGE STATUS UPDATE RECEIVED:');
    console.log(req.body);
    this.webhookData.save('message_status', req.body);
    res.status(200).send('OK');
  }

  async handleSimulate(req, res) {
    try {
      const { 
        channel = 'whatsapp', 
        from = '14155550123', 
        to = config.vonage.whatsappNumber || '14155550100', 
        text = 'Hello from simulate' 
      } = req.body || {};
      
      const body = {
        message: {
          from: { type: channel, number: from },
          to: { type: channel, number: to },
          content: { text }
        }
      };
      
      await fetch(`http://localhost:${config.server.port}/webhooks/inbound-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      return res.json({ ok: true });
    } catch (e) {
      console.error('simulate/inbound error', e);
      return res.status(500).json({ ok: false });
    }
  }

  getWebhookData(req, res) {
    const data = this.webhookData.read();
    return res.json(data);
  }

  exportWebhookData(req, res) {
    const fileContent = this.webhookData.export();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="webhook_data.json"');
    return res.send(fileContent);
  }

  clearWebhookData(req, res) {
    const result = this.webhookData.clear();
    if (result.success) {
      return res.json({ ok: true });
    } else {
      return res.status(500).json({ ok: false });
    }
  }

  getRouter() {
    return router;
  }
}

module.exports = WebhookRoutes;
