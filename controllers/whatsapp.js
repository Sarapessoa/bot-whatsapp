const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth({
        "clientId": "botTeste"
    }),
    puppeteer: { 
        headless: true
    }
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);

    qrcode.generate(qr, { small: true }, function (qrcode) {
        console.log(qrcode);
      });
      
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', async () => {
    console.log('Client is ready!');

    // const contacts = await client.getContacts();

    // for(const contact of contacts){
    //     console.log(contact.name);
    // }

    const chats = await client.getChats();

    for(const chat of chats){
        console.log(chat)
    }

});

client.on('disconnected', () => {
    console.log('Disconectado');
});

client.on('message', async (msg) => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }

    if(msg.body.startsWith('.fig') && msg.type == 'image'){
        const media = await msg.downloadMedia();

        client.sendMessage(msg.from, media, {sendMediaAsSticker: true});
    }

    if(msg.body == '.logout'){
        client.logout();
    }

    if(msg.body == '.destroy'){
        client.destroy();
    }
});


client.initialize();