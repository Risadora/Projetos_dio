
## `index.js`

```javascript
const prompt = require('prompt-sync')();
const chalk = require('chalk');
const { generateQRCode } = require('./services/qrService');
const { saveHistory } = require('./services/historyService');

console.log(chalk.blue("\n=== GERADOR DE QR CODE E-COMMERCE ===\n"));

const url = prompt("🔗 Link do produto: ");
const fileName = prompt("📁 Nome do arquivo (enter = automático): ");
const format = prompt("📦 Formato (png/svg): ") || "png";
const showTerminal = prompt("🖥️ Mostrar no terminal? (s/n): ") === 's';

const darkColor = prompt("🎨 Cor do QR (hex): ") || "#000000";
const lightColor = prompt("🎨 Cor de fundo (hex): ") || "#ffffff";

(async () => {
  const result = await generateQRCode({
    url,
    fileName,
    format,
    darkColor,
    lightColor,
    showTerminal
  });

  saveHistory(result);

  console.log(chalk.green("\n✅ QR Code gerado com sucesso!"));
})();
```

---

## `services/qrService.js`

```javascript
const QRCode = require('qrcode');
const fs = require('fs-extra');
const path = require('path');

async function generateQRCode({
  url,
  fileName,
  format,
  darkColor,
  lightColor,
  showTerminal
}) {
  const name = fileName || `qrcode_${Date.now()}`;
  const outputDir = path.join(__dirname, '..', 'output');
  const outputPath = path.join(outputDir, `${name}.${format}`);

  const options = {
    color: {
      dark: darkColor,
      light: lightColor
    }
  };

  await fs.ensureDir(outputDir);

  await QRCode.toFile(outputPath, url, options);

  if (showTerminal) {
    const terminalQR = await QRCode.toString(url, { type: 'terminal' });
    console.log("\n");
    console.log(terminalQR);
  }

  return {
    url,
    file: outputPath,
    date: new Date().toISOString()
  };
}

module.exports = { generateQRCode };
```

---

## `services/historyService.js`

```javascript
const fs = require('fs-extra');
const path = require('path');

const historyFile = path.join(__dirname, '..', 'history.json');

function saveHistory(entry) {
  let history = [];

  if (fs.existsSync(historyFile)) {
    history = fs.readJsonSync(historyFile);
  }

  history.push(entry);

  fs.writeJsonSync(historyFile, history, { spaces: 2 });
}

module.exports = { saveHistory };
```

---

## `package.json`

```json
{
  "name": "qr-code-cli-ecommerce",
  "version": "1.0.0",
  "description": "Gerador de QR Code para e-commerce via terminal",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "chalk": "^5.3.0",
    "fs-extra": "^11.2.0",
    "prompt-sync": "^4.2.0",
    "qrcode": "^1.5.4"
  }
}
```

---

## `.gitignore`

```
node_modules/
output/
.env
```

---

## `history.json`

```json
[]
```

---

Pronto — só rodar:

```bash
npm install
node index.js
```

---
