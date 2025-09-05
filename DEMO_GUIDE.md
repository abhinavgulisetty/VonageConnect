# 🎭 Demo Guide - Multi-Channel Customer Service Bot

This guide will help you run and demonstrate the RASA + Vonage multi-channel customer service bot.

## Quick Start (Demo Mode)

The bot is designed to work in demo mode even without a proper Vonage setup. It includes fallback responses and simulation features.

### Prerequisites

1. **Python 3.8-3.10** with pip
2. **Node.js** (v14+) with npm
3. **Git** (optional)

### Setup Instructions

1. **Install Dependencies**
   ```powershell
   # Install Node.js dependencies
   npm install
   
   # Setup Python virtual environment for RASA
   cd "rasa_customer_care chatbot"
   python -m venv .venv
   .\.venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Train RASA Model**
   ```powershell
   # From the "rasa_customer_care chatbot" directory
   rasa train
   ```

3. **Start All Services** (Use 3 separate terminal windows)

   **Terminal 1 - Node.js Server:**
   ```powershell
   npm run start
   ```

   **Terminal 2 - RASA Actions Server:**
   ```powershell
   npm run rasa:actions
   ```

   **Terminal 3 - RASA Core Server:**
   ```powershell
   npm run rasa:server
   ```

4. **Open Demo**
   - Visit: http://localhost:3000
   - The web interface should load with the customer service bot
   - Keep `WHATSAPP_DEMO.md` open for curl commands

## Demo Scenarios

### Scenario 1: Web Chat Demo
1. Open http://localhost:3000
2. Try these sample conversations:
   - "Hello"
   - "track order #12345"
   - "Where is my order?"
   - "track order #98765"

### Scenario 2: WhatsApp/SMS Testing via Terminal
1. Open a separate terminal/PowerShell window
2. Use curl commands from `WHATSAPP_DEMO.md`
3. Example: `curl -X POST http://localhost:3000/webhooks/inbound-message -H "Content-Type: application/json" -d '{"message":{"from":{"type":"whatsapp","number":"14155550123"},"to":{"type":"whatsapp","number":"14155550100"},"content":{"text":"track order #12345"}}}'`
4. Check the "Channel Activity" panel to see the webhook data in real-time

### Scenario 3: API Fallback Demo
1. Stop the RASA server (Terminal 3)
2. Try chatting - the bot will use intelligent fallback responses
3. Restart RASA server to resume full functionality

##  Demo Order Numbers

The bot includes these pre-configured demo orders:

| Order Number | Status | Description |
|-------------|--------|-------------|
| #12345 | 📦 Out for delivery | Expected delivery today by 6 PM |
| #98765 | 🚛 Shipped | Tracking: 1Z999AA1234567890, 2-3 business days |
| #55555 | ⚙️ Processing | Order is being prepared for shipment |
| #54321 | ✅ Delivered | Left at front door on Dec 4, 2024 at 2:30 PM |
| #77777 | 📍 In transit | Currently at sorting facility in Chicago, IL |
| #11111 | 🔄 Order confirmed | Payment processed, preparing to ship |
| #22222 | 🚚 Out for delivery | Driver arrives between 10 AM - 2 PM today |
| #33333 | ⏳ Delayed | Weather delay, 1-2 days |
| #44444 | 📋 Ready for pickup | Available at local pickup location |
| #67890 | ✅ Delivered | Signed for by J. Smith on Dec 3, 2024 |

##  Test Cases

### Basic Functionality
-  Greeting responses
-  Order tracking with form
-  Order tracking with inline numbers
-  Goodbye messages
-  Bot challenge responses

### Advanced Features
-  Multi-turn conversations
-  Form handling when order number is missing
-  Fallback responses when RASA is offline
-  Webhook simulation for Vonage channels
-  Real-time activity monitoring

### Error Handling
-  Invalid order numbers
-  RASA server unavailable
-  Vonage API failures (graceful degradation)
-  Malformed requests

## Troubleshooting

### RASA Server Issues
```powershell
# Check if RASA server is running
curl http://localhost:5005/status

# Retrain model if needed
cd "rasa_customer_care chatbot"
rasa train --force
```

### Port Conflicts
- Node.js Server: Port 3000
- RASA Core: Port 5005  
- RASA Actions: Port 5055

Change ports in `package.json` scripts if needed.

### Python Environment
```powershell
# Recreate virtual environment if issues
cd "rasa_customer_care chatbot"
rmdir /s .venv
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

## Demo Script 

### Opening (2 minutes)
1. "This is a multi-channel customer service bot built with RASA AI and Vonage APIs"
2. Show the web interface at http://localhost:3000
3. Point out the Channel Activity panel showing real-time webhook data

### Core Functionality (3 minutes)
1. **Basic Chat**: Type "Hello" - show intelligent greeting
2. **Order Tracking**: Type "track order #12345" - show immediate response
3. **Form Handling**: Type "Where is my order?" - show form activation and slot filling
4. **Multiple Orders**: Try different order numbers (#98765, #54321) - show variety

### Multi-Channel Demo (2 minutes)
1. Open a separate terminal for curl commands
2. Run WhatsApp command: `curl -X POST http://localhost:3000/webhooks/inbound-message -H "Content-Type: application/json" -d '{"message":{"from":{"type":"whatsapp","number":"14155550123"},"to":{"type":"whatsapp","number":"14155550100"},"content":{"text":"Hello"}}}'`
3. Run SMS command: `curl -X POST http://localhost:3000/webhooks/inbound-message -H "Content-Type: application/json" -d '{"message":{"from":{"type":"sms","number":"14155550123"},"to":{"type":"sms","number":"14155550200"},"content":{"text":"track order #77777"}}}'`
4. Show both conversations in the Channel Activity panel
5. Explain how the same bot handles multiple channels seamlessly

### Resilience Demo (2 minutes)
1. Stop the RASA server (Ctrl+C in Terminal 3)
2. Try chatting - show fallback responses still work
3. Restart RASA server - show full functionality restored
4. Emphasize "Production-ready with graceful degradation"

### Technical Highlights (1 minute)
1. "Built with open-source RASA for full control"
2. "Vonage APIs for professional WhatsApp/SMS channels"
3. "Real-time monitoring and webhook handling"
4. "Scalable architecture ready for enterprise deployment"

## 📝 Configuration Notes

### Environment Variables (.env)
```
VONAGE_APPLICATION_ID=6a007a2f-f02c-46a4-ba63-fc349b2cae09
VONAGE_PRIVATE_KEY_PATH=./private.key
VONAGE_WHATSAPP_NUMBER=14155550100
VONAGE_SMS_NUMBER=14155550100
RASA_REST_WEBHOOK=http://localhost:5005/webhooks/rest/webhook
```

### Demo Mode Features
-  Works without real Vonage credentials
-  Intelligent fallback responses
-  Webhook simulation
-  Comprehensive error handling
-  Real-time activity monitoring

## Production Deployment

For production use:
1. Set up real Vonage Application with WhatsApp/SMS numbers
2. Configure proper webhook URLs with ngrok or similar
3. Deploy on cloud platform (AWS, Azure, GCP)
4. Set up proper database for order tracking
5. Implement authentication and security measures

## Support

If you encounter issues:
1. Check all three terminals are running
2. Verify Python virtual environment is activated
3. Ensure ports 3000, 5005, and 5055 are available
4. Check webhook_data.json for error logs
5. Use fallback mode if RASA training fails

---

