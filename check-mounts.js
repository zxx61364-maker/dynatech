const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 8000));

  // At hero position, check which overlays exist
  const heroResult = await page.evaluate(() => {
    const overlays = [
      '.hero-overlay', '.filmstrip-overlay', '.office-overlay',
      '.paper-overlay', '.client-overlay', '.cta-overlay', '.finale-overlay'
    ];
    return overlays.map(s => ({ selector: s, exists: !!document.querySelector(s) }));
  });
  console.log('=== AT HERO (progress 0.01) ===');
  heroResult.forEach(r => console.log(`  ${r.selector}: ${r.exists ? 'MOUNTED' : 'NOT MOUNTED'}`));

  // Scroll to paper
  await page.evaluate(() => {
    const c = document.getElementById('scroll-container');
    if (c) { const m = c.scrollHeight - window.innerHeight; c.scrollTop = 0.56 * m; }
  });
  await new Promise(r => setTimeout(r, 2500));

  const paperResult = await page.evaluate(() => {
    const overlays = [
      '.hero-overlay', '.filmstrip-overlay', '.office-overlay',
      '.paper-overlay', '.client-overlay', '.cta-overlay', '.finale-overlay'
    ];
    return overlays.map(s => ({ selector: s, exists: !!document.querySelector(s) }));
  });
  console.log('=== AT PAPER (progress 0.56) ===');
  paperResult.forEach(r => console.log(`  ${r.selector}: ${r.exists ? 'MOUNTED' : 'NOT MOUNTED'}`));

  // Scroll to cta
  await page.evaluate(() => {
    const c = document.getElementById('scroll-container');
    if (c) { const m = c.scrollHeight - window.innerHeight; c.scrollTop = 0.85 * m; }
  });
  await new Promise(r => setTimeout(r, 2500));

  const ctaResult = await page.evaluate(() => {
    const overlays = [
      '.hero-overlay', '.filmstrip-overlay', '.office-overlay',
      '.paper-overlay', '.client-overlay', '.cta-overlay', '.finale-overlay'
    ];
    return overlays.map(s => ({ selector: s, exists: !!document.querySelector(s) }));
  });
  console.log('=== AT CTA (progress 0.85) ===');
  ctaResult.forEach(r => console.log(`  ${r.selector}: ${r.exists ? 'MOUNTED' : 'NOT MOUNTED'}`));

  await browser.close();
  console.log('\n=== MOUNT CHECK COMPLETE ===');
})();
