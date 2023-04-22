require('dotenv').config();
const cohere = require('cohere-ai');
cohere.init(process.env.COHERE_API_KEY);

const examples = [
  {text:"Meeting in 5 min.", label:"no"},
  {text:"What the fuck?", label:"no"},
  {text:"Don't do that.", label:"no"},
  {text:"Did you submit the code?", label:"yes"},
  {text:"Can you link the Notion doc?", label:"yes"},
  {text:"Please go to the station.", label:"no"},
  {text:"Why the hell?", label:"no"},
  {text:"I don't think that works.", label:"no"},
  {text:"How are you?", label:"yes"},
  {text:"WTF", label:"no"},
  {text:"Can anyone help me?", label:"yes"},
  {text:"What time can I finish work?", label:"yes"},
  {text:"This is dumb", label:"no"},
  {text:":eyes:?", label:"no"},
  {text:"Can someone review this task and provide feedback?", label:"yes"},
];

export async function classifiesAsQuestion(text: string): Promise<boolean> {
  const response = await cohere.classify({
    inputs: [text],
    examples: examples,
  });
  
  console.log(response);

  // Return true if classifies as "yes", false if "no"
  return (response.labels["yes"].confidence >= response.labels["no"].confidence)
};

(await classifiesAsQuestion("Hello world"))();