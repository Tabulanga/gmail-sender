require('dotenv').config();

module.exports = {
  port: process.env.API_PORT || 3030,

  database: {
    uri: process.env.MONGODB_URL || 'mongodb://localhost:27017/gmail-sender',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  gmail: {
    user: process.env.GUSER || '',
    password: process.env.GPASS || '',
  },
};
