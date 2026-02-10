
import express from 'express';
import fetch from 'node-fetch';
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware para liberar CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.sendStatus(200);
  }
  next();
});

app.get('/api/image-proxy', async (req, res) => {
  let url = req.query.url;
  if (!url || typeof url !== 'string') {
    res.header('Access-Control-Allow-Origin', '*');
    return res.status(400).send('Missing url param');
  }
  try {
    // Decodifica caso a URL venha codificada
    url = decodeURIComponent(url);
    console.log('Proxying:', url);
    const response = await fetch(url);
    if (!response.ok) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(403).send('Image not accessible');
    }
    // Read full body into buffer then send (ensures headers are sent)
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.length);
    console.log('Sending proxied image:', url, 'size=', buffer.length);
    res.send(buffer);
  } catch (e) {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(500).send('Error fetching image');
  }
});

app.listen(PORT, () => {
  console.log(`Image proxy server running on port ${PORT}`);
});
