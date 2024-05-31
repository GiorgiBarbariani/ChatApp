const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors()); 
const messages = [];
const MAX_MESSAGES = 9;

// WebSocket server
const wss = new WebSocket.Server({ port: 3002 });

const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// HTTP Routes
app.post('/messages', (req, res) => {
  const message = req.body.message;
  if (messages.length >= MAX_MESSAGES) {
    const removedMessage = messages.shift();
    broadcast({ type: 'removed', message: removedMessage });
  }
  messages.push(message);
  broadcast({ type: 'added', message });
  res.status(201).send({ success: true });
});

app.get('/messages', (req, res) => {
  res.status(200).send(messages);
});

app.listen(port, () => {
  console.log(`HTTP server listening at http://localhost:${port}`);
});

console.log(`WebSocket server listening at ws://localhost:3002`);
