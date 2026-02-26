const express = require('express');
const cors = require('cors');
const httpProxy = require('http-proxy');
const app = express();
const PORT = 4000;

app.use(cors());

const proxy = httpProxy.createProxyServer();

app.use('/places', (req, res) => {
    proxy.web(req, res, { target: 'http://localhost:4001/api/places' }, (err) => {
        res.status(500).send('Places service is down.');
    });
});

app.use('/media', (req, res) => {
    proxy.web(req, res, { target: 'http://localhost:4002/api/media' }, (err) => {
        res.status(500).send('AI Media service is down.');
    });
});

app.listen(PORT, () => {
    console.log(`API Gateway serving at http://localhost:${PORT}`);
});
