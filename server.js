const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/download', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        const response = await fetch('https://api.cobalt.tools/api/json', {
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

        if (data.status === 'error' || (!data.url && !data.picker)) {
            return res.status(400).json({ error: 'Could not extract direct stream from link. Try another link or check URL.' });
        }

        let videoUrl = data.url || '';
        let audioUrl = data.url || '';

        if (data.picker && data.picker.length > 0) {
            const videoOpt = data.picker.find(p => p.type === 'video') || data.picker[0];
            const audioOpt = data.picker.find(p => p.type === 'audio') || data.picker[0];
            videoUrl = videoOpt.url;
            audioUrl = audioOpt.url;
        }

        res.json({
            platform: url.includes('instagram') ? 'instagram' : 'youtube',
            title: data.filename || 'Extracted Media File',
            thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
            videoUrl: videoUrl,
            audioUrl: audioUrl
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server processing failed.' });
    }
});

// Clean and reliable redirect route to trigger instant browser downloads
app.get('/api/proxy-download', (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send('URL required');
    res.redirect(targetUrl);
});

app.listen(PORT, () => {
    console.log(`🚀 OmniDownloader Pro running live at: http://localhost:${PORT}`);
});