const scrapeChatContent = require('./scrapeChat');

const testLink = 'https://chatgpt.com/share/687c53f9-7378-8004-a6f9-ddfe8a298c6a';

scrapeChatContent(testLink).then((result) => {
  console.log('Scraped chat:', result);
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
