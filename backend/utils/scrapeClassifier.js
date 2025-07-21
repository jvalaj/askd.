const scrapeChatGPT = require('./scrapers/scrapeChatGPT');
const scrapeGrok = require('./scrapers/scrapeGrok');

// Simple keyword-based category classifier
function classifyCategory(content) {
  const allText = content.map(msg => msg.message.toLowerCase()).join(' ');
  
  // Education keywords
  if (allText.match(/\b(learn|study|education|school|university|course|tutorial|explain|homework|assignment|research|academic)\b/)) {
    return 'education';
  }
  
  // Tech keywords
  if (allText.match(/\b(code|programming|software|development|javascript|python|react|api|database|algorithm|debug|frontend|backend)\b/)) {
    return 'tech';
  }
  
  // Money/Business keywords
  if (allText.match(/\b(money|business|finance|investment|profit|revenue|marketing|sales|startup|entrepreneur|budget|income)\b/)) {
    return 'money';
  }
  
  // Creative keywords
  if (allText.match(/\b(creative|design|art|writing|story|poem|music|video|image|draw|paint|creative)\b/)) {
    return 'creative';
  }
  
  // Business keywords
  if (allText.match(/\b(strategy|management|planning|team|project|client|meeting|proposal|contract|organization)\b/)) {
    return 'business';
  }
  
  return 'other';
}

function classify(link) {
  const url = new URL(link);
  const host = url.hostname;

  if (host.includes('chat.openai.com') || host.includes('chatgpt.com')) return 'chatgpt';
//   if (host.includes('claude.ai')) return 'claude';
  if (host.includes('x.ai') || host.includes('grok.com') || host.includes('x.com')) return 'grok';
//   if (host.includes('gemini.google.com') || host.includes('bard.google.com')) return 'gemini';

  throw new Error('Unsupported service: ' + host);
}
async function scrapeChatContent(link) {
  const service = classify(link);

  let content;
  switch (service) {
    case 'chatgpt':
      content = await scrapeChatGPT(link);
      break;
    // case 'claude':
    //   content = await scrapeClaude(link);
    //   break;
    case 'grok':
      content = await scrapeGrok(link);
      break;
    // case 'gemini':
    //   content = await scrapeGemini(link);
    //   break;
    default:
      throw new Error(`Unsupported service: ${service}`);
  }

  const category = classifyCategory(content);
  return { content, service, category };
}

module.exports = scrapeChatContent;
