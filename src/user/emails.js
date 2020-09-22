const nodemailer = require('nodemailer');

const configurationEmailProduction = {
  host: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_USUARIO,
    pass: process.env.EMAIL_SENHA
  },
  secure: true
};

const configurationEmailTest = (acountTest) => ({
  host: 'smtp.ethereal.email',
  auth: acountTest,
});


async function createConfigurationEmail() {
  if (process.env.NODE_ENV === 'production') {
    return configurationEmailProduction;
  } else {
    const acountTest = await nodemailer.createTestAccount();
    return configurationEmailTest(acountTest);
  }
}

class Email {
  async sendEmail() {
    const configurationEmail = await createConfigurationEmail();
    const transport = nodemailer.createTransport(configurationEmail);
    const info = await transport.sendMail(this);

    if (process.env.NODE_ENV !== 'production') {
      console.log('URL: ' + nodemailer.getTestMessageUrl(info));
    }
  }
}

class EmailVerification extends Email {
  constructor(user, address) {
    super();
    this.from = '"minhas Contas" <noreply@minhascontas.com.br>';
    this.to = user.userEmail;
    this.subject = 'Verificação de e-mail';
    this.text = `Olá! Verifique seu e-mail aqui: ${address}`;
    this.html = `<h1>Olá!</h1> Verifique seu e-mail aqui: <a href="${address}">${address}</a>`;
  }
}

module.exports = { EmailVerification };
