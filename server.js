const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// Serve every file inside /public as a static asset
app.use(express.static(path.join(__dirname, 'public')));

// Serve product images from /Images at the /images URL path
app.use('/images', express.static(path.join(__dirname, 'Images')));

// For any unmatched route, return index.html (SPA-friendly)
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log('\n🌿  FlourWiz Bakery is live!');
  console.log(`    ➜  http://localhost:${PORT}\n`);
  console.log('    Press Ctrl+C to stop the server.\n');
});
