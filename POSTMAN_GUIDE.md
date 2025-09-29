# 📬 Postman Testing Guide

This guide explains how to use Postman to test the API endpoints of the Multi-Channel Customer Service Bot.

## 🚀 Getting Started

1. **Install Postman**
   - Download and install Postman from [postman.com](https://www.postman.com/downloads/)
   - Launch Postman on your machine

2. **Import Collection**
   - Click "Import" in Postman
   - Select the file: `./postman/VonageConnect.postman_collection.json`
   - The collection includes all endpoints for testing

3. **Set Environment Variables**
   - Create a new environment in Postman
   - Add a variable `baseUrl` with value `http://localhost:3000`

## 🔌 Available Endpoints

### Web Chat API

#### Send Chat Message
- **Method**: POST
- **URL**: {{baseUrl}}/chat
- **Body**:
  ```json
  {
    "message": "Hello",
    "sender": "postman-user"
  }
  ```
- **Description**: Sends a message to the chatbot and gets a response

#### Check Health
- **Method**: GET
- **URL**: {{baseUrl}}/health
- **Description**: Check if RASA server is available

### Webhook API

#### Simulate WhatsApp Message
- **Method**: POST
- **URL**: {{baseUrl}}/webhooks/inbound-message
- **Body**:
  ```json
  {
    "message": {
      "from": { "type": "whatsapp", "number": "14155550123" },
      "to": { "type": "whatsapp", "number": "14155550100" },
      "content": { "text": "Hello" }
    }
  }
  ```
- **Description**: Simulates a WhatsApp message coming from a user

#### Simulate SMS Message
- **Method**: POST
- **URL**: {{baseUrl}}/webhooks/inbound-message
- **Body**:
  ```json
  {
    "message": {
      "from": { "type": "sms", "number": "14155550123" },
      "to": { "type": "sms", "number": "14155550200" },
      "content": { "text": "track order #12345" }
    }
  }
  ```
- **Description**: Simulates an SMS message coming from a user

#### Simulate Inbound Message (Simplified)
- **Method**: POST
- **URL**: {{baseUrl}}/simulate/inbound
- **Body**:
  ```json
  {
    "channel": "whatsapp",
    "from": "14155550123",
    "text": "track order #12345"
  }
  ```
- **Description**: Simplified way to simulate inbound messages

#### Get Webhook Data
- **Method**: GET
- **URL**: {{baseUrl}}/webhooks/data
- **Description**: Gets all webhook data (messages, responses, etc.)

#### Export Webhook Data
- **Method**: GET
- **URL**: {{baseUrl}}/webhooks/export
- **Description**: Exports webhook data as downloadable JSON

#### Clear Webhook Data
- **Method**: POST
- **URL**: {{baseUrl}}/webhooks/clear
- **Description**: Clears all webhook data

## 🧪 Test Scenarios

### Test Scenario 1: Basic Conversation
1. Send "Hello" via Chat API
2. Check response
3. Send "track order #12345"
4. Check response

### Test Scenario 2: WhatsApp Simulation
1. Send WhatsApp inbound message with "Hello"
2. Get webhook data to see the response
3. Send another message with "track order #12345"
4. Get webhook data to see updated responses

### Test Scenario 3: Form Flow
1. Send "Where is my order?" via WhatsApp simulation
2. Check webhook data for form activation
3. Send order number "#55555"
4. Check webhook data for order status

## 💡 Tips for Testing

1. **View Response Headers**: Click the "Headers" tab in the response section to see HTTP headers

2. **Use Collection Runner**: Test multiple requests in sequence with the Collection Runner

3. **Generate Code Snippets**: Right-click a request and select "Generate Code" to get code in various languages

4. **Environment Variables**: Use different environments for local and production testing

5. **Tests Tab**: Add JavaScript tests to automate validation of responses

6. **Visualize Responses**: Use the Visualize tab to create charts from response data

## 🛠️ Troubleshooting

### Common Issues

#### 1. Connection Refused
- Ensure Node.js server is running (`npm run start`)
- Check the port number in the baseUrl (default: 3000)

#### 2. 400 Bad Request
- Check JSON body formatting
- Ensure all required fields are included

#### 3. CORS Issues
- The server has CORS enabled for testing, but if issues persist:
  - Check if you're using the correct URL
  - Try disabling any proxy settings in Postman

#### 4. No Response from RASA
- Ensure RASA server is running (`npm run rasa:server`)
- Check RASA Actions server is running (`npm run rasa:actions`)
- The server will use fallback responses if RASA is down

## 📈 Monitoring API Calls

1. Check the Node.js terminal for detailed logs of all API calls
2. View the Channel Activity panel in the web UI (http://localhost:3000)
3. Use the webhook data endpoints to see all messages and responses

For more detailed documentation about the API endpoints, refer to the project's code or contact the development team.
