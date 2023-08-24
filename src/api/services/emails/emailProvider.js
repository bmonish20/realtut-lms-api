const nodemailer = require("nodemailer");
const moment = require("moment-timezone");
const { emailConfig, resetPasswordUrl } = require("../../../config/vars");
const Email = require("email-templates");

// SMTP is the main transport in Nodemailer for delivering messages.
// SMTP is also the protocol used between almost all email hosts, so its truly universal.
// if you dont want to use SMTP you can create your own transport here
// such as an email service API or nodemailer-sendgrid-transport

const transporter = nodemailer.createTransport({
  port: emailConfig.port,
  host: emailConfig.host,
  auth: {
    user: emailConfig.username,
    pass: emailConfig.password,
  },
  secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

// verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.log("error with email connection");
  }
});

exports.sendEmailVerification = async (verificationObj) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: emailConfig.username,
    },
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: "emailVerification",
      message: {
        to: verificationObj.userEmail,
      },
      locals: {
        productName: "RealTuT",
        verificationCode: verificationObj.code,
        year: moment().year(),
      },
      attachments: [
        {
          filename: "brand-logo.jpg",
          path: `${__dirname}/assets/img/brand-logo.jpg`,
          cid: "logo",
        },
      ],
    })
    .catch((err) => console.log("Unable to send verification email. ", err));
};

exports.sendPasswordReset = async (passwordResetObject) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: emailConfig.username,
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });
  email
    .send({
      template: "passwordReset",
      message: {
        to: passwordResetObject.userEmail,
      },
      attachments: [
        {
          filename: "brand-logo.jpg",
          path: `${__dirname}/assets/img/brand-logo.jpg`,
          cid: "logo",
        },
      ],
      locals: {
        productName: "RealTut",
        // passwordResetUrl should be a URL to your app that displays a view where they
        // can enter a new password along with passing the resetToken in the params
        passwordResetUrl: `${resetPasswordUrl}?email=${passwordResetObject.userEmail}&resetToken=${passwordResetObject.resetToken}`,
      },
    })
    .catch((err) => console.log("error sending password reset email. ", err));
};

exports.sendPasswordSettingLink = async (passwordResetObject) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: emailConfig.username,
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });
  email
    .send({
      template: "passwordSetter",
      message: {
        to: passwordResetObject.userEmail,
      },
      attachments: [
        {
          filename: "brand-logo.jpg",
          path: `${__dirname}/assets/img/brand-logo.jpg`,
          cid: "logo",
        },
      ],
      locals: {
        productName: "RealTuT",
        // passwordResetUrl should be a URL to your app that displays a view where they
        // can enter a new password along with passing the resetToken in the params
        passwordResetUrl: `${resetPasswordUrl}?email=${passwordResetObject.userEmail}&resetToken=${passwordResetObject.resetToken}`,
      },
    })
    .catch((err) => console.log("error sending password reset email. ", err));
};

exports.sendPasswordChangeEmail = async (user) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: emailConfig.username,
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: "passwordChange",
      message: {
        to: user.email,
      },
      locals: {
        productName: "RealTuT",
        name: user.name,
      },
    })
    .catch(() => console.log("error sending change password email"));
};

exports.sendInviteToUser = async (inviteDetails) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: emailConfig.username,
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });
  email
    .send({
      template: "inviteUser",
      message: {
        to: inviteDetails.email,
      },
      attachments: [
        {
          filename: "brand-logo.jpg",
          path: `${__dirname}/assets/img/brand-logo.jpg`,
          cid: "logo",
        },
      ],
      locals: {
        productName: "RealTuT",
        name: inviteDetails.name,
        signUpLink: "https://realtut.com/auth/register",
      },
    })
    .catch((err) => console.log("error sending invite email. ", err));
};

exports.sendEventRegistered = async (event, user) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: emailConfig.username,
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });
  email
    .send({
      template: "eventRegistration",
      message: {
        to: user.email,
      },
      attachments: [
        {
          filename: "brand-logo.jpg",
          path: `${__dirname}/assets/img/brand-logo.jpg`,
          cid: "logo",
        },
      ],
      locals: {
        productName: "RealTuT",
        name: user.name,
        title: event.title,
        webinarLink: encodeURI(
          `https://realtut.com/watch/${event.id}?link=${event.webinarLink}&startTime=${event.dateTime}&isHost=0`
        ),
        dateTime: moment(event.dateTime).format("YYYY-mm-ddTHH:MM:ssZ"),
        dateTimeFormatted: moment(event.dateTime).format("LLLL"),
      },
    })
    .catch((err) =>
      console.log("error sending  event registration  email. ", err)
    );
};

exports.sendCourseRegistered = async (course, user) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: emailConfig.username,
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });
  email
    .send({
      template: "courseRegistration",
      message: {
        to: user.email,
      },
      attachments: [
        {
          filename: "brand-logo.jpg",
          path: `${__dirname}/assets/img/brand-logo.jpg`,
          cid: "logo",
        },
      ],
      locals: {
        productName: "RealTuT",
        name: user.name,
        title: course.title,
        dateTimeFormatted: moment(course.startDate).format("LLLL"),
        courseLink: `https://realtut.com/course/${course._id}`,
      },
    })
    .catch((err) =>
      console.log("error sending  course registration  email. ", err)
    );
};
exports.sendCourseReminder = async (course, participantsList) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: emailConfig.username,
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });
  email
    .send({
      template: "courseReminder",
      message: {
        bcc: participantsList,
      },
      attachments: [
        {
          filename: "brand-logo.jpg",
          path: `${__dirname}/assets/img/brand-logo.jpg`,
          cid: "logo",
        },
      ],
      locals: {
        productName: "RealTuT",
        title: course.title,
        dateTimeFormatted: moment(course.startDate).format("LLLL"),
        courseLink: `https://realtut.com/course/${course._id}`,
      },
    })
    .catch((err) =>
      console.log("error sending  course reminder  email. ", err)
    );
};

exports.sendEventReminder = async (event, participantsList) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: emailConfig.username,
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });
  email
    .send({
      template: "eventReminder",
      message: {
        bcc: participantsList,
      },
      attachments: [
        {
          filename: "brand-logo.jpg",
          path: `${__dirname}/assets/img/brand-logo.jpg`,
          cid: "logo",
        },
      ],
      locals: {
        productName: "RealTuT",
        title: event.title,
        webinarLink: encodeURI(
          `https://realtut.com/watch/${event.id}?link=${event.webinarLink}&startTime=${event.dateTime}&isHost=0`
        ),
        dateTime: moment(event.dateTime).format("YYYY-mm-ddTHH:MM:ssZ"),
        dateTimeFormatted: moment(event.dateTime).format("LLLL"),
      },
    })
    .catch((err) => console.log("error sending  event reminder  email. ", err));
};
