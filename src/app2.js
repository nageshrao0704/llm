import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import OpenAI from 'openai';

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
async function main() {
    try {
        const response = await client.chat.completions.create({
            model: "gpt-5-nano",
            messages: [
                { role: 'developer', content: 'Talk like a pirate.' },
                { role: 'user', content: 'Are semicolons optional in JavaScript?' },
            ],
        });

        console.log(response.choices[0].message.content);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();