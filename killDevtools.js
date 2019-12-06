const fs = require('fs');

try {
  fs.unlinkSync('C:\\Users\\Philipp\\AppData\\Roaming\\Hyper\\DevTools Extensions');
} catch(e) {}
