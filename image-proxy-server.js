
import express from 'express';
import fetch from 'node-fetch';
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware para liberar CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/image-proxy', async (req, res) => {
  let url = req.query.url;
  if (!url || typeof url !== 'string') return res.status(400).send('Missing url param');
  try {
    // Decodifica caso a URL venha codificada
    url = decodeURIComponent(url);
    const response = await fetch(url);
    if (!response.ok) return res.status(403).send('Image not accessible');
    res.set('Content-Type', response.headers.get('content-type'));
    response.body.pipe(res);
  } catch (e) {
    res.status(500).send('Error fetching image');
  }
});

app.listen(PORT, () => {
  console.log(`Image proxy server running on port ${PORT}`);
});
