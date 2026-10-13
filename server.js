const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve the Mobile & Laptop Responsive Enterprise Frontend UI
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OmniDownloader Pro - Enterprise Media Engine</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        darkBg: '#090d16',
                        cardBg: '#111827',
                        accentPrimary: '#6366f1',
                        accentSecondary: '#a855f7'
                    }
                }
            }
        }
    </script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass-card { background: rgba(17, 24, 39, 0.75); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); }
        .glow-effect { box-shadow: 0 0 40px -10px rgba(99, 102, 241, 0.3); }
    </style>
</head>
<body class="bg-darkBg text-slate-100 min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white">

    <!-- Top Navigation Bar -->
    <header class="sticky top-0 z-50 glass-card border-b border-slate-800/80 px-4 lg:px-12 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center glow-effect">
                <i class="fa-solid fa-cloud-arrow-down text-white text-lg"></i>
            </div>
            <div>
                <h1 class="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">OmniDownloader</h1>
                <p class="text-xs text-slate-400 hidden sm:block">Production-Grade Media Engine</p>
            </div>
        </div>
        <div class="flex items-center space-x-2">
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span class="w-2 h-2 mr-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Node.js Core Online
            </span>
        </div>
    </header>

    <!-- Main Container -->
    <main class="flex-grow container mx-auto px-4 py-8 max-w-4xl flex flex-col items-center">
        
        <!-- Hero Title -->
        <div class="text-center my-6 max-w-2xl">
            <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Download Anything, Instantly.</h2>
            <p class="text-slate-400 text-sm sm:text-base">Paste any YouTube video, Music link, Instagram Reel, Post, or Profile DP below.</p>
        </div>

        <!-- Input Card -->
        <div class="w-full glass-card p-4 sm:p-6 rounded-3xl glow-effect mb-8">
            <div class="flex flex-col sm:flex-row gap-3">
                <div class="relative flex-grow">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500">
                        <i class="fa-solid fa-link"></i>
                    </span>
                    <input type="url" id="mediaUrl" placeholder="Paste YouTube or Instagram link here..." class="w-full pl-11 pr-4 py-3.5 bg-slate-900/80 border border-slate-700/60 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-200 placeholder-slate-500 transition-all">
                </div>
                <button onclick="fetchMedia()" id="fetchBtn" class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-6 py-3.5 rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center space-x-2">
                    <span id="btnText">Extract Media</span>
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>

        <!-- Loader State -->
        <div id="loadingState" class="hidden flex-col items-center justify-center py-12 space-y-4">
            <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-sm text-slate-400">Processing link through Node.js backend pipeline...</p>
        </div>

        <!-- Result Card Container -->
        <div id="resultContainer" class="w-full hidden space-y-6">
            <div class="glass-card p-5 sm:p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row gap-6 items-center">
                <div class="relative w-full md:w-56 h-36 rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0 border border-slate-700/50">
                    <img id="resThumbnail" src="" alt="Thumbnail" class="w-full h-full object-cover">
                </div>
                <div class="flex-grow space-y-2 text-center md:text-left w-full">
                    <span id="resPlatform" class="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Media File</span>
                    <h3 id="resTitle" class="text-lg font-bold text-slate-100 line-clamp-2">Media Title</h3>
                </div>
            </div>

            <!-- Action Download Links -->
            <div class="space-y-3">
                <h4 class="text-sm font-semibold text-slate-300 uppercase tracking-wider px-1">Available Download Links</h4>
                <div id="downloadOptionsList" class="space-y-2"></div>
            </div>
        </div>

    </main>

    <!-- Footer -->
    <footer class="py-6 text-center text-xs text-slate-500 border-t border-slate-900">
        <p>&copy; 2026 OmniDownloader Pro. Mobile, Tablet & Laptop Friendly.</p>
    </footer>

    <!-- Client-side Logic Script -->
    <script>
        async function fetchMedia() {
            const urlInput = document.getElementById('mediaUrl').value.trim();
            if (!urlInput) {
                alert('Please paste a valid YouTube or Instagram link.');
                return;
            }

            const loadingState = document.getElementById('loadingState');
            const resultContainer = document.getElementById('resultContainer');
            const fetchBtn = document.getElementById('fetchBtn');

            loadingState.classList.remove('hidden');
            resultContainer.classList.add('hidden');
            fetchBtn.disabled = true;

            try {
                const response = await fetch('/api/download', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: urlInput })
                });

                const data = await response.json();
                loadingState.classList.add('hidden');
                fetchBtn.disabled = false;

                if (!response.ok) {
                    alert(data.error || 'Failed to process link.');
                    return;
                }

                document.getElementById('resTitle').textContent = data.title;
                document.getElementById('resThumbnail').src = data.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600';
                document.getElementById('resPlatform').textContent = data.platform.toUpperCase();

                const optionsList = document.getElementById('downloadOptionsList');
                optionsList.innerHTML = \`
                    <a href="\${data.downloadUrl}" target="_blank" class="glass-card p-4 rounded-2xl flex items-center justify-between hover:border-indigo-500/50 transition-all group">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <i class="fa-solid fa-download"></i>
                            </div>
                            <div>
                                <h5 class="font-bold text-sm text-slate-200">Download High Quality File</h5>
                                <p class="text-xs text-slate-400">Direct Secure Stream</p>
                            </div>
                        </div>
                        <i class="fa-solid fa-arrow-up-right-from-square text-slate-500 group-hover:text-indigo-400"></i>
                    \`;

                resultContainer.classList.remove('hidden');

            } catch (err) {
                loadingState.classList.add('hidden');
                fetchBtn.disabled = false;
                alert('Network error or server connection failed.');
            }
        }
    </script>
</body>
</html>`);
});

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
    console.log(\`🚀 OmniDownloader Pro running live at: http://localhost:\${PORT}\`);
});