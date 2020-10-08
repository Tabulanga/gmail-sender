const path = require('path');
const { google } = require('googleapis');
const { authenticate } = require('@google-cloud/local-auth');
const config = require('../config/config');

const CREDENTIALS_PATH = path.join(__dirname, '../config/credentials.json');

const gmail = google.gmail('v1');

const init = async () => {
  const auth = await authenticate({
    keyfilePath: CREDENTIALS_PATH,
    scopes: [
      'https://www.googleapis.com/auth/gmail.send',
    ],
  });
  google.options({ auth });
};

async function send({ to, subject, message }) {
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    `From: ${config.gmail.user}`,
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    message,
  ];
  const messageStr = messageParts.join('\n');

  // The body needs to be base64url encoded.
  const encodedMessage = Buffer.from(messageStr)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });
  console.log(res.data);
  return res.data;
}

if (module === require.main) {
  send().catch(console.error);
}

module.exports = {
  init,
  send,
};
