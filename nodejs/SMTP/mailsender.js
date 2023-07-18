const mailjet = require('node-mailjet').apiConnect(
    '94cb59578ce8bf999fba891984ba559f',
    '9655b7604d4692e64eaacf74939f2ee9',
)

module.exports = {
    sendConfirmationEmail: function (email, token) {
        const request = mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: 'aminecherigui44@gmail.com',
                        Name: 'Challenge Stack',
                    },
                    To: [
                        {
                            Email: email,
                            Name: 'You',
                        },
                    ],
                    Subject: 'Account Confirmation',
                    TextPart: 'Greetings from Mailjet!',
                    HTMLPart: `<h3>Dear Gamer, welcome to our Gaming App</h3><br>Click <a href="http://localhost:5173/confirm?token=${token}">here</a> to confirm your account.`,
                },
            ],
        });

        return request
            .then(result => {
                console.log(result.body);
                return result.body;
            })
            .catch(err => {
                console.log(err.statusCode);
                throw err;
            });
    },
    sendCodeEmail: function (email, code) {
        const request = mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: 'aminecherigui44@gmail.com',
                        Name: 'Challenge Stack',
                    },
                    To: [
                        {
                            Email: email,
                            Name: 'You',
                        },
                    ],
                    Subject: 'Email Confirmation',
                    TextPart: 'Greetings from Mailjet!',
                    HTMLPart: `<h3>Dear Gamer, here is you code :  <h2>${code}</h2> to confirm your Email.`,
                },
            ],
        });

        return request
            .then(result => {
                console.log(result.body);
                return result.body;
            })
            .catch(err => {
                console.log(err.statusCode);
                throw err;
            });
    },
    sendForgotPassword: function (email, token) {
        const request = mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: 'aminecherigui44@gmail.com',
                        Name: 'Challenge Stack',
                    },
                    To: [
                        {
                            Email: email,
                            Name: 'You',
                        },
                    ],
                    Subject: 'Forgot Password',
                    TextPart: 'Greetings from Mailjet!',
                    HTMLPart: `<h3>Dear Gamer, welcome to our Gaming App</h3><br>Click <a href="http://localhost:5173/initPassword?token=${token}">here</a> to initialise your Password.`,
                },
            ],
        });
        return request
            .then(result => {
                console.log(result.body);
                return result.body;
            })
            .catch(err => {
                console.log(err.statusCode);
                throw err;
            });
    }
};


/*sendConfirmationEmail(email, token)
    .then(response => {
        console.log('E-mail sent successfully');
    })
    .catch(error => {
        console.log('Failed to send e-mail:', error);
    });*/