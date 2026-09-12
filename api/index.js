module.exports = async function handler(req, res) {
  try {
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host;
    const sourceUrl = `${proto}://${host}/index.html`;
    const source = await fetch(sourceUrl, { cache: 'no-store' });

    if (!source.ok) {
      res.status(500).send('Unable to load treasury dashboard.');
      return;
    }

    let html = await source.text();
    const scripts = [
      '<script src="/policy-overrides.js"></script>',
      '<script src="/policy-fixes.js"></script>'
    ].join('\n');

    if (!html.includes('/policy-overrides.js')) {
      html = html.replace('</body>', `${scripts}\n</body>`);
    } else if (!html.includes('/policy-fixes.js')) {
      html = html.replace('</body>', '<script src="/policy-fixes.js"></script>\n</body>');
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(html);
  } catch (error) {
    console.error('Treasury dashboard render failed', error);
    res.status(500).send('Unable to load treasury dashboard.');
  }
};
