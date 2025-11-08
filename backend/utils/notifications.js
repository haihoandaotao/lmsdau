const Notification = require('../models/Notification');

// Create notification helper
const createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    
    // Emit socket event if io is available
    if (global.io) {
      global.io.to(data.recipient.toString()).emit('notification', notification);
    }
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Create multiple notifications
const createBulkNotifications = async (notifications) => {
  try {
    const created = await Notification.insertMany(notifications);
    
    // Emit socket events
    if (global.io) {
      created.forEach(notif => {
        global.io.to(notif.recipient.toString()).emit('notification', notif);
      });
    }
    
    return created;
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    return [];
  }
};

// Send email notification (placeholder)
const sendEmailNotification = async (to, subject, message) => {
  // TODO: Implement email sending using nodemailer
  console.log(`Email would be sent to ${to}: ${subject}`);
  return true;
};

module.exports = {
  createNotification,
  createBulkNotifications,
  sendEmailNotification
};
