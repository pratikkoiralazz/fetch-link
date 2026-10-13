const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Backend API Processing Pipeline Endpoint
app.post('/api/download', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        const response = await fetch('https://co.wuk.sh/api/json', {
            method: 'POST',
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
                url: url, 
                vQuality: 'max', 
                filenamePattern: 'classic' 
            })
        });
        
        const data = await response.json();

        if (data.status === 'error' || !data.url) {
            return res.status(400).json({ error: 'Could not extract direct stream from link.' });
        }

        res.json({
            platform: url.includes('instagram') ? 'instagram' : 'youtube',
            title: data.filename || 'Extracted Media File',
            thumbnail: data.thumbnail,
            downloadUrl: data.url
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server processing failed.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 OmniDownloader Pro running live at: http://localhost:${PORT}`);
});