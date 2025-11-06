// MY FIRST INTEGRATION WITH OPENAI API

import 'dotenv/config';
import OpenAI from 'openai';    

const openaiApiKey = process.env.OPENAI_API_KEY;
const client = new OpenAI();

const response = await client.responses.create({
    model: "gpt-5-nano",
    input: "Write a one-sentence bedtime story about a unicorn."
});

console.log(response.output_text);