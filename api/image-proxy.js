export default async function handler(req, res) {
  const url = req.query.url;
  if (!url || typeof url !== 'string') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(400).send('Missing url param');
  }

  try {
    const decoded = decodeURIComponent(url);
    const response = await fetch(decoded);
    if (!response.ok) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(403).send('Image not accessible');
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.length);
    return res.status(200).send(buffer);
  } catch (err) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).send('Error fetching image');
  }
}
