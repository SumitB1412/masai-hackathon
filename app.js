app.command("/knowledge", async ({ command, ack, say }) => {
    try {
      const result = await app.client.search.messages({
        token: process.env.REQUEST_TOKEN,
        query: "https",
      });
      // await say({
      //   blocks: [
      //     {
      //       type: "section",
      //       text: {
      //         type: "mrkdwn",
      //         text: `Hey there <@${message.user}>!`,
      //       },
      //       accessory: {
      //         type: "button",
      //         text: {
      //           type: "plain_text",
      //           text: "Click Me",
      //         },
      //         action_id: "button_click",
      //       },
      //     },
      //   ],
      //   text: `Hey there <@${message.user}>!`,
      // });
    } catch (error) {
      console.log("err");
      console.error(error);
    }
  });