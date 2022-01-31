"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();
  let receiver = process.argv[2]
  let lintResult = (parseInt(process.argv[3]) == 0) ? "Resultado Correcto" : "Resultado incorrecto"
  let testResult = (parseInt(process.argv[4]) == 0) ? "Resultado Correcto" : "Resultado incorrecto"
  let updateResult = (parseInt(process.argv[5]) == 0) ? "Resultado Correcto" : "Resultado incorrecto"
  let pushResult = (parseInt(process.argv[6]) == 0) ? "Resultado Correcto" : "Resultado incorrecto"
  let vercelResult = (process.argv[7] == null) ? "Resultado Correcto" : "Resultado incorrecto"

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'adri7agu@gmail.com', // generated ethereal user
      pass: "jqzmamgyuhvcoqal", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'adri7agu@gmail.com', // sender address
    to: receiver, // list of receivers
    subject: "Resultado de la pipeline ejecutada", // Subject line
    text: "Linter_stage: "+lintResult+" ,Test_stage: "+testResult+" ,Update_readme_stage: "+updateResult+" ,Push_Changes_Stage: "+pushResult+" ,Vercel_Stage: "+vercelResult, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);