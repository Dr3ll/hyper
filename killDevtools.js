const fs = require('fs');

try {
  fs.unlinkSync('C:\\Users\\drell\\AppData\\Roaming\\Hyper\\DevTools Extensions');
} catch(e) {}
