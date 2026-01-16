import fs from 'fs';
import 'dotenv/config';

const API_KEY = process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
  throw new Error('OPENROUTER_API_KEY is missing in .env');
}

async function encodeImageToBase64(imagePath) {
  const imageBuffer = await fs.promises.readFile(imagePath);
  const base64Image = imageBuffer.toString('base64');
  return `data:image/jpeg;base64,${base64Image}`;
}

async function main() {
  const imagePath = process.env.IMAGE_PATH;
  const base64Image = await encodeImageToBase64(imagePath);
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost',
      'X-Title': 'Qwen3-VL Node Demo',
    },
    body: JSON.stringify({
      model: process.env.MODEL_NAME || 'qwen/qwen3-vl-235b-a22b-instruct',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: "What's in this image?",
            },
            {
              type: 'image_url',
              image_url: {
                url: base64Image,
              },
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();
  const answer = data?.choices?.[0]?.message?.content;

  console.log('\nModel answer:');
  console.log(answer);
}
main().catch(console.error);
