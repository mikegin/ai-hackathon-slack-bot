require('dotenv').config();

//   CODE MOVED TO chatgpt.service.ts
const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_API_BOT_TOKEN,
  signingSecret: process.env.SLACK_API_SIGNING_SECRET,
  appToken: process.env.SLACK_API_APP_TOKEN,
  socketMode: true
});

app.message('Hello Ditto!', async ({ message, say }) => {
  console.log("Message received");
  await say(`Hello, <@${message.user}>!`);
});

(async () => {
  await app.start(3001);
  console.log('Bot started');
})();