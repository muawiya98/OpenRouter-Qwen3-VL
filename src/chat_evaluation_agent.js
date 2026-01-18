import fetch from 'node-fetch';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import messages from './buildMessages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      messages,
      temperature: 0,
      response_format: { type: 'json_object' },
    }),
  });

  const data = await response.json();
  let raw = data?.choices?.[0]?.message?.content;

  if (!raw) {
    console.error('No content received.');
    return;
  }
  raw = raw
    .replace(/^```json\s*/, '')
    .replace(/^```\s*/, '')
    .replace(/\s*```$/, '');

  let evaluation;
  try {
    evaluation = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse JSON. Model output might be malformed.');
    console.error('Raw string:', raw);
    return;
  }
  const outputDir = path.join(__dirname, '../assets');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, process.env.EVALUATION_OUTPUT_PATH || 'evaluation.json');
  fs.writeFileSync(outputPath, JSON.stringify(evaluation, null, 2), 'utf-8');
}

runChat().catch(console.error);
