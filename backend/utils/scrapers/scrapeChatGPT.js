const puppeteer = require('puppeteer');

async function scrapeChatGPT(link) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(link, { waitUntil: 'networkidle2' });

    // Wait for any message to appear
    await page.waitForSelector('[data-message-author-role]');

    const chat = await page.evaluate(() => {
      const result = [];
      const nodes = document.querySelectorAll('[data-message-author-role]');

      nodes.forEach(el => {
        const role = el.getAttribute('data-message-author-role');
        const messageEl = el.querySelector('.whitespace-pre-wrap, .markdown');
        const message = messageEl?.innerText.trim();
        if (message) {
          result.push({ role, message });
        }
      });

      return result;
    });

    return chat;
  } catch (err) {
    console.error('Error scraping ChatGPT chat:', err.message);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = scrapeChatGPT;
