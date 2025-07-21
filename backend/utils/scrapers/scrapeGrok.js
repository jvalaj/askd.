const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function scrapeGrok(link) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // realistic user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36'
    );

    await page.goto(link, { waitUntil: 'networkidle2' });

    // wait for at least one message bubble to appear
    await page.waitForSelector('.message-bubble');

    const chat = await page.evaluate(() => {
      const result = [];

      // grab all the message bubbles, in order
      const nodes = document.querySelectorAll('.message-bubble');

      nodes.forEach(el => {
        // decide role: user or assistant
        const parent = el.closest('.items-end, .items-start');
        let role = 'assistant';
        if (parent && parent.classList.contains('items-end')) {
          role = 'user';
        }

        const message = el.innerText.trim();
        if (message) {
          result.push({ role, message });
        }
      });

      return result;
    });

    return chat;
  } catch (err) {
    console.error('Error scraping Grok chat:', err.message);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = scrapeGrok;
