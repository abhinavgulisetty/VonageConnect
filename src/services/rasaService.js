const fetch = global.fetch || require('node-fetch');
const config = require('../config');

class RasaService {
  constructor() {
    this.webhookUrl = config.rasa.webhookUrl;
    this.statusUrl = config.rasa.statusUrl;
  }

  async sendMessage(senderId, message) {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: senderId, message })
      });
      
      if (!response.ok) {
        throw new Error(`RASA server returned ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, messages: data };
    } catch (err) {
      console.error('Error reaching RASA, using fallback:', err.message);
      const fallbackText = this.getFallbackResponse(message);
      return { 
        success: false, 
        messages: [{ text: fallbackText }], 
        fallback: true 
      };
    }
  }

  async checkStatus() {
    try {
      const response = await fetch(this.statusUrl);
      if (response.ok) {
        const status = await response.json();
        return { available: true, status };
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      return { available: false, error: error.message };
    }
  }

  getFallbackResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('track') && lowerMsg.includes('order') || lowerMsg.includes('#')) {
      const orderMatch = message.match(/#?(\d{3,8})/); 
      if (orderMatch) {
        const orderNum = orderMatch[1];
        const mockStatuses = {
          '12345': 'Out for delivery - Expected delivery today by 6 PM',
          '98765': 'Shipped - Tracking number: 1Z999AA1234567890',
          '55555': 'Processing - Your order is being prepared',
          '54321': 'Delivered - Package left at front door',
          '77777': 'In transit - Currently at sorting facility'
        };
        const status = mockStatuses[orderNum] || 'Processing - We\'ll update you soon';
        return `📦 Status for order #${orderNum}: ${status}`;
      }
      return '🔍 Please provide your order number (e.g., #12345) to track your order.';
    }
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      return '👋 Hello! I\'m your customer service assistant. I can help you track orders. Try asking "track order #12345"';
    }
    
    if (lowerMsg.includes('help')) {
      return '🤖 I can help you with:\n• Order tracking - say "track order #12345"\n• Order status inquiries\n• General customer support';
    }
    
    if (lowerMsg.includes('bye') || lowerMsg.includes('goodbye')) {
      return '👋 Goodbye! Feel free to reach out anytime you need help with your orders!';
    }
    
    if (lowerMsg.includes('thank')) {
      return '😊 You\'re welcome! Is there anything else I can help you with today?';
    }
    
    return '🤖 I\'m here to help! You can ask me to track an order by saying "track order #12345" or ask me any questions about your orders.';
  }
}

module.exports = RasaService;
