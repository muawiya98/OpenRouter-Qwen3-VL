import fetch from 'node-fetch';
import 'dotenv/config';

const API_KEY = process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
  throw new Error('OPENROUTER_API_KEY is missing in .env');
}

async function runChat() {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'HTTP-Referer': 'http://localhost',
      'X-Title': 'OpenRouter Node Demo',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.MODEL_NAME || 'qwen/qwen3-vl-235b-a22b-instruct',
      messages: [
        {
          role: 'user',
          content: 'What is the meaning of life?',
        },
      ],
    }),
  });

  const data = await response.json();
  console.log('Model answer:');
  console.log(data?.choices?.[0]?.message?.content);
}

runChat().catch(console.error);
