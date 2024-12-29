const nodemailer = require("nodemailer");
const { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } = require("./emailTemplate.js")

const sendVerificationEmail = async ({ email, verificationToken }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.USER,
            pass: process.env.APP_PASSWORD,
        },
    });

    async function main() {
        const info = await transporter.sendMail({
            from: "Varkari Sampraday", // sender address
            to: email, // list of receivers
            subject: "Verify your email", // Subject line
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken), // html body
        });

        console.log("Message sent: %s", info.messageId);
    }
    try {
        await main();
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = { sendVerificationEmail };
