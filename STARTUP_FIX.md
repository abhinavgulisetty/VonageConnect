# 🔧 Fixing the 502 Bad Gateway Error

The 502 error occurs because the Node.js server can't connect to the RASA server. Here's how to fix it:

## **Quick Fix - Start Services in Correct Order**

### **Step 1: Start RASA Actions Server**
Open PowerShell/Command Prompt #1:
```powershell
cd "C:\Users\Abhinav\Downloads\multi-channel-customer-service-bot-main\multi-channel-customer-service-bot-main"
npm run rasa:actions
```
Wait for: "Action endpoint is up and running on http://localhost:5055"

### **Step 2: Start RASA Core Server**
Open PowerShell/Command Prompt #2:
```powershell
cd "C:\Users\Abhinav\Downloads\multi-channel-customer-service-bot-main\multi-channel-customer-service-bot-main"
npm run rasa:server
```
Wait for: "Rasa server is up and running"

### **Step 3: Start Node.js Server**
Open PowerShell/Command Prompt #3:
```powershell
cd "C:\Users\Abhinav\Downloads\multi-channel-customer-service-bot-main\multi-channel-customer-service-bot-main"
npm run start
```
Wait for: "RASA server is running and ready!"

### **Step 4: Test the Demo**
- Open: http://localhost:3000
- Try typing: "Hello"
- Should get a proper response now!

---

##  **Alternative: Use the Batch Script**

Run this in Command Prompt (not PowerShell):
```cmd
start-all-services.bat
```

This will automatically start all services in the correct order.

---

##  **Troubleshooting**

### If RASA Actions Server Won't Start:
```powershell
cd "rasa_customer_care chatbot"
.\.venv\Scripts\activate
rasa run actions --port 5055
```

### If RASA Core Server Won't Start:
```powershell
cd "rasa_customer_care chatbot"
.\.venv\Scripts\activate
rasa run --enable-api --cors "*" --port 5005
```

### If Node.js Server Shows Errors:
```powershell
# Check if ports are in use
netstat -ano | findstr ":3000\|:5005\|:5055"

# Kill processes if needed
taskkill /PID [PID_NUMBER] /F
```

### Test RASA Server Directly:
```powershell
# Test if RASA is responding
curl http://localhost:5005/status
```
Should return JSON with model information.

---

##  **Expected Terminal Output**

**Terminal 1 (RASA Actions):**
```
Action endpoint is up and running on http://localhost:5055
```

**Terminal 2 (RASA Core):**
```
Rasa server is up and running on http://localhost:5005
```

**Terminal 3 (Node.js):**
```
 Node.js server listening at http://localhost:3000
 RASA server is running and ready!
```

---

##  **Pro Tips**

1. **Always start RASA first** - Node.js needs to connect to it
2. **Wait between starts** - Give each service 10-30 seconds to fully initialize
3. **Check ports** - Make sure 3000, 5005, and 5055 aren't in use
4. **Use fallback mode** - Even if RASA fails, the bot will work with intelligent responses

---

##  **If All Else Fails - Demo Mode**

The bot has built-in fallback responses! Even if RASA doesn't start, you can still demo the bot:

1. Just start the Node.js server: `npm run start`
2. Open http://localhost:3000
3. Try chatting - you'll get intelligent fallback responses
4. Use "Simulate inbound" for WhatsApp/SMS demo

The fallback responses include:
- Order tracking for demo order numbers
- Helpful guidance messages  
- Natural conversation handling

This ensures your demo always works! 🎉
