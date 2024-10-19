const Message = require('../models/Message');

// Retrieve message history between two users
exports.retrieveMessageHistory = async (req, res) => {
  const { userId, contactId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: contactId },
        { sender: contactId, receiver: userId },
      ],
    }).sort({ sentAt: 1 });

    res.json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving message history', error });
  }
};
