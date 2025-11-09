// controllers/contactController.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    auth: {
        user: "apikey",           // literally the word "apikey"
        pass: process.env.SENDGRID_API_KEY,  // the API key from environment variables
    },
});

exports.handleContactForm = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { name, email, phone, company, message, selectedPackage, packagePrice } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
        }


        console.log('EMAIL_USER:', process.env.EMAIL_USER);
        console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' : 'MISSING');

        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         pass: process.env.EMAIL_PASS,
        //     },
        // });

        await transporter.verify(); // <-- checks if SMTP works
        console.log('SMTP verified!');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            replyTo: email,
            to: process.env.EMAIL_USER,
            subject: `New Contact Inquiry from ${name}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background-color: #36454F;
                            color: white;
                            padding: 20px;
                            text-align: center;
                            border-radius: 5px 5px 0 0;
                        }
                        .content {
                            padding: 20px;
                            background-color: #f9f9f9;
                            border-radius: 0 0 5px 5px;
                            border: 1px solid #ddd;
                        }
                        .detail-row {
                            margin-bottom: 15px;
                        }
                        .label {
                            font-weight: bold;
                            color: #36454F;
                            display: inline-block;
                            width: 120px;
                        }
                        .package-info {
                            background-color: #e8f5e9;
                            padding: 15px;
                            border-radius: 5px;
                            margin-top: 20px;
                            border-left: 4px solid #4caf50;
                        }
                        .message-box {
                            background-color: white;
                            padding: 15px;
                            border-radius: 5px;
                            border: 1px solid #eee;
                            margin-top: 20px;
                        }
                        .footer {
                            margin-top: 30px;
                            text-align: center;
                            font-size: 12px;
                            color: #777;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>New Contact Form Submission</h2>
                    </div>
                    <div class="content">
                        <div class="detail-row">
                            <span class="label">Name:</span>
                            <span>${name}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Email:</span>
                            <span><a href="mailto:${email}">${email}</a></span>
                        </div>
                        ${phone ? `
                        <div class="detail-row">
                            <span class="label">Phone:</span>
                            <span><a href="tel:${phone}">${phone}</a></span>
                        </div>
                        ` : ''}
                        ${company ? `
                        <div class="detail-row">
                            <span class="label">Company:</span>
                            <span>${company}</span>
                        </div>
                        ` : ''}
                        
                        <div class="message-box">
                            <div class="label">Message:</div>
                            <p>${message.replace(/\n/g, '<br>')}</p>
                        </div>
                        
                        ${selectedPackage ? `
                        <div class="package-info">
                            <h3>Package Selected</h3>
                            <div class="detail-row">
                                <span class="label">Package:</span>
                                <span>${selectedPackage}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Price:</span>
                                <span>$${packagePrice}</span>
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="footer">
                            <p>This message was sent from your website contact form.</p>
                            <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
};