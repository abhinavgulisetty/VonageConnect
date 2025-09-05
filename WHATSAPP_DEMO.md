# 📱 WhatsApp Demo Commands

Use these curl commands in a separate terminal to simulate WhatsApp messages for your demo.

## 🔧 Setup
Make sure your Node.js server is running:
```powershell
npm run start
```

## 📞 WhatsApp Message Simulation

### Basic Greeting
```powershell
curl -X POST http://localhost:3000/webhooks/inbound-message `
  -H "Content-Type: application/json" `
  -d '{
    "message": {
      "from": { "type": "whatsapp", "number": "14155550123" },
      "to": { "type": "whatsapp", "number": "14155550100" },
      "content": { "text": "Hello" }
    }
  }'
```

### Track Order #12345
```powershell
curl -X POST http://localhost:3000/webhooks/inbound-message `
  -H "Content-Type: application/json" `
  -d '{
    "message": {
      "from": { "type": "whatsapp", "number": "14155550123" },
      "to": { "type": "whatsapp", "number": "14155550100" },
      "content": { "text": "track order #12345" }
    }
  }'
```

### Track Order #98765
```powershell
curl -X POST http://localhost:3000/webhooks/inbound-message `
  -H "Content-Type: application/json" `
  -d '{
    "message": {
      "from": { "type": "whatsapp", "number": "14155550123" },
      "to": { "type": "whatsapp", "number": "14155550100" },
      "content": { "text": "track order #98765" }
    }
  }'
```

### Where is my order? (Form activation)
```powershell
curl -X POST http://localhost:3000/webhooks/inbound-message `
  -H "Content-Type: application/json" `
  -d '{
    "message": {
      "from": { "type": "whatsapp", "number": "14155550123" },
      "to": { "type": "whatsapp", "number": "14155550100" },
      "content": { "text": "Where is my order?" }
    }
  }'
```

### Follow up with order number
```powershell
curl -X POST http://localhost:3000/webhooks/inbound-message `
  -H "Content-Type: application/json" `
  -d '{
    "message": {
      "from": { "type": "whatsapp", "number": "14155550123" },
      "to": { "type": "whatsapp", "number": "14155550100" },
      "content": { "text": "#55555" }
    }
  }'
```

## 📨 SMS Message Simulation

### Track Order via SMS
```powershell
curl -X POST http://localhost:3000/webhooks/inbound-message `
  -H "Content-Type: application/json" `
  -d '{
    "message": {
      "from": { "type": "sms", "number": "14155550123" },
      "to": { "type": "sms", "number": "14155550200" },
      "content": { "text": "track order #77777" }
    }
  }'
```

## 🎯 Demo Flow Suggestions

### **Scenario 1: Quick Order Lookup**
1. Run the "Track Order #12345" command
2. Show the web interface Channel Activity panel
3. Explain how the webhook received the WhatsApp message and responded

### **Scenario 2: Conversation Flow**
1. Send "Where is my order?" (form activation)
2. Wait a moment for the response
3. Send "#55555" as follow-up
4. Show the complete conversation in Channel Activity

### **Scenario 3: Multi-Channel**
1. Send WhatsApp message: "Hello"
2. Send SMS message: "track order #77777"
3. Show both conversations in the activity panel
4. Explain how same bot handles both channels

## 📊 Monitoring Responses

After running any curl command:
1. Check the Node.js server terminal for logs
2. Look at the Channel Activity panel on http://localhost:3000
3. You'll see:
   - `inbound_message` - The incoming WhatsApp/SMS
   - `rasa_response` - The bot's reply (or fallback if RASA offline)

## 🎭 Demo Mode Features

- **Works without real Vonage setup** - Simulates message sending
- **Real webhook processing** - Same code path as production
- **Activity monitoring** - See all message flow in real-time
- **Fallback responses** - Works even if RASA server is down

## 🔄 Alternative: Use the /simulate/inbound endpoint

For simpler testing, you can also use:
```powershell
curl -X POST http://localhost:3000/simulate/inbound `
  -H "Content-Type: application/json" `
  -d '{
    "channel": "whatsapp",
    "from": "14155550123",
    "text": "track order #12345"
  }'
```

## 💡 Pro Tips

1. **Run curl commands in a separate terminal** while showing the web UI
2. **Use different phone numbers** to simulate different customers
3. **Try various order numbers** to show different statuses
4. **Mix WhatsApp and SMS** to demonstrate multi-channel support
5. **Show the Channel Activity panel** to explain webhook processing

This approach provides a more realistic demo experience that matches how real webhook integration would work in production! 🚀
