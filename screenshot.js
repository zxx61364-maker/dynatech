const puppeteer = require('puppeteer');
const path = require('path');

const SECTIONS = [
  { name: 'boot', progress: 0 },
  { name: 'hero', progress: 0.0 },
  { name: 'filmstrip', progress: 0.23 },
  { name: 'office', progress: 0.40 },
  { name: 'paper', progress: 0.56 },
  { name: 'client', progress: 0.72 },
  { name: 'cta', progress: 0.85 },
  { name: 'finale', progress: 0.96 },
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=swiftshader'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  try {
    console.log('Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for boot screen to appear
    await sleep(2000);

    // Screenshot boot
    console.log('Taking boot screenshot...');
    await page.screenshot({ path: path.join(__dirname, 'screenshot-boot.png'), fullPage: false });
    console.log('boot done');

    // Wait for boot to complete (approximately 3-4 seconds total)
    await sleep(5000);

    // Now the app should be on hero. Take screenshots by scrolling.
    for (const section of SECTIONS.slice(1)) {
      console.log(`Scrolling to ${section.name} at progress ${section.progress}...`);

      // Scroll to the target progress using the scroll container
      await page.evaluate((progress) => {
        const container = document.getElementById('scroll-container');
        if (container) {
          const maxScroll = container.scrollHeight - window.innerHeight;
          container.scrollTop = progress * maxScroll;
        }
      }, section.progress);

      // Wait for Lenis smooth scroll to settle and scene to render
      await sleep(2000);

      console.log(`Taking ${section.name} screenshot...`);
      await page.screenshot({
        path: path.join(__dirname, `screenshot-${section.name}.png`),
        fullPage: false,
      });
      console.log(`${section.name} done`);
    }

    console.log('All screenshots captured!');
  } catch (err) {
    console.error('Error:', err.message);
    // Still take what we have
    try {
      await page.screenshot({ path: path.join(__dirname, 'screenshot-error.png') });
    } catch (_) {}
  } finally {
    await browser.close();
  }
})();
