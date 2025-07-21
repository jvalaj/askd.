const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs/promises');
const path = require('path');

puppeteer.use(StealthPlugin());

async function inspectPage(link) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: false }); // headless:false for easier debugging
    const page = await browser.newPage();

    // set a realistic user-agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36'
    );

    console.log(`🌐 Navigating to ${link}`);
    await page.goto(link, { waitUntil: 'domcontentloaded' });

    const title = await page.title();
    console.log(`📄 Page title: ${title}`);

    if (/just a moment/i.test(title) || /verify/i.test(title)) {
      console.error('⚠️ Blocked by Cloudflare challenge. Please solve manually in the browser window.');
      await page.waitForTimeout(30000); // give you 30s to solve manually if needed
    }

    // Save PDF snapshot
    const pdfFile = path.resolve(`snapshot-${Date.now()}.pdf`);
    await page.pdf({ path: pdfFile, format: 'A4' });
    console.log(`✅ Saved PDF snapshot: ${pdfFile}`);

    // Save HTML
    const html = await page.content();
    const htmlFile = path.resolve(`page-${Date.now()}.html`);
    await fs.writeFile(htmlFile, html, 'utf8');
    console.log(`✅ Saved HTML: ${htmlFile}`);

    // Extract structure
    const tags = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('*'));
      const tagSet = new Set();
      const classSet = new Set();
      const idSet = new Set();

      all.forEach(el => {
        tagSet.add(el.tagName.toLowerCase());
        if (el.className) classSet.add(el.className);
        if (el.id) idSet.add(el.id);
      });

      return {
        tags: Array.from(tagSet),
        classes: Array.from(classSet),
        ids: Array.from(idSet),
      };
    });

    const tagsFile = path.resolve(`structure-${Date.now()}.json`);
    await fs.writeFile(tagsFile, JSON.stringify(tags, null, 2), 'utf8');
    console.log(`✅ Saved structure info: ${tagsFile}`);

    return { pdfFile, htmlFile, tagsFile };
  } catch (err) {
    console.error('❌ Error inspecting page:', err.message);
  } finally {
    if (browser) await browser.close();
  }
}

// Run from CLI
const link = process.argv[2];
if (!link) {
  console.error('❌ Please provide a URL as argument');
  process.exit(1);
}

inspectPage(link);
