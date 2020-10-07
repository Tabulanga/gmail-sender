/* eslint-disable no-await-in-loop */
const redis = require('redis');
const asyncRedis = require('async-redis');
const config = require('../config/config');

const redisClient = redis.createClient(config.redis);
const asyncRedisClient = asyncRedis.decorate(redisClient);
const Mail = require('../models/mail');
const { send } = require('../controllers/sender');

asyncRedisClient
  .on('connect', () => console.log('Redis - successful connection ...'))
  .on('error', ({ message }) => console.error('Redis error: ', message))
  .on('reconnecting', () => console.log('Redis reconnecting...'));

const handleTask = async (id) => {
  await Mail.findOne({ _id: id }, ((error, mail) => {
    if (error || !mail) return console.log('Queue error: ', error);

    return send(mail);
  }));
  return true;
};

const queueManager = async () => {
/* eslint no-constant-condition: ["error", { "checkLoops": false }] */
  while (true) {
    let elem;

    try {
    //  elem = await asyncRedisClient.lpop("mail_queue"); // неблокирующий
      elem = await asyncRedisClient.blpop('mail_queue', 1); // блокирующий на 1 сек
    } catch ({ message }) {
      console.log('Queue. Redis error: ', message);
    }

    if (elem) {
      await handleTask(elem[1]); // для неблокирующего просто elem
    }
  }
};

exports.addTask = mailId => redisClient.rpush('mail_queue', mailId);

exports.queueManagerStart = () => queueManager();
