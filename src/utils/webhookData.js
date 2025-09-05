const fs = require('fs');
const config = require('../config');

class WebhookData {
  constructor() {
    this.dataFile = config.server.dataFile;
  }

  save(type, payload) {
    let data = [];
    try {
      const fileContent = fs.readFileSync(this.dataFile, 'utf8');
      data = JSON.parse(fileContent);
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log(`- Data file '${this.dataFile}' not found. A new file will be created.`);
      } else {
        console.error('Error reading data file:', err);
      }
    }

    const newEntry = {
      timestamp: new Date().toISOString(),
      type: type,
      payload: payload,
    };

    data.push(newEntry);

    fs.writeFile(this.dataFile, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing to data file:', err);
      } else {
        console.log(`- Webhook payload successfully saved to ${this.dataFile}.`);
      }
    });
  }

  read() {
    try {
      const fileContent = fs.readFileSync(this.dataFile, 'utf8');
      return JSON.parse(fileContent || '[]');
    } catch (e) {
      return [];
    }
  }

  export() {
    try {
      const fileContent = fs.readFileSync(this.dataFile, 'utf8');
      return fileContent || '[]';
    } catch (e) {
      return '[]';
    }
  }

  clear() {
    try {
      fs.writeFileSync(this.dataFile, '[]', 'utf8');
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

module.exports = WebhookData;
