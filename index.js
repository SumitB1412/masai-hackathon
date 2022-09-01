const { App } = require("@slack/bolt");
const { commands } = require("./db");
require("dotenv").config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
});


app.command("/knowledge", async ({ command, ack, say }) => {
  try {
    await ack();
    say("Yaaay! that command works!");
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

app.message("hey", async ({ command, say }) => {
  try {
    let random = Math.floor(Math.random() * (5 - 0) + 0);
    say(commands[random]);
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

app.message(":wave:", async ({ message, say }) => {
  await say(`Hello, <@${message.user}>`);
});

(async () => {
  const port = 3000;
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();
