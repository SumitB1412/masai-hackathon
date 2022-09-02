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

app.command("/knowledge", async ({ command, ack, say }) => {
  try {
    await ack();
    say("Yaaay! that command works!");
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

// app.message("hello there", async ({ message, say }) => {
//   await say({
//     blocks: [
//       {
//         type: "section",
//         text: {
//           type: "mrkdwn",
//           text: `Hey there <@${message.user}>!`,
//         },
//         accessory: {
//           type: "button",
//           text: {
//             type: "plain_text",
//             text: "Click Me",
//           },
//           action_id: "button_click",
//         },
//       },
//     ],
//     text: `Hey there <@${message.user}>!`,
//   });
// });

// app.action('button_click', async ({ body, ack, say }) => {
//   await ack();
//   await say(`<@${body.user.id}> clicked the button`);
// });

// app.message("hey", async ({ command, say }) => {
//   try {
//     let random = Math.floor(Math.random() * (5 - 0) + 0);
//     say(commands[random]);
//   } catch (error) {
//     console.log("err");
//     console.error(error);
//   }
// });

app.event("app_mention", async ({ event, client, logger }) => {
  let messages = [];
  try {
    // console.log(client);
    const result = await client.search.messages({
      token: process.env.REQUEST_TOKEN,
      query: "@channel",
    });
    let i = 0;
    result.messages.matches.forEach((el) => {
      messages[i] = { type: null, text: null };
      messages[i].type = "section";
      messages[i].text = { type: null, text: null };
      messages[i].text.type = "mrkdwn";
      if (el.blocks[0].elements) {
        if (el.blocks[0].elements[0].elements[0].text)
          messages[i].text.text = el.blocks[0].elements[0].elements[0].text;
        else messages[i].text.text = el.blocks[0].elements[0].elements[1].text;
      }
      i++;
    });
    // console.log(messages)
    fs.writeFile("./db.json", JSON.stringify(messages), "utf-8", () => {
      console.log("Data added");
    });
    // });
    logger.info(messages);
  } catch (error) {
    logger.error(error);
  }
});

app.message("@channel", async ({ event, client, logger }) => {
  try {
    const data = fs.readFileSync("./db.json", "utf-8");
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

// app.event("app_mention", async ({ event, client, logger }) => {
//   try {
//     const result = await client.conversations.history({
//       token: process.env.SLACK_BOT_TOKEN,
//     });

// for (const channel of result.channels) {
//   if (channel.name === "masai-hackathon") {
//     conversationId = channel.id;

//     // Print result
//     console.log("Found conversation ID: " + conversationId);
//     // Break from for loop
//     break;
//   }
// }
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// });

// Find conversation with a specified channel `name`
// findConversation("general");

app.message(":wave:", async ({ message, say }) => {
  await say(`Hello, <@${message.user}>`);
});

(async () => {
  const port = 3000;
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();
