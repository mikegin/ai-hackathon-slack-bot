// require('dotenv').config();
// const { createEventAdapter } = require('@slack/events-api');
// const { WebClient } = require('@slack/web-api');

// const slackEvents = createEventAdapter(process.env.SLACK_API_SIGNING_SECRET);
// const token = process.env.SLACK_BOT_TOKEN;
// const web = new WebClient(token);

// console.log("hello");
// console.log(process.env.SLACK_API_SIGNING_SECRET);

// slackEvents.on('message', async (event) => {
//   try {
//     const message = `You said: ${event.text}`;
//     await web.chat.postMessage({
//       channel: event.channel,
//       text: message
//     });
//   } catch (error) {
//     console.error(error);
//   }
// });

// slackEvents.start(process.env.PORT).then(() => {
//   console.log('Bot started');
// });


const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

(async () => {
  await app.start();
  console.log('⚡️ Bolt app started');
})();