const { getClient, getAllClients } = require('./client');
const { getDestinos, getTextForResultados } = require('../utils');
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
        return res.status(200).send('Mensagem enviada com sucesso!');
    } catch (error) {
        console.error('Error when sending: ', error);
        return res.status(500).send('Erro ao enviar a mensagem');
    }
};

const sendMessageResultados = async (req, res) => {
    const msg = req.body.data;

    const allClients = getAllClients();

    for(const session in allClients){
        const client = allClients[session];

        const { destinos, contact } = await getDestinos(session);

        try {

            const aviso = await getTextForResultados();

            for (const destino of destinos) {

                const result = await client.sendMessage(destino, msg)
                console.log('Result: ', result);

                if(contact.number != ""){
                    const resultAviso = await client.sendMessage(destino, aviso);
                    console.log('Result Aviso: ', resultAviso); // return object success

                    const contact_info = await client.getContactById(contact.number);

                    const result_contact = await client.sendMessage(destino, contact_info, {parseVCards: true});
                    console.log('Result contact: ', result_contact);
                }
                await delay(1000);
            }

            
            return res.status(200).send('Mensagem enviada com sucesso!');

        } catch (error) {
            console.error('Error when sending: ', error);
            return res.status(500).send('Erro ao enviar a mensagem de resultados');
        }
    }

    if (client == undefined) return res.status(404).send('Sessão não encontrada');

    try {
        for (const destino of destinos) {
            const result = await client.sendMessage(destino, msg);
            console.log('Result: ', result);
            await delay(1000);
        }
        return res.status(200).send('Mensagem enviada com sucesso!');
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
        return res.status(200).send('Figurinha enviada com sucesso!');
    } catch (error) {
        console.error('Error when sending: ', error);
        return res.status(500).send('Erro ao enviar a mensagem de figurinha');
    }
};

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { sendMessage, sendMessageStickerImage, sendMessageResultados }