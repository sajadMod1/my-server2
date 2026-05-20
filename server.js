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
// 1. مسار توكن البوت
app.get('/token', async (req, res) => {
    try {
        res.send(encrypt(process.env.BOT_TOKEN));
    } catch (err) {
        res.status(500).json({ error: 'Failed to process token' });
    }
});
app.post('/login', async (req, res) => {
    try {
        const connectUrl = process.env.CONNECT_URL; // https://ner.elementfx.com/connect
        
        const response = await fetch(connectUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: new URLSearchParams(req.body)
        });
        
        const data = await response.text();
        res.send(encrypt(data)); // يرجع JSON مشفر
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
});
// 2. مسار معرف الشات
app.get('/chatid', async (req, res) => {
    try {
        res.send(encrypt(process.env.getTelegramChatId));
    } catch (err) {
        res.status(500).json({ error: 'Failed to process chat ID' });
    }
});

// 3. مسار قاعدة بيانات فايربيز
app.get('/firebase', async (req, res) => {
    try {
        res.send(encrypt(process.env.FIREBASE_URL));
    } catch (err) {
        res.status(500).json({ error: 'Failed to process firebase URL' });
    }
});

// 4. مسار التحديث
app.get('/update', async (req, res) => {
    try {
        res.send(encrypt(process.env.TARGET_URL));
    } catch (err) {
        res.status(500).json({ error: 'Failed to process update URL' });
    }
});

// 5. مسار التخطي
app.get('/bypass', async (req, res) => {
    try {
        res.send(encrypt(process.env.URLJSON));
    } catch (err) {
        res.status(500).json({ error: 'Failed to process bypass URL' });
    }
});


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