const { chromium } = require('playwright');
const fs = require('fs');
const zlib = require('zlib');

function analyze(filename) {
  const buf = fs.readFileSync(filename);
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  let off = 33;
  const idats = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.slice(off+4, off+8).toString('ascii');
    if (type === 'IDAT') idats.push(buf.slice(off+8, off+8+len));
    off += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idats));
  const rowSize = 1 + w * 4;

  // Sample 5 regions: center, top-left, top-right, bottom-left, bottom-right
  const regions = [
    {name:'center', x:w/2, y:h/2},
    {name:'topL', x:w*0.2, y:h*0.15},
    {name:'topR', x:w*0.8, y:h*0.15},
    {name:'botL', x:w*0.2, y:h*0.85},
    {name:'botR', x:w*0.8, y:h*0.85},
  ];

  const results = {};
  regions.forEach(r => {
    let tr=0, tg=0, tb=0, cnt=0;
    const s = 30;
    for (let y = Math.max(0,r.y-s); y < Math.min(h, r.y+s); y++) {
      for (let x = Math.max(0,r.x-s); x < Math.min(w, r.x+s); x++) {
        const px = y*rowSize + 1 + x*4;
        tr += raw[px]; tg += raw[px+1]; tb += raw[px+2]; cnt++;
      }
    }
    const avgR = Math.round(tr/cnt), avgG = Math.round(tg/cnt), avgB = Math.round(tb/cnt);
    const brightness = Math.round((avgR+avgG+avgB)/3);
    results[r.name] = `rgb(${avgR},${avgG},${avgB}) b=${brightness}`;
  });

  // Overall black pixel percentage
  let black = 0, total = 0;
  for (let y=0; y<h; y+=4) {
    for (let x=0; x<w; x+=4) {
      const px = y*rowSize + 1 + x*4;
      if (raw[px] < 15 && raw[px+1] < 15 && raw[px+2] < 15) black++;
      total++;
    }
  }
  results.blackPercent = Math.round(black/total*100) + '%';

  return results;
}

(async () => {
  const browser = await chromium.launch({ headless: false, args: ['--use-gl=swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('pageerror', err => console.log('[ERR]', err.message.slice(0,150)));

  console.log('Loading...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });

  // Wait for boot + hero render
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'test-v2-hero.png' });

  // Check DOM visibility
  const domReport = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="dom"]');
    const visible = [];
    els.forEach(el => {
      const cs = getComputedStyle(el);
      if (cs.opacity !== '0' && cs.display !== 'none') {
        visible.push({
          class: el.className?.toString()?.slice(0,40),
          opacity: cs.opacity,
          text: el.textContent?.trim()?.slice(0,60),
        });
      }
    });
    return visible;
  });
  console.log('Visible DOM overlays at hero:', JSON.stringify(domReport, null, 2));

  // Scroll to each section
  const targets = [
    { label: 'filmstrip', progress: 0.23 },
    { label: 'office', progress: 0.40 },
    { label: 'paper', progress: 0.56 },
    { label: 'client', progress: 0.72 },
    { label: 'cta', progress: 0.85 },
    { label: 'finale', progress: 0.96 },
  ];

  for (const t of targets) {
    await page.evaluate((progress) => {
      const sc = document.getElementById('scroll-container');
      if (sc) {
        const maxScroll = sc.scrollHeight - window.innerHeight;
        sc.scrollTop = progress * maxScroll;
        sc.dispatchEvent(new Event('scroll', { bubbles: true }));
      }
    }, t.progress);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `test-v2-${t.label}.png` });

    // Check visible DOM
    const vis = await page.evaluate(() => {
      const els = document.querySelectorAll('[class*="dom"]');
      const visible = [];
      els.forEach(el => {
        const cs = getComputedStyle(el);
        if (cs.opacity !== '0' && cs.display !== 'none') {
          visible.push({
            class: el.className?.toString()?.slice(0,40),
            opacity: cs.opacity,
            text: el.textContent?.trim()?.slice(0,60),
          });
        }
      });
      return visible;
    });
    console.log(`[${t.label}] Visible DOM:`, JSON.stringify(vis, null, 2));
  }

  // Analyze all screenshots
  console.log('\n=== PIXEL ANALYSIS ===');
  const files = ['hero','filmstrip','office','paper','client','cta','finale'];
  files.forEach(f => {
    const r = analyze(`test-v2-${f}.png`);
    console.log(`[${f}] center=${r.center} topL=${r.topL} black=${r.blackPercent}`);
  });

  await browser.close();
  console.log('\nDone.');
})();
