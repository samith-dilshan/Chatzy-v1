const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({ auth: state });

    sock.ev.on('connection.update', ({ connection, qr }) => {
        if (qr) {
            console.log("Scan this QR Code:");
            qrcode.generate(qr, { small: true });
        }
        if (connection === 'open') {
            console.log("✅ Bot Connected to WhatsApp!");
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (msg) => {
        if (msg.messages[0].key.remoteJid) {
            const sender = msg.messages[0].key.remoteJid;
            await sock.sendMessage(sender, { text: "its working" });
            console.log(`📩 Message received from ${sender}`);
        }
    });
}

module.exports = startBot;
