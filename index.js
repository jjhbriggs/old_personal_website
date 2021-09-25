const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const chat = require('./chat');

const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
var glob_msg = "nothing yet";
let update_messages = false;
slackEvents.on('message', (event) => {
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text} at ${event.ts} with a thread_ts of at ${event.thread_ts}`);
  if(event.user != undefined && event.user != "U02FH8D3HLK"){ //obviously change for proper id
    console.log("sending thread reply");
    if (event.thread_ts != undefined){ //reply is in a thread
      chat.sendThreadReply("Hey, this should be threaded(reply)", event.thread_ts);
    }else{
      chat.sendThreadReply("Hey, this should be threaded", event.ts);
    }
    update_messages = true;
  }
  glob_msg = event.text
});
// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use('/slack/events', slackEvents.expressMiddleware())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/events', async function(req, res) {
    res.set({
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive'
    });
    res.flushHeaders();
    // Tell the client to retry every 10 seconds if connectivity is lost
    res.write('retry: 10000\n\n');
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 1000)); //update every second at a minimum
      if (update_messages){
        res.write(`data: ${JSON.stringify({message: glob_msg, sent: false})}\n\n`);
        update_messages = false;
      }
      
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
//chat.sendTime();

// Attach the event adapter to the express app as a middleware