const { getClient } = require('./client');
const { MessageMedia } = require('whatsapp-web.js');


const sendMessage = async (req, res) => {
    const { msg, destinos } = req.body;
    const { session } = req.headers;

    const client = getClient(session);

    if (client == undefined) return res.status(404).send('Sessão não encontrada');

    try {
        for (const destino of destinos) {
            const result = await client.sendMessage(destino, msg);
            console.log('Result: ', result);
            await delay(1000);
        }
        return res.send('Mensagem enviada com sucesso!');
    } catch (error) {
        console.error('Error when sending: ', error);
        return res.status(500).send('Erro ao enviar a mensagem');
    }
};

const sendMessageStickerImage = async (req, res) => {
    const { url, destinos } = req.body;
    const { session } = req.headers;

    const client = getClient(session);

    if (client == undefined) return res.status(404).send('Sessão não encontrada');

    try {
        for (const destino of destinos) {
            const media = await MessageMedia.fromUrl(url);

            const result = await client.sendMessage(destino, media, {sendMediaAsSticker: true});
            console.log('Result: ', result);
            await delay(1000);
        }
        return res.send('Figurinha enviada com sucesso!');
    } catch (error) {
        console.error('Error when sending: ', error);
        return res.status(500).send('Erro ao enviar a mensagem');
    }
};

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { sendMessage, sendMessageStickerImage }