const { WebClient } = require('@slack/web-api');


module.exports = {
  sendTime(){
    // An access token (from your Slack app or custom integration - xoxp, xoxb)
    const web = new WebClient(process.env.SLACK_TOKEN);
    // The current date
    const currentTime = new Date().toTimeString();

    (async () => {

      try {
        // Use the `chat.postMessage` method to send a message from this app
        await web.chat.postMessage({
          channel: '#chat-test',
          text: `The current time is ${currentTime}`,
        });
        console.log('Message posted!');
      } catch (error) {
        console.log(error);
      }

    })();
  },
  sendThreadReply(msg, ts_in){
    // An access token (from your Slack app or custom integration - xoxp, xoxb)
    const web = new WebClient(process.env.SLACK_TOKEN);
    // The current date

    (async () => {

      try {
        // Use the `chat.postMessage` method to send a message from this app
        await web.chat.postMessage({
          channel: '#chat-test',
          text: msg,
          thread_ts: ts_in,
        });
        console.log('Message posted!');
      } catch (error) {
        console.log(error);
      }

    })();
  }

};