import { ChatGPTMessage, ChatGPT_completion } from './chat_gpt';

export async function executeAIChat(prompt: string): Promise<string> {

  const model = 'gpt-3.5-turbo';

  if (model == "gpt-3.5-turbo" || model == "gpt-3.5-turbo-0301" || model == "gpt-4-0314" || model == "gpt-4-32k") {

    const messages: ChatGPTMessage[] = [
      {
        role: 'system',
        content: `You are a helpful assistant!`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    const response = await ChatGPT_completion(messages, model, 0.7, 0.9);
    console.log("response", response);
    return response
  }

  return ""
}

  // executeAIChat("Hi");