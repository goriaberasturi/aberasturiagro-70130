import { createTransport } from 'nodemailer';
import { config } from './../config/index.js';

const transport = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmail_user,
        pass: config.gmail_pass
    }
});

const sendEmail = async ({userClient='', subject='', html=''}) => {
    console.log(userClient, subject, html);
    await transport.sendMail({
        from: `<${config.gmail_user}>`,
        to: userClient,
        subject,
        html
    });
}

export { sendEmail };