import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import request from 'request';
import process from 'process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist'))); // Change 'build' to 'dist'

// Proxy route to Spring Boot backend
app.use('/api', (req, res) => {
    const url = `http://localhost:9090${req.originalUrl}`;
    req.pipe(request(url))
        .on('error', (err) => {
            console.error('Backend connection error:', err.message);
            res.status(503).json({ error: 'Backend service unavailable' });
        })
        .pipe(res);
});

// Catchall handler for any requests that don't match
app.get((req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});