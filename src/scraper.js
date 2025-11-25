import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import OpenAI from 'openai';
import * as cheerio from 'cheerio';
import axios from 'axios';


// Get the directory path of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Load .env from the root directory
dotenv.config({ path: join(rootDir, '.env') });

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
}
const client = new OpenAI({ apiKey: openaiApiKey });

// Define our system prompt
const system_prompt = `You are a snarky assistant that analyzes the contents of a website,
and provides a short, snarky, humorous summary, ignoring text that might be navigation related.
Respond in markdown. Do not wrap the markdown in a code block - respond just with the markdown.`

// Define our user prompt
const user_prompt_prefix = `Here are the contents of a website.
Provide a short summary of this website.
If it includes news or announcements, then summarize these too.`

async function summarize(url) {
    try {
        // load website text, then await the chat completion result
        const website = await getPlainText(url);
        const response = await client.chat.completions.create({
            model: "gpt-5-nano",
            messages: messages_for(website)
        });
        console.log(response.choices[0].message.content);
    } catch (error) {
        console.error('Error:', error);
    }
}

summarize('https://edwarddonner.com');

async function getPlainText(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  
  // Remove all script and style elements
  $('script, style').remove();
  
  // Get text and clean it
  return $('body').text()
    .replace(/\s+/g, ' ')
    .trim();
}

function messages_for(website){
    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt_prefix + website}
    ]
}