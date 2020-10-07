const Mail = require('../models/mail');
const queue = require('../controllers/queue');

exports.validate = (req, res, next) => {
  // тут можно добавить разную валидацию
  if (!req.body.to) {
    return res.status(400).json({ success: false, message: 'Не указан адресат письма' });
  }
  return next();
};

exports.handler = (req, res) => {
  const timestamp = Date.now();
  const { to, subject, message } = req.body;

  const newMail = new Mail({
    timestamp, to, subject, message,
  });

  newMail.save((error, { _id }) => {
    if (error) {
      console.error(error.message);
      return res.status(501).json({ success: false, message: error.message });
    }

    const id = _id.toString();
    queue.addTask(id);

    return res.status(200).json({ success: true, message: 'Письмо добавлено в очередь доставки' });
  });
};
