const express = require('express');
const cors = require('cors');
const httpProxy = require('http-proxy');
const app = express();
const PORT = process.env.PORT || 4000;
const PLACES_SERVICE_URL = process.env.PLACES_SERVICE_URL || 'http://localhost:4001';
const AI_MEDIA_SERVICE_URL = process.env.AI_MEDIA_SERVICE_URL || 'http://localhost:4002';

app.use(cors());

const proxy = httpProxy.createProxyServer();

app.use('/places', (req, res) => {
    proxy.web(req, res, { target: `${PLACES_SERVICE_URL}/api/places` }, (err) => {
        res.status(500).send('Places service is down.');
    });
});

app.use('/media', (req, res) => {
    proxy.web(req, res, { target: `${AI_MEDIA_SERVICE_URL}/api/media` }, (err) => {
        res.status(500).send('AI Media service is down.');
    });
});

app.listen(PORT, () => {
    console.log(`API Gateway serving at http://localhost:${PORT}`);
});
