import fs from 'fs';
import 'dotenv/config';

const API_KEY = process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
  throw new Error('OPENROUTER_API_KEY missing in .env');
}

async function encodePdfToBase64(pdfPath) {
  const pdfBuffer = await fs.promises.readFile(pdfPath);
  return pdfBuffer.toString('base64');
}

async function main() {
  const pdfPath = process.env.FILE_PATH;
  const base64Pdf = await encodePdfToBase64(pdfPath);

  const pdfDataUrl = `data:application/pdf;base64,${base64Pdf}`;

  const payload = {
    model: process.env.MODEL_NAME || 'qwen/qwen3-vl-235b-a22b-instruct',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'What are the main points in this document?',
          },
          {
            type: 'file',
            file: {
              filename: 'document.pdf',
              file_data: pdfDataUrl,
            },
          },
        ],
      },
    ],

    plugins: [
      {
        id: 'file-parser',
        pdf: {
          engine: 'pdf-text',
        },
      },
    ],
  };

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',

      'HTTP-Referer': 'http://localhost',
      'X-Title': 'Qwen3-VL PDF Demo',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  const answer = data?.choices?.[0]?.message?.content;

  console.log('\nModel answer:');
  console.log(answer);
}

main().catch(console.error);
