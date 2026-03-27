const Notification = require("../models/Notification");

const createAndEmitNotification = async (io, { recipient, type, title, message, data = {} }) => {
  try {
    const notification = await Notification.create({
      recipient,
      type,
      title,
      message,
      data,
    });

    // Emit to the recipient's room in real-time
    io.to(recipient.toString()).emit("new_notification", notification);

    return notification;
  } catch (error) {
    console.error("Notification error:", error);
  }
};

module.exports = { createAndEmitNotification };