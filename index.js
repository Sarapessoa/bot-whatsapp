const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const { createClient } = require('./controllers/client');

const { listenWebSocket } = require('./websocket');
// const { allTokensExist } = require('./utils');
// const { createOldSession } = require('./venom');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

listenWebSocket(wss);

app.use('/', routes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {

    console.log(`Servidor aberto na porta: ${PORT}`);

    createClient('botTeste');
    
});
