import fs from 'fs';
import 'dotenv/config';
import { HumanMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';

async function encodeImageToBase64(imagePath) {
  const buffer = await fs.promises.readFile(imagePath);
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

const llm = new ChatOpenAI({
  model: process.env.MODEL_NAME || 'qwen/qwen3-vl-235b-a22b-instruct',
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: 'https://openrouter.ai/api/v1',
  },
});

async function runImage() {
  const imagePath = process.env.IMAGE_PATH;

  const imageBase64 = await encodeImageToBase64(imagePath);

  const message = new HumanMessage({
    content: [
      { type: 'text', text: "What's in this image?" },
      {
        type: 'image_url',
        image_url: { url: imageBase64 },
      },
    ],
  });

  const result = await llm.invoke([message]);

  console.log('\nModel answer:');
  console.log(result.content);
}

runImage();
