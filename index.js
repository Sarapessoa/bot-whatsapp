const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const chalk = require('chalk');
const ora = require('ora');

const { createClient } = require('./controllers/client');

const { listenWebSocket } = require('./websocket');
const { allTokensExist } = require('./utils');
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

    const allSessions = allTokensExist();

    if(allSessions.length > 0){
        console.log(chalk.green(`(${allSessions.length}) Cliente(s) encontrado(s)`))
    }
    else{
        console.log(chalk.red(`Nenhum cliente encontrado`))
    }

    for(const session_name of allSessions){
        const session = session_name.split('session-')[1];
        createClient(session);
    }

    
});
