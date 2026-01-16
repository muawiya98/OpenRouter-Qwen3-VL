import 'dotenv/config';
import fs from 'fs';
import { createRequire } from 'module';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';

const require = createRequire(import.meta.url);

const pdfParseModule = require('pdf-parse');
const pdfParse = pdfParseModule.default ?? pdfParseModule;

async function extractPdfText(pdfPath) {
  const buffer = await fs.promises.readFile(pdfPath);

  const data = await pdfParse(buffer);
  return data.text;
}

const llm = new ChatOpenAI({
  model: process.env.MODEL_NAME || 'qwen/qwen3-vl-235b-a22b-instruct',
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: 'https://openrouter.ai/api/v1',
  },
});

async function runPdf() {
  const pdfPath = process.env.FILE_PATH;

  if (!pdfPath) {
    throw new Error('FILE_PATH is missing in .env');
  }

  const pdfText = await extractPdfText(pdfPath);

  const message = new HumanMessage({
    content: `Summarize the main points of this document:\n\n${pdfText}`,
  });

  const result = await llm.invoke([message]);

  console.log('\nModel answer:');
  console.log(result.content);
}

runPdf().catch(console.error);
