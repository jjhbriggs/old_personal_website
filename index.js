// update the dg links to use actual links to sections and sites, including the "Read more about it in the ‘Recent Projects’ section."" bubbles
const express = require('express')
const dotenv =  require("dotenv")
const Dialogflow = require("@google-cloud/dialogflow")
const { v4 } = require("uuid")
const cors =  require("cors")
dotenv.config();

const path = require('path')
const PORT = process.env.PORT || 5000
app = express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
  .use(express.urlencoded())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(cors())
  .get('/', (req, res) => res.render('pages/index'))
  .get('/detail1', (req, res) => res.render('pages/detail1'))
  .get('/detail2', (req, res) => res.render('pages/detail2'))
  .get('/detail3', (req, res) => res.render('pages/detail3'))
  .get('/detail4', (req, res) => res.render('pages/detail4'))
  .get('/detail5', (req, res) => res.render('pages/detail5'));
  const http = require('http').Server(app);
  const io = require('socket.io')(http);
  const fs = require('fs');
  fs.writeFileSync('key.json', process.env.DG_SECRET);

io.on('connection', async function(socket) {
  console.log(socket.id + ' connected');
  //const client_ts = (await chat.sendMsg("[SYS_MSG] " + socket.id + " connected")).ts; 

  socket.on('user-message', async (msg) => {
    io.sockets.to(socket.id).emit('confirmed', msg);
    const sessionClient = new Dialogflow.SessionsClient({
      keyFilename: path.join(__dirname, 'key.json'),
    });
    const sessionPath = sessionClient.projectAgentSessionPath(
      process.env.PROJECT_ID,
      v4()
    );
    // The dialogflow request object
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text: msg,
          languageCode: "en",
        },
      },
    };

    // Sends data from the agent as a response
    try {
      const responses = await sessionClient.detectIntent(request);
      for (const msg of responses[0].queryResult.fulfillmentMessages) {
        io.sockets.to(socket.id).emit('recieved', msg.text.text);
      }
    } catch (e) {
      console.log(e);
    }


    // chat.sendThreadReply("[USR_MSG]" + msg, client_ts);
  });
  socket.on('disconnect', function () {
    console.log('A user disconnected.. deleteing stuff');
 });

});
http.listen(PORT, function() {
  console.log(`Listening on ${ PORT }`);
});