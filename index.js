const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const chat = require('./chat');

const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
slackEvents.on('message', (event) => {
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text} at ${event.ts} with a thread_ts of at ${event.thread_ts}`);
  if(event.user != undefined && event.user != "U02FH8D3HLK"){
    console.log("sending thread reply");
    if (event.thread_ts != undefined){ //reply is in a thread
      chat.sendThreadReply("Hey, this should be threaded(reply)", event.thread_ts);
    }else{
      chat.sendThreadReply("Hey, this should be threaded", event.ts);
    }
    
  }
});
// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use('/slack/events', slackEvents.expressMiddleware())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
//chat.sendTime();

// Attach the event adapter to the express app as a middleware