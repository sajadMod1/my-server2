const express = require('express');
const crypto = require('crypto');
const app = express();

const SECRET_KEY = process.env.SECRET_KEY;
const IV = process.env.IV;

function encrypt(text) {
    const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(SECRET_KEY),
        Buffer.from(IV)
    );
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

// الروابط والبيانات المشفرة
app.get('/token',    (req, res) => res.send(encrypt(process.env.BOT_TOKEN)));
app.get('/chatid',   (req, res) => res.send(encrypt(process.env.getTelegramChatId)));
app.get('/firebase', (req, res) => res.send(encrypt(process.env.FIREBASE_URL)));
app.get('/update',   (req, res) => res.send(encrypt(process.env.TARGET_URL)));
app.get('/bypass',   (req, res) => res.send(encrypt(process.env.URLJSON)));

app.get('/config', async (req, res) => {
    try {
        const response = await fetch(process.env.TARGET_URL);
        const data = await response.text();
        res.send(encrypt(data));
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
});

app.get('/download', async (req, res) => {
    try {
        res.send(encrypt(process.env.DOWNLOAD_URL));
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
});

module.exports = app;