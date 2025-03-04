const express = require('express');
const qrcode = require('qrcode');
const fs = require('fs');
const startBot = require('./bot');

const app = express();
let qrCodeData = '';

async function generateQR() {
    return new Promise((resolve, reject) => {
        fs.readFile('auth_info/creds.json', async (err) => {
            if (err) {
                console.log("Generating new QR code...");
                resolve(qrCodeData);
            } else {
                console.log("Already authenticated, no QR needed.");
                resolve(null);
            }
        });
    });
}

app.get('/', async (req, res) => {
    const qrData = await generateQR();
    if (qrData) {
        qrcode.toDataURL(qrData, (err, url) => {
            if (err) return res.send("Error generating QR code");
            res.send(`<img src="${url}" />`);
        });
    } else {
        res.send("Bot already connected!");
    }
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`🌐 Web Server Running on http://localhost:${PORT}`);
    startBot();
});
