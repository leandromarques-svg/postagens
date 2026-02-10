
import express from 'express';
import fetch from 'node-fetch';
const app = express();
const PORT = process.env.PORT || 4000;

app.get('/api/image-proxy', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url param');
  try {
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
