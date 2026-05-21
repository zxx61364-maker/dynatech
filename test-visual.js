const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: false, args: ['--use-gl=swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[${msg.type().toUpperCase()}] ${msg.text().slice(0, 200)}`);
    }
  });
  page.on('pageerror', err => console.log('[PAGE_ERR]', err.message.slice(0, 200)));

  console.log('[1] Loading localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(4000); // Boot + first render

  // Check DOM visibility
  const domReport = await page.evaluate(() => {
    const sc = document.getElementById('scroll-container');
    const canvas = document.querySelector('canvas');
    const bootScreen = document.querySelector('.boot-screen');
    const a11yEls = document.querySelectorAll('.a11y-only');

    const result = {
      scrollContainerExists: !!sc,
      scrollContainerClasses: sc ? sc.className : 'NONE',
      scrollContainerScrollHeight: sc ? sc.scrollHeight : 0,
      canvasExists: !!canvas,
      canvasSize: canvas ? `${canvas.width}x${canvas.height}` : 'NONE',
      bootScreenExists: !!bootScreen,
      bootScreenVisible: bootScreen ? getComputedStyle(bootScreen).display !== 'none' : false,
      a11yCount: a11yEls.length,
      bodyChildren: document.body.children.length,
      bodyHTML: document.body.innerHTML.slice(0, 500),
    };

    // Check what's actually visible (not display:none, not clip:rect(0))
    const allDivs = document.querySelectorAll('div');
    const visibleDivs = [];
    allDivs.forEach(div => {
      const cs = getComputedStyle(div);
      if (cs.display !== 'none' && cs.visibility !== 'hidden' && cs.clip !== 'rect(0px, 0px, 0px, 0px)') {
        visibleDivs.push({
          id: div.id || undefined,
          classes: div.className?.toString()?.slice(0, 60),
          position: cs.position,
          zIndex: cs.zIndex,
          width: cs.width,
          height: cs.height,
          text: div.textContent?.trim()?.slice(0, 80),
        });
      }
    });
    result.visibleDivs = visibleDivs.slice(0, 15);
    return result;
  });

  console.log(JSON.stringify(domReport, null, 2));

  // Screenshot at boot
  await page.screenshot({ path: 'test-boot.png' });
  console.log('  → test-boot.png saved');

  // Wait for boot to complete
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'test-hero.png' });
  console.log('  → test-hero.png saved');

  // Try scrolling to different positions
  const positions = [0.15, 0.32, 0.48, 0.65, 0.78, 0.92];
  for (const target of positions) {
    await page.evaluate((t) => {
      const sc = document.getElementById('scroll-container');
      if (sc) {
        const maxScroll = sc.scrollHeight - window.innerHeight;
        sc.scrollTop = t * maxScroll;
        sc.dispatchEvent(new Event('scroll', { bubbles: true }));
      }
    }, target);
    await page.waitForTimeout(1000);
    const label = ['filmstrip','office','paper','client','cta','finale'][positions.indexOf(target)];
    await page.screenshot({ path: `test-${label}.png` });
    console.log(`  → test-${label}.png (progress=${target}) saved`);
  }

  await browser.close();
  console.log('\n[Done] All screenshots saved to dynatech/test-*.png');
})();
