const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "realauthor.com",
  port: 465,
  secure: true,
  auth: {
    user: "noreplay@realauthor.com",
    pass: "Realauthor@123",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// console.log(transporter);

const mailOptions = {
  from: "noreplay@realauthor.com",
  to: "hooodamonem111@gmail.com",
  subject: "Email Verification",
  html:
    // eslint-disable-next-line no-template-curly-in-string
    'Hello,<br /><br />Thank you for registering. First, you need to confirm your account. Just click the link below.<br /><br /><a href="${url}">${url}</a><br /><br />Regards,<br />Realauthor',
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.log(err);
  } else {
    console.log("message sent ", info);
  }
});
