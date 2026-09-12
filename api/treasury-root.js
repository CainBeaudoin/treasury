const fs = require('fs');
const path = require('path');

module.exports = function handler(req, res) {
  const htmlPath = path.join(process.cwd(), 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');

  const scripts = [
    '  <script src="/policy-overrides.js"></script>',
    '  <script src="/policy-fixes.js"></script>'
  ];

  if (!html.includes('policy-overrides.js')) {
    html = html.replace('</body>', `${scripts.join('\n')}\n</body>`);
  } else if (!html.includes('policy-fixes.js')) {
    html = html.replace('</body>', `${scripts[1]}\n</body>`);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  res.status(200).send(html);
};
