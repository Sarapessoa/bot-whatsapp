const { getClient } = require('./client');

const getGroups = async (req, res) => {
    const { session } = req.headers;

    const client = getClient(session);

    if (client == undefined) return res.status(404).send('Sessão não encontrada');

    try {
        const chats = await client.getChats();

        const result = chats.filter((chat) => { return chat.isGroup == true});

        console.log(result.length);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error when sending: ', error);
        return res.status(500).send('Erro ao retornar os groups');
    }
};

module.exports = { getGroups }