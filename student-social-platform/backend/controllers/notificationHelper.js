const Notification = require('../models/Notification');

// small shared helper so like/comment/follow controllers don't repeat this logic.
// silently skips notifying yourself (e.g. liking your own post)
const createNotification = async ({ recipient, sender, type, post }) => {
  if (recipient.toString() === sender.toString()) return;
  await Notification.create({ recipient, sender, type, post });
};

module.exports = { createNotification };
