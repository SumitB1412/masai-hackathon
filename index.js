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
  try {
    // console.log(client);
    const result = await client.search.messages({
      token:
        "xoxp-4018538520917-4034133310033-4048942319056-cc26d1b10d57ff0b49939c5dba283761",
      query: "hey",
    });
    // console.log(result.matches);
    logger.info(result.messages.matches);
  } catch (error) {
    logger.error(error);
  }
});

app.message("@channel", async ({ command, say }) => {
  try {
    say("hello");
  } catch (error) {
    console.log("err");
    console.error(error);
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
