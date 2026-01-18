import fs from 'fs';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '../assets');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const system = JSON.parse(fs.readFileSync(path.join(outputDir, process.env.SYSTEM_PROMPT_PATH), 'utf-8'));

const criteria = JSON.parse(fs.readFileSync(path.join(outputDir, process.env.CRITERIA_PATH), 'utf-8'));

const conversation = JSON.parse(fs.readFileSync(path.join(outputDir, process.env.CONVERSATION_PATH), 'utf-8'));
const messages = [
  {
    role: 'system',
    content: system.system_prompt,
  },
  {
    role: 'user',
    content: `Evaluation Criteria:\n${JSON.stringify(
      criteria.criteria,
      null,
      2,
    )}\n\nConversation:\n${conversation.conversation
      .map((c) => `${c.speaker.toUpperCase()}: ${c.message}`)
      .join('\n')}`,
  },
];

export default messages;
