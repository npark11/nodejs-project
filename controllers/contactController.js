const User = require("../models/userModel");
const sendEmail = require('../utils/sendEmail');

const contactUs = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(400).json({ message: "User not found, please signup"});
    }

    // Validation
    if (!subject || !message) {
      return res.status(400).json({ message: "Please enter a subject and message"});
    }

    const sent_from = process.env.EMAIL_USER;
    const send_to = process.env.EMAIL_USER;
    const reply_to = user.email;

    console.log(sent_from);
    console.log(send_to);
    console.log(reply_to);

    try {
      await sendEmail(subject, message, send_to, sent_from, reply_to);
      res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (err) {
      res.status(500).json("Email could not be sent, please try again");
    }


  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}


module.exports = { contactUs };
