import fs from 'fs';
import 'dotenv/config';

const system = JSON.parse(fs.readFileSync(process.env.SYSTEM_PROMPT_PATH, 'utf-8'));

const criteria = JSON.parse(fs.readFileSync(process.env.CRITERIA_PATH, 'utf-8'));

const conversation = JSON.parse(fs.readFileSync(process.env.CONVERSATION_PATH, 'utf-8'));
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
