import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_SERVER_HOST!,
	port: 587,
	secure: false,
	auth: {
		user: process.env.EMAIL_SERVER_USER!,
		pass: process.env.EMAIL_SERVER_PASSWORD!,
	},
	tls: {
		rejectUnauthorized: false,
	},
})

export const mailOptions = {
	from: process.env.EMAIL_SERVER_USER!,
}
