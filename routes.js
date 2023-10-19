const express = require('express');

const { getState } = require('./controllers/client');
const { sendMessage, sendMessageStickerImage } = require('./controllers/message');

const router = express.Router();

//Client
router.get('/state', getState);

//Message
router.post('/send', sendMessage);
router.post('/send/sticker/image', sendMessageStickerImage);

module.exports = router;