const express = require('express');
const { exec } = require('child_process');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home page route
app.get('/', (req, res) => {
    res.sendFile('server.html', { root: __dirname });
});

// /download endpoint
// /download endpoint
app.get('/download', (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    // Using yt-dlp as a Python module
    const ytDlpCommand = `python3 /usr/src/app/yt-dlp/yt_dlp/__main__.py -g "${url}"`;
    exec(ytDlpCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Failed to fetch video URL');
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }

        // stdout contains the URL(s)
        const videoUrl = stdout.trim();
        if (videoUrl) {
            // Stream the video directly to the client
            fetch(videoUrl).then(response => {
                if (response.ok) {
                    res.setHeader('Content-Type', 'video/mp4');
                    response.body.pipe(res);
                } else {
                    console.error('Error fetching video:', response.statusText);
                    res.status(response.status).send('Failed to fetch video');
                }
            }).catch(error => {
                console.error('Error streaming video:', error);
                res.status(500).send('Failed to stream video');
            });
        } else {
            res.status(404).send('No video found');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
