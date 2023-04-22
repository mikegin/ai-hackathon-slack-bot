import { ChatGPTMessage, ChatGPT_completion } from './chat_gpt';
import { ResponseResult } from "./types"
const cohere = require('cohere-ai');
cohere.init(process.env.COHERE_API_KEY);
const context: ChatGPTMessage[] = [];

const questionAnswerPair: ChatGPTMessage[] = [];

// export async function classifyAsQuestion(prompt: string): Promise<boolean> {
  
// }

export async function executeAIChat(prompt: string): Promise<ResponseResult> {
  context.push({ role: "user", content: prompt }) // todo later pull this from a database?
  
  const model = 'gpt-3.5-turbo';

  const messages: ChatGPTMessage[] = [
    {
      role: 'system',
      content: `You are a question classifying bot. I will give you a sentence and you will answer with yes if it is a question, and no if it is not a question. Only answer with yes or no. Your response should never be more than one word. Answer no for rhetorical questions. A few examples:
Meeting in 5 min. No
What the fuck? No (rhetorical question)
Don't do that. No
Did you submit the code? Yes
Can you link the Notion doc? Yes
Please go to the station. No
Why the hell? No (rhetorical question)
I don't think that works. No
How are you? Yes
WTF No
Can anyone help me? Yes
What time can I finish work? Yes
This is dumb No
:eyes:? No
Can someone review this task and provide feedback?” Yes`,
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  // const promptEmbedding = await openai.createEmbedding({
  //   model: "text-embedding-ada-002",
  //   input: prompt,
  // });
  // questionAnswerPair.push(promptEmbedding);
  // console.log(promptEmbedding);

  const classificationResponse = await ChatGPT_completion(messages, model, 0.7, 0.9);

  const found = classificationResponse.toLowerCase().match(/yes/g)

  const response: ResponseResult = {
    isQuestion: true,
    result: null
  }
  
  if (Array.isArray(found) && found.length > 0) {
    const answer = await answerBot(context, prompt);
    
    response.result = answer
  }
  else{
    response.isQuestion = false
  }

  // console.log("response", response);
  return response
}

export async function answerBot(context: ChatGPTMessage[], prompt: string): Promise<string> {

  const model = 'gpt-3.5-turbo';

  const messages: ChatGPTMessage[] = [
      {
        role: 'system',
        content: `You are the brain of an organization. You are helpful in answering questions. Answer the questions to the best of your ability. If you do not know the answer to a question, reply truthfully that you do not know the answer.`,
      },
      ...context,
      {
        role: 'user',
        content: prompt,
      },
    ];

    console.log("messages>>>", messages)

    const response = await ChatGPT_completion(messages, model, 0.7, 0.9);
    console.log("response", response);
    return response
}
