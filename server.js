const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SECRET_KEY = Buffer.from(process.env.SECRET_KEY, 'hex');

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return iv.toString('hex') + ':' + encrypted;
}

function verifyRequest(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
}



app.post('/login', async (req, res) => {
    try {
        const response = await fetch(process.env.FIREBASE_URL, {
            method: 'POST',
            body: new URLSearchParams(req.body)
        });
        const data = await response.text();
        res.send(encrypt(data));
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
});

function decrypt(encryptedText) {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, iv);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

app.post('/connect', async (req, res) => {
    try {
        const response = await fetch('https://nerox.hexhost.online/public/connect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: new URLSearchParams(req.body)
        });
        const data = await response.text();
        res.send(encrypt(data));
    } catch (err) {
        res.status(500).json({ error: err.message }); // نرى الخطأ الحقيقي
    }
});
app.get('/token', async (req, res) => {
    try {
        res.send(encrypt(process.env.BOT_TOKEN));
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
});

app.get('/chatid', async (req, res) => {
    try {
        res.send(encrypt(process.env.getTelegramChatId));
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
});

app.get('/firebase', async (req, res) => {
    try {
        res.send(encrypt(process.env.FIREBASE_URL));
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
});

app.get('/update', async (req, res) => {
    try {
        res.send(encrypt(process.env.TARGET_URL));
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
});

app.get('/bypass', async (req, res) => {
    try {
        res.send(encrypt(process.env.URLJSON));
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
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