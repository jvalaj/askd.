// discoverNoKey.js
// Requires: npm install axios puppeteer
// Uses: Reddit + Hacker News public APIs (no key)

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const scrapeChatGPT = require('../scrapers/scrapeChatGPT');

function normalize(url) {
  if (!url) return null;
  if (!url.startsWith('https://chatgpt.com/share/')) return null;
  return url.split('?')[0]; // strip params
}

// Fetch Reddit posts across several time windows
async function fetchReddit() {
  const windows = ['year', 'month', 'week', 'all']; // adjust as you like
  const out = [];
  for (const t of windows) {
    const url = `https://www.reddit.com/search.json?q=site:chatgpt.com/share&sort=top&t=${t}&limit=100`;
    try {
      const { data } = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; scraper/1.0)' }
      });
      const children = data?.data?.children || [];
      for (const c of children) {
        const d = c.data;
        const link = normalize(d.url);
        if (link) {
          out.push({
            link,
            score: d.score || 0,
            source: 'reddit',
            title: d.title
          });
        }
      }
    } catch (err) {
      console.error('Reddit fetch error:', err.message);
    }
  }
  return out;
}

// Fetch Hacker News stories via Algolia
async function fetchHN() {
  const url = 'https://hn.algolia.com/api/v1/search?query=chatgpt.com/share&tags=story&hitsPerPage=100';
  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; scraper/1.0)' }
    });
    const hits = data?.hits || [];
    return hits
      .map(h => ({
        link: normalize(h.url),
        score: h.points || 0,
        source: 'hn',
        title: h.title
      }))
      .filter(item => item.link);
  } catch (err) {
    console.error('HN fetch error:', err.message);
    return [];
  }
}

// Merge + rank
function computeTop(items, limit = 10) {
  const acc = new Map();
  for (const item of items) {
    if (!acc.has(item.link)) {
      acc.set(item.link, { link: item.link, score: 0, details: [] });
    }
    const entry = acc.get(item.link);
    entry.score += item.score;
    entry.details.push(item);
  }
  return Array.from(acc.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

async function main() {
  console.log('Gathering Reddit posts...');
  const redditItems = await fetchReddit();
  console.log(`Reddit items: ${redditItems.length}`);

  console.log('Gathering Hacker News posts...');
  const hnItems = await fetchHN();
  console.log(`HN items: ${hnItems.length}`);

  const combined = [...redditItems, ...hnItems];
  if (!combined.length) {
    console.error('No links found.');
    return;
  }

  const top = computeTop(combined, 10);
  console.log('Top candidate links (by combined score):');
  top.forEach(t => console.log(t.score, t.link));

  const results = [];
  for (const { link } of top) {
    console.log('Scraping', link);
    try {
      const chat = await scrapeChatGPT(link);
      results.push({ link, chat });
    } catch (err) {
      results.push({ link, error: err.message });
    }
  }

  // Save / output
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `chatgpt-scrape-results-${timestamp}.json`;
  const outputPath = path.join(__dirname, '..', '..', filename);
  
  try {
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`Results saved to: ${outputPath}`);
    console.log(`Total links processed: ${results.length}`);
    console.log(`Successful scrapes: ${results.filter(r => r.chat).length}`);
    console.log(`Failed scrapes: ${results.filter(r => r.error).length}`);
  } catch (err) {
    console.error('Error writing to file:', err.message);
    console.log('Results (fallback to console):');
    console.log(JSON.stringify(results, null, 2));
  }
}

if (require.main === module) {
  main().catch(e => {
    console.error('Fatal:', e);
    process.exit(1);
  });
}

module.exports = { fetchReddit, fetchHN, computeTop };
