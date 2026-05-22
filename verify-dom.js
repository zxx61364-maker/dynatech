const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait for boot to complete
  await new Promise(r => setTimeout(r, 8000));

  // Check each section
  const checks = [
    { name: 'hero', progress: 0.01, selectors: ['.hero-overlay', '.hero-masthead'] },
    { name: 'paper', progress: 0.56, selectors: ['.paper-overlay', '.paper-surface', '.paper-columns'] },
    { name: 'cta', progress: 0.85, selectors: ['.cta-overlay', '.cta-card', '.cta-button'] },
    { name: 'finale', progress: 0.96, selectors: ['.finale-overlay', '.finale-title'] },
    { name: 'filmstrip', progress: 0.23, selectors: ['.filmstrip-overlay', '.filmstrip-heading'] },
    { name: 'office', progress: 0.40, selectors: ['.office-overlay', '.office-stats'] },
    { name: 'client', progress: 0.72, selectors: ['.client-overlay', '.client-card', '.logo-grid'] },
  ];

  for (const check of checks) {
    console.log(`\n=== ${check.name.toUpperCase()} (progress: ${check.progress}) ===`);

    // Scroll
    await page.evaluate((p) => {
      const c = document.getElementById('scroll-container');
      if (c) { const m = c.scrollHeight - window.innerHeight; c.scrollTop = p * m; }
    }, check.progress);

    await new Promise(r => setTimeout(r, 2500));

    // Check each selector
    for (const sel of check.selectors) {
      const result = await page.evaluate((s) => {
        const el = document.querySelector(s);
        if (!el) return { found: false };
        const style = window.getComputedStyle(el);
        return {
          found: true,
          opacity: style.opacity,
          display: style.display,
          visibility: style.visibility,
          textContent: el.textContent?.substring(0, 60),
        };
      }, sel);
      console.log(`  ${sel}:`, JSON.stringify(result));
    }
  }

  await browser.close();
  console.log('\n=== VERIFICATION COMPLETE ===');
})();
