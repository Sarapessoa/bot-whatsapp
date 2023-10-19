const { Client, LocalAuth, Util } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const chalk = require('chalk');
const ora = require('ora');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(require('@ffmpeg-installer/ffmpeg').path);

const clients = {};
let spinner;

function getClient(id){
    return clients[id] || undefined;
}

function createClient(id){

    exibirMsgCriandoClient(id);

    const chromiumArgs = [
        '--disable-web-security', '--no-sandbox', '--disable-web-security',
        '--aggressive-cache-discard', '--disable-cache', '--disable-application-cache',
        '--disable-offline-load-stale-cache', '--disk-cache-size=0',
        '--disable-background-networking', '--disable-default-apps', '--disable-extensions',
        '--disable-sync', '--disable-translate', '--hide-scrollbars', '--metrics-recording-only',
        '--mute-audio', '--no-first-run', '--safebrowsing-disable-auto-update',
        '--ignore-certificate-errors', '--ignore-ssl-errors', '--ignore-certificate-errors-spki-list'
    ];
    

    const client = new Client({
        authStrategy: new LocalAuth({
            "clientId": id
        }),
        puppeteer: { 
            headless: true,
            args: chromiumArgs
        },
        ffmpegPath: require('@ffmpeg-installer/ffmpeg').path
    });

    startClient(id, client);
}

function startClient(id, client){

    client.on('qr', (qr) => {
        // Generate and scan this code with your phone
        console.log('QR RECEIVED', qr);
    
        qrcode.generate(qr, { small: true }, function (qrcode) {
            console.log(qrcode);
          });
          
    });
    
    client.on('authenticated', () => {
        stopMsgCriandoClient();
        console.log(chalk.green(`[${id}]: cliente autenticado com sucesso!`));
        clients[id] = client;
    });
    
    client.on('auth_failure', msg => {
        // Fired if session restore was unsuccessful
        console.log(chalk.red(`[${id}]: não foi possível autenticar o cliente`));
    });
    
    client.on('ready', async () => {
        console.log(chalk.green(`[${id}]: cliente pronto`));
    });
    
    client.on('disconnected', () => {
        console.log(chalk.red(`[${id}]: cliente desconectado`));
    });
    
    client.on('message', async (msg) => {
    
        if(msg.body.startsWith('/fig') && (msg.type == 'image' || msg.type == 'video')){
            const media = await msg.downloadMedia();

            const texto = msg.body;
            const array_texto = texto.split('/');
            const nomeFig = array_texto.length > 1 ? array_texto[2] : 'sem-nome';
    
            client.sendMessage(msg.from, media, {sendMediaAsSticker: true, stickerName: nomeFig});
        }

    });

    client.on('message_create', async (msg) => {
    
        if(msg.body.startsWith('/fig') && (msg.type == 'image' || msg.type == 'video') && msg.fromMe){
            const media = await msg.downloadMedia();

            const texto = msg.body;
            const array_texto = texto.split('/');
            const nomeFig = array_texto.length > 1 ? array_texto[2] : 'sem-nome';
    
            client.sendMessage(msg.to, media, {sendMediaAsSticker: true, stickerName: nomeFig});
        }
    });

    client.initialize();
}

const getState = async (req, res) => {

    const { session } = req.headers;

    const client = getClient(session);

    if(client == undefined) return res.status(404).send('Sessão não encontrada');

    try {

        const result = await client.getState();

        return res.json(result);

    } catch (erro) {
        console.error('Error when sending: ', erro); // return object error
        return res.status(500).send('Erro para acessar as informações!');
    }
};

//  Auxiliares

function exibirMsgCriandoClient(id){
    spinner = ora(`[${id}]: criando cliente...`).start();

}

function stopMsgCriandoClient(){
    spinner.stop();
}

module.exports = { getClient, createClient, getState }