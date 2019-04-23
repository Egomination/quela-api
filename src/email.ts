import mailer from "nodemailer";

const transporter = mailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'claude.dare@ethereal.email',
    pass: 'Gqscqy8rzycxsJbCey'
  }
});

const sendMail = async (currValue: string) => {
  let info = await transporter.sendMail({
    from: '"Claude Dare" <claude.dare@ethereal.email>',
    to: '"Claude Dare" <claude.dare@ethereal.email>',
    subject: "Alert",
    text: currValue,
  });
  //console.log("Preview URL: %s", mailer.getTestMessageUrl(info));
}

export default sendMail;