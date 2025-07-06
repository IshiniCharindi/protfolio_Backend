// controllers/contactController.js
const nodemailer = require('nodemailer');

exports.handleContactForm = async (req, res) => {
    const {
        name,
        email,
        phone,
        company,
        message,
        selectedPackage,
        packagePrice,
    } = req.body;

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: 'New Contact Inquiry',
        html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Message:</strong> ${message}</p>
            ${selectedPackage ? `
            <p><strong>Package:</strong> ${selectedPackage} - $${packagePrice}</p>
            ` : ''}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send message.' });
    }
};
