import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';

const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.MODEL_NAME || 'qwen/qwen3-vl-235b-a22b-instruct';

if (!API_KEY) {
  throw new Error('OPENROUTER_API_KEY is missing in .env');
}

const llm = new ChatOpenAI({
  model: MODEL,
  apiKey: API_KEY,
  configuration: {
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'http://localhost',
      'X-Title': 'LangChain OpenRouter Demo',
    },
  },
});

async function runChat() {
  const message = new HumanMessage({
    content: 'What is the meaning of life?',
  });

  const response = await llm.invoke([message]);

  console.log('\nModel answer:');
  console.log(response.content);
}

runChat().catch(console.error);
