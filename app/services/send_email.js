const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');


/**
 * SEND REGISTRATION EMAIL
 * @param user
 * @returns {Promise<void>}
 */
exports.sendRegistrationEmailMessage = async user => {
	const subject = 'ایمیل خود را در تورآسو تایید کنید';
	const htmlMessage = `<p>سلام ${
		user.name
	}.</p> <p>خوش آمدید! برای تایید ایمیل خود بر روی این لینک کلیک کنید:</p> <p>${
		process.env.FRONTEND_URL
	}/auth/verify/${user.verification}</p> <p>با تشکر.</p>`;
	const data = {
		user,
		subject,
		htmlMessage
	};
	const email = {
		subject,
		htmlMessage,
		verification: user.verification
	};
	sendEmail(data, messageSent =>
		messageSent
			? console.log(`Email SENT to: ${user.email}`)
			: console.log(`Email FAILED to: ${user.email}`)
	);

	console.log('VERIFICATION_PARAM:'+user.verification);

};

/**
 * SEND RESET PASSWORD EMAIL
 * @param user
 * @returns {Promise<void>}
 */
exports.sendResetPasswordEmailMessage = async user => {
	const subject = 'باز یابی رمز عبور';
	const htmlMessage = `<p>برای بازیابی رمز عبور : ${
		user.email
	}</p> <p>بر روی لینک زیر کلیک کنید</p> <p>${process.env.FRONTEND_URL}/auth/reset/${
		user.verification
	}</p> <p>اگر اشتباهی رخ داده این ایمیل را نادیده بگیرید</p> <p>باتشکر.</p>`;
	const data = {
		user,
		subject,
		htmlMessage
	};
	const email = {
		subject,
		htmlMessage,
		verification: user.verification
	};
	sendEmail(data, messageSent =>
		messageSent
			? console.log(`Email SENT to: ${user.email}`)
			: console.log(`Email FAILED to: ${user.email}`)
	);
	console.log(user.verification);
};

/**
 * SEND EMAIL
 * @param data
 * @param callback
 * @returns {Promise<void>}
 */
const sendEmail = async (data, callback) => {

	const transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: process.env.EMAIL_FROM_ADDRESS,
			pass: process.env.EMAIL_PASS
		}
	});
	const mailOptions = {
		from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
		to: `${data.user.name} <${data.user.email}>`,
		subject: data.subject,
		html: data.htmlMessage
	};
	// transporter.sendMail(mailOptions, err => {
	// 	if (err) {
	// 		console.log('ERR IS: '+err);
	// 		return callback(false);
	// 	}
	// 	return callback(true);
	// });
};