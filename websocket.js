// const { createNewSession, getAllClientsVenom} = require('./venom');
// const { tokenExist, deleteTokenResultados, setDestinos } = require('./utils');

const { getClient, createClient } = require('./controllers/client');

const clients = new Set();
const clientsSessions = {};

function listenWebSocket(wss){
    let ws;
    let nameSession;

    wss.on('connection', async (wsNew) => {
        console.log('Conexão WebSocket estabelecida');

        ws = wsNew;
    
        clients.add(ws);

    
        ws.on('close', () => {
            console.log('Cliente desconectado');
        });
    
        ws.on('message', async (message) => {
            console.log(`Mensagem recebida: ${message}`);
    
            const type = JSON.parse(message).type;
            const data = JSON.parse(message).data;
    
            console.log(type)
            console.log(data)

            if(type == 'setNameSession'){
                nameSession = data;

                if(!clientsSessions.hasOwnProperty(nameSession)){
                    clientsSessions[nameSession] = new Set();
                }

                clientsSessions[nameSession].add(ws);

                console.log('entrou no type', type);
                console.log('name session', nameSession);

                const clientWpp = getClient(nameSession);

                if (!clientWpp) {
                    emitToAllClientsSession(nameSession, 'StatusClient', 'DISCONNECT');
                    console.log('desconectado');
                }
                else {

                    if (clientWpp != undefined) {
                        const status = await clientWpp.getState();

                        console.log(status);
            
                        emitToAllClientsSession(nameSession, 'StatusClient', status)
                        console.log('conectado');a
                    }
                }
            }

    
            if (type == 'qrcode') {
    
                if (clientWpp) {
                    clients.logout();
                }
    
    
                createClient(nameSession);
            }
    
            if (type == 'getStatusClient') {
                const clientWpp = getClient(nameSession);

                if (clientWpp) {
                    const status = await clientWpp.getState();
    
                    emitToAllClientsSession(nameSession, 'StatusClient', status)
                }
            }
    
        });
    
        // if (clientsVenom[nameSession] != undefined) {
    
        //     clientsVenom[nameSession].onStateChange((state) => {
        //         console.log('State changed: ', state);
    
        //         emitToAllClientsSession(nameSession, 'StatusClient', state)
    
        //     });
        // }
    });
}

function emitToAllClients(eventName, eventData) {
    const eventMessage = JSON.stringify({ type: eventName, data: eventData });

    for (const client of clients) {
        client.send(eventMessage);
    }
}

function emitToAllClientsSession(session, eventName, eventData) {
    const eventMessage = JSON.stringify({ type: eventName, data: eventData });

    for (const client of clientsSessions[session]) {
        client.send(eventMessage);
    }
}


module.exports = { listenWebSocket, emitToAllClients }