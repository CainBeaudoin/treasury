const fs = require('fs');
const path = require('path');

module.exports = function handler(req, res) {
  const htmlPath = path.join(process.cwd(), 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');

  if (!html.includes('policy-overrides.js')) {
    html = html.replace('</body>', '  <script src="/policy-overrides.js"></script>\n</body>');
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  res.status(200).send(html);
};
