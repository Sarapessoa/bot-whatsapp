const { getClient } = require('./client');

const getContacts = async (req, res) => {
    const { session } = req.headers;

    const client = getClient(session);

    if (client == undefined) return res.status(404).send('Sessão não encontrada');

    try {
        const result = await client.getContacts();

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error when sending: ', error);
        return res.status(500).send('Erro ao retornar os contatos');
    }
};

module.exports = { getContacts }