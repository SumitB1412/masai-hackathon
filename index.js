const { App } = require("@slack/bolt");
const { commands } = require("./db");
const fs = require("fs");
require("dotenv").config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
});

/*                        Random bot replies or greetings                        */

app.message("hey", async ({ command, say }) => {
  try {
    let random = Math.floor(Math.random() * (5 - 0) + 0);
    say(commands[random]);
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

/*                        Getting all the meeting links for the day                        */

app.message("meetings", async ({ message, say }) => {
  console.log(message);
  let msg = [];
  try {
    const result = await app.client.search.messages({
      token: process.env.REQUEST_TOKEN,
      query: "https://us06web.zoom",
    });
    console.log(result.messages.matches);
    let i = 0;
    result.messages.matches.forEach((el) => {
      msg[i] = {
        type: "section",
        text: { type: "mrkdwn", text: "null" },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "null",
          },
          action_id: "button-action",
        },
      };
      msg[i].text.text = el.text;
      msg[i].accessory.text.text = `From <@${el.username}>`;
      i++;
    });
    msg.splice(msg.length-1);
    await say({
      blocks: msg,
    });
  } catch (err) {
    console.log(err);
  }
});

app.action("button_click", async ({ body, ack, say }) => {
  await ack();
  await say(`<@${body.user.id}> clicked the button`);
});

/*                        Storing the "{@channel}" important messages to local database                        */

app.event("app_mention", async ({ event, client, logger }) => {
  let messages = [];
  try {
    const result = await client.search.messages({
      token: process.env.REQUEST_TOKEN,
      query: "@channel",
    });
    let i = 0;
    result.messages.matches.forEach((el) => {
      let channel = el.channel.name;
      messages[i] = { type: null, text: null };
      messages[i].type = "section";
      messages[i].text = { type: null, text: " " };
      messages[i].text.type = "mrkdwn";
      let havingText = el.blocks[0].elements[0].elements;
      for (let a = 0; a < havingText.length; a++) {
        if (havingText[a].text != null) {
          messages[
            i
          ].text.text = `From ${channel} channel -> ${havingText[a].text}`;
        }
      }
      i++;
    });
    fs.writeFile("./db.json", JSON.stringify(messages), "utf-8", () => {
      console.log("Data added");
    });
    logger.info(messages);
  } catch (error) {
    logger.error(error);
  }
});

/*       Retrieving the local database of important messages and displaying in new channel          */

app.message("@channel", async ({ event, client, logger }) => {
  try {
    let data = fs.readFileSync("./db.json", "utf-8");
    const result = await client.chat.postMessage({
      text: "Hello",
      token:
        "xoxp-4018538520917-4034133310033-4048942319056-cc26d1b10d57ff0b49939c5dba283761",
      channel: "channelmsg",
      blocks: data,
    });
  } catch (error) {
    logger.error(error);
  }
});

app.message(":wave:", async ({ message, say }) => {
  await say(`Hello, <@${message.user}>`);
});

/*                        Starting the bot                        */

(async () => {
  const port = 3000;
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();
