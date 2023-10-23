const express = require('express');

const { getStateClient, getInfosClient } = require('./controllers/client');
const { sendMessage, sendMessageStickerImage, sendMessageResultados } = require('./controllers/message');
const { getContacts } = require('./controllers/contacts');
const { getGroups } = require('./controllers/groups');


const router = express.Router();

//Client
router.get('/state', getStateClient);
router.get('/infos', getInfosClient);

//Message
router.post('/send', sendMessage);
router.post('/send/resultados', sendMessageResultados);
router.post('/send/sticker/image', sendMessageStickerImage);

//Contacts
router.get('/contacts', getContacts);

//Groups
router.get('/groups', getGroups);

module.exports = router;