import soft from '@/assets/insults/soft.json';
import tryMe from '@/assets/insults/tryMe.json';
import nuclear from '@/assets/insults/nuclear.json';

export function getToneMessage(tone: string, goalTitle: string): string {
  let pool: string[] = [];

  switch (tone) {
    case 'soft':
      pool = soft;
      break;
    case 'tryMe':
      pool = tryMe;
      break;
    case 'nuclear':
      pool = nuclear;
      break;
    default:
      pool = soft;
  }

  const message = pool[Math.floor(Math.random() * pool.length)];
  return message.replace(/‘\{goal\}’|'{goal}'/g, goalTitle);
}
