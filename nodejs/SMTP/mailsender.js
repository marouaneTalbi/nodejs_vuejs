const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mailjet = require('node-mailjet').apiConnect(
    '94cb59578ce8bf999fba891984ba559f',
    '9655b7604d4692e64eaacf74939f2ee9',
)
const serverURI = process.env.SERVER_URI;

const fromConfig = {
    Email: 'aminecherigui44@gmail.com',
    Name: 'Challenge Stack',
};

module.exports = {
    async sendConfirmationEmail(email, token) {
        try {
            const request = mailjet.post('send', { version: 'v3.1' }).request({
                Messages: [
                    {
                        From: fromConfig,
                        To: [{ Email: email, Name: 'You' }],
                        TemplateID: 4962863,
                        TemplateLanguage: true,
                        Subject: 'Account Confirmation',
                        TextPart: 'Greetings from Mailjet!',
                        Variables: {
                            token: token,
                            host: serverURI
                        },
                    },
                ],
            });

            const result = await request;
            console.log(result.body);
            return result.body;
        } catch (err) {
            console.error('Error sending confirmation email:', err.statusCode, err.ErrorMessage);
            throw err;
        }
    },
    async sendWelcomEmail(email) {
        try {
            const request = mailjet.post('send', { version: 'v3.1' }).request({
                Messages: [
                    {
                        From: fromConfig,
                        To: [{ Email: email, Name: 'You' }],
                        TemplateID: 4962913,
                        TemplateLanguage: true,
                        Subject: 'Account Confirmed',
                        TextPart: 'Greetings from Mailjet!',
                    },
                ],
            });

            const result = await request;
            console.log(result.body);
            return result.body;
        } catch (err) {
            console.error('Error sending confirmation email:', err.statusCode, err.ErrorMessage);
            throw err;
        }
    },

    async sendCodeEmail(email, code) {
        try {
            const request = mailjet.post('send', { version: 'v3.1' }).request({
                Messages: [
                    {
                        From: fromConfig,
                        To: [{ Email: email, Name: 'You' }],
                        Subject: 'Email Confirmation',
                        TextPart: 'Greetings from Mailjet!',
                        HTMLPart: `<h3>Dear Gamer, here is your code: <h2>${code}</h2> to confirm your Email.</h3>`,
                    },
                ],
            });

            const result = await request;
            console.log(result.body);
            return result.body;
        } catch (err) {
            console.error('Error sending code email:', err.statusCode, err.ErrorMessage);
            throw err;
        }
    },

    async sendForgotPassword(email, token) {
        try {
            const request = mailjet.post('send', { version: 'v3.1' }).request({
                Messages: [
                    {
                        From: fromConfig,
                        To: [{ Email: email, Name: 'You' }],
                        Subject: 'Forgot Password',
                        TemplateID: 4961273,
                        TemplateLanguage: true,
                        Variables: {
                            token: token,
                            host: serverURI
                        },
                        TextPart: 'Greetings from Mailjet!',
                    },
                ],
            });

            const result = await request;
            console.log(result.body);
            return result.body;
        } catch (err) {
            console.error('Error sending forgot password email:', err.statusCode, err.ErrorMessage);
            throw err;
        }
    },
};