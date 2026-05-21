const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, args: ['--use-gl=swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('▲ Opening http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });

  // Wait for boot to auto-complete (~3s)
  await page.waitForTimeout(4000);

  // Screenshot: Hero (scrollTop 0)
  await page.evaluate(() => {
    const sc = document.getElementById('scroll-container');
    if (sc) sc.scrollTop = 0;
    if (sc) sc.dispatchEvent(new Event('scroll', { bubbles: true }));
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'accept-hero.png', fullPage: false });
  console.log('  accept-hero.png ✓');

  // Screenshot: Filmstrip (progress ~0.23)
  await page.evaluate(() => {
    const sc = document.getElementById('scroll-container');
    if (sc) {
      const max = sc.scrollHeight - window.innerHeight;
      sc.scrollTop = 0.23 * max;
      sc.dispatchEvent(new Event('scroll', { bubbles: true }));
    }
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'accept-filmstrip.png', fullPage: false });
  console.log('  accept-filmstrip.png ✓');

  // Screenshot: Office (progress ~0.40)
  await page.evaluate(() => {
    const sc = document.getElementById('scroll-container');
    if (sc) {
      const max = sc.scrollHeight - window.innerHeight;
      sc.scrollTop = 0.40 * max;
      sc.dispatchEvent(new Event('scroll', { bubbles: true }));
    }
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'accept-office.png', fullPage: false });
  console.log('  accept-office.png ✓');

  // Screenshot: Paper (progress ~0.56)
  await page.evaluate(() => {
    const sc = document.getElementById('scroll-container');
    if (sc) {
      const max = sc.scrollHeight - window.innerHeight;
      sc.scrollTop = 0.56 * max;
      sc.dispatchEvent(new Event('scroll', { bubbles: true }));
    }
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'accept-paper.png', fullPage: false });
  console.log('  accept-paper.png ✓');

  // Screenshot: Client Wall (progress ~0.72)
  await page.evaluate(() => {
    const sc = document.getElementById('scroll-container');
    if (sc) {
      const max = sc.scrollHeight - window.innerHeight;
      sc.scrollTop = 0.72 * max;
      sc.dispatchEvent(new Event('scroll', { bubbles: true }));
    }
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'accept-client.png', fullPage: false });
  console.log('  accept-client.png ✓');

  // Screenshot: CTA (progress ~0.85)
  await page.evaluate(() => {
    const sc = document.getElementById('scroll-container');
    if (sc) {
      const max = sc.scrollHeight - window.innerHeight;
      sc.scrollTop = 0.85 * max;
      sc.dispatchEvent(new Event('scroll', { bubbles: true }));
    }
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'accept-cta.png', fullPage: false });
  console.log('  accept-cta.png ✓');

  // Screenshot: Finale (progress ~0.96)
  await page.evaluate(() => {
    const sc = document.getElementById('scroll-container');
    if (sc) {
      const max = sc.scrollHeight - window.innerHeight;
      sc.scrollTop = 0.96 * max;
      sc.dispatchEvent(new Event('scroll', { bubbles: true }));
    }
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'accept-finale.png', fullPage: false });
  console.log('  accept-finale.png ✓');

  await browser.close();
  console.log('\n▲ All acceptance screenshots saved to dynatech/accept-*.png');
  console.log('  Open them in Windows Explorer or any image viewer.');
})();
