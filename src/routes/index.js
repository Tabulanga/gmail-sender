const express = require('express');

const router = express.Router();
const mail = require('../middleware/mail');

router.post('/', mail.validate, mail.handler);

module.exports = router;
