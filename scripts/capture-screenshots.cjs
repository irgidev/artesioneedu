const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const PORT = 5173;
const BASE_URL = `http://localhost:${PORT}`;
const OUTPUT_DIR = path.join(__dirname, 'screenshots');

// Page configurations for screenshots
const pages = [
  {
    name: '01_Homepage',
    url: '/',
    label: '🏠 Beranda',
    description: 'Halaman utama dengan hero card, quick stats, dan daftar mata kuliah'
  },
  {
    name: '02_SubjectPage',
    url: '/subject/psd',
    label: '📚 Halaman Mata Kuliah',
    description: 'Detail mata kuliah PSD, pilih mode latihan (UAS / Per BAB)'
  },
  {
    name: '03_ChaptersPage',
    url: '/chapters/psd',
    label: '📖 Daftar BAB',
    description: 'Daftar 12 BAB Pengantar Sains Data untuk dipilih'
  },
  {
    name: '04_StatsPage',
    url: '/stats',
    label: '📊 Statistik',
    description: 'Dashboard statistik progress belajar pengguna'
  }
];

// Mobile viewport (iPhone style)
const MOBILE_VIEWPORT = {
  width: 393,
  height: 852,
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true
};

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function takeScreenshots() {
  console.log('🚀 Starting ArtesionEdu screenshot capture...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const page = await browser.newPage();
  await page.setViewport(MOBILE_VIEWPORT);

  // Set user agent to look like real mobile
  await page.setUserAgent(
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  );

  const screenshots = [];

  for (const config of pages) {
    console.log(`  📸 Capturing: ${config.label}...`);
    
    try {
      // Navigate with domcontentloaded first (faster)
      await page.goto(`${BASE_URL}${config.url}`, {
        waitUntil: 'domcontentloaded',
        timeout: 20000
      });

      // Extra wait for React hydration + animations
      await sleep(1500);

      // Scroll down slightly if needed to show content
      await page.evaluate(() => window.scrollTo(0, 0));

      const filePath = path.join(OUTPUT_DIR, `${config.name}.png`);
      
      await page.screenshot({
        path: filePath,
        type: 'png',
        fullPage: false,
        clip: {
          x: 0,
          y: 0,
          width: MOBILE_VIEWPORT.width,
          height: MOBILE_VIEWPORT.height
        }
      });

      screenshots.push({
        ...config,
        filePath
      });

      console.log(`     ✅ Saved: ${config.name}.png`);
    } catch (err) {
      console.log(`     ⚠️ Error: ${err.message.substring(0, 80)}...`);
      // Try once more with longer wait
      try {
        await sleep(1000);
        await page.goto(`${BASE_URL}${config.url}`, {
          waitUntil: 'load',
          timeout: 25000
        });
        await sleep(2000);
        
        const filePath = path.join(OUTPUT_DIR, `${config.name}.png`);
        await page.screenshot({
          path: filePath,
          type: 'png',
          clip: { x: 0, y: 0, width: MOBILE_VIEWPORT.width, height: MOBILE_VIEWPORT.height }
        });
        screenshots.push({ ...config, filePath });
        console.log(`     ✅ Retry saved: ${config.name}.png`);
      } catch (e) {
        console.log(`     ❌ Failed completely: ${e.message.substring(0, 60)}`);
      }
    }
  }

  await browser.close();

  console.log('\n✅ All screenshots captured!');
  console.log(`   Location: ${OUTPUT_DIR}\n`);

  return screenshots;
}

function generatePresentationHTML(screenshots) {
  const screenshotItems = screenshots.map(s => `
    <div class="screenshot-card">
      <div class="card-header">
        <span class="card-label">${s.label}</span>
        <span class="card-desc">${s.description}</span>
      </div>
      <div class="phone-frame">
        <img src="${s.name}.png" alt="${s.label}" />
      </div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ArtesionEdu — App Showcase</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%);
      min-height: 100vh;
      padding: 40px 20px;
    }

    .container { max-width: 1200px; margin: 0 auto; }

    .header { text-align: center; margin-bottom: 50px; }

    .header-logo {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: linear-gradient(135deg, #6C63FF, #4ECDC4);
      padding: 12px 28px;
      border-radius: 16px;
      margin-bottom: 20px;
    }

    .header-logo-icon {
      width: 40px; height: 40px;
      background: white; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; font-weight: 800; color: #6C63FF;
    }

    .header-logo-text {
      font-size: 24px; font-weight: 800; color: white; letter-spacing: -0.5px;
    }

    .header-title {
      font-size: 42px; font-weight: 900; color: white;
      letter-spacing: -1.5px; line-height: 1.15; margin-bottom: 12px;
    }

    .header-subtitle {
      font-size: 18px; color: rgba(255,255,255,0.6);
      max-width: 550px; margin: 0 auto; line-height: 1.5;
    }

    .header-badges {
      display: flex; gap: 10px; justify-content: center;
      margin-top: 20px; flex-wrap: wrap;
    }

    .badge {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      color: rgba(255,255,255,0.8);
      padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 35px; justify-items: center;
    }

    .screenshot-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px; padding: 20px;
      backdrop-filter: blur(10px);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .screenshot-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 60px rgba(108, 99, 255, 0.2);
      border-color: rgba(108, 99, 255, 0.3);
    }

    .card-header { text-align: center; margin-bottom: 16px; }

    .card-label {
      display: block; font-size: 17px; font-weight: 700;
      color: white; margin-bottom: 4px;
    }

    .card-desc {
      font-size: 12px; color: rgba(255,255,255,0.45); line-height: 1.4;
    }

    .phone-frame {
      background: #1a1a2e; border-radius: 32px; padding: 8px;
      box-shadow:
        0 0 0 2px rgba(255,255,255,0.05),
        0 25px 50px rgba(0,0,0,0.4),
        inset 0 0 0 1px rgba(255,255,255,0.05);
      overflow: hidden;
    }

    .phone-frame img {
      width: 100%; height: auto; border-radius: 24px; display: block;
    }

    .footer {
      text-align: center; margin-top: 60px;
      padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.06);
    }

    .footer-text { font-size: 13px; color: rgba(255,255,255,0.35); }
    .footer-brand { font-size: 14px; color: rgba(255,255,255,0.55); font-weight: 600; margin-top: 4px; }

    @media (max-width: 768px) {
      .header-title { font-size: 28px; }
      .grid { grid-template-columns: 1fr; gap: 25px; }
      body { padding: 20px 12px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-logo">
        <div class="header-logo-icon">A</div>
        <span class="header-logo-text">ArtesionEdu</span>
      </div>
      <h1 class="header-title">Aplikasi Latihan Soal Ujian</h1>
      <p class="header-subtitle">
        Platform latihan soal interaktif untuk Mahasiswa Kecerdasan Buatan IPB University.
        Clone Pahamify-style, tanpa login, data tersimpan di browser.
      </p>
      <div class="header-badges">
        <span class="badge">🎓 IPB University</span>
        <span class="badge">📱 Mobile First</span>
        <span class="badge">⚡ Tanpa Login</span>
        <span class="badge">🔒 Data Aman</span>
        <span class="badge">📊 Statistik Lengkap</span>
      </div>
    </div>

    <div class="grid">
      ${screenshotItems}
    </div>

    <div class="footer">
      <p class="footer-text">Dibuat untuk Mahasiswa Kecerdasan Buatan IPB University</p>
      <p class="footer-brand">© 2025 ArtesionEdu — All rights reserved</p>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  const screenshots = await takeScreenshots();

  if (screenshots.length === 0) {
    console.log('❌ No screenshots captured!');
    process.exit(1);
  }

  const htmlContent = generatePresentationHTML(screenshots);
  const htmlPath = path.join(OUTPUT_DIR, 'showcase.html');
  fs.writeFileSync(htmlPath, htmlContent);
  console.log(`📄 Presentation HTML: showcase.html`);

  const infoPath = path.join(OUTPUT_DIR, 'README.md');
  fs.writeFileSync(infoPath, `# ArtesionEdu — App Screenshots

## 📱 Layout & Menu Showcase

${screenshots.map(s => `### ${s.label}\n![${s.label}](${s.name}.png)\n\n${s.description}\n`).join('\n---\n\n')}

---

*Generated on ${new Date().toLocaleString('id-ID')}*
`);

  console.log(`\n🎉 Done! Open showcase.html in your browser.`);
  console.log(`   Path: ${htmlPath}`);
}

main().catch(console.error);
