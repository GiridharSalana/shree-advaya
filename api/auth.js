export default function handler(req, res) {
  const { host } = req.headers;
  const protocol = host.includes('localhost') ? 'http' : 'https';
  
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <script>
        if (window.opener) {
          const token = localStorage.getItem('githubToken');
          window.opener.postMessage(
            'authorization:github:success:' + JSON.stringify({
              token: token,
              provider: 'github'
            }),
            '${protocol}://${host}'
          );
        }
        window.close();
      </script>
    </head>
    <body>
      <p>Authorizing...</p>
    </body>
    </html>
  `);
}
