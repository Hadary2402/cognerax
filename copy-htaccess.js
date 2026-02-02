// Script to copy .htaccess to out directory after build
const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, '.htaccess');
const destFile = path.join(__dirname, 'out', '.htaccess');

if (fs.existsSync(sourceFile)) {
  fs.copyFileSync(sourceFile, destFile);
  console.log('✅ .htaccess copied to out directory');
} else {
  console.warn('⚠️ .htaccess not found in root directory');
}
