import { ReceiptEmailHtml } from '@/components/emails/receipt-email'
import { VerificationEmailHtml } from '@/components/emails/verification-code-email'
import { transporter } from '@/config/nodemailer'

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
	await transporter.sendMail({
		from: process.env.EMAIL_FROM,
		to: email,
		subject: '2FA Code',
		html: `<p>Your 2FA code: ${token} </p>`,
	})
}

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `${process.env.BASE_URL}/auth/new-verification?token=${token}`

	await transporter.sendMail({
		from: process.env.EMAIL_FROM,
		to: email,
		subject: 'Confirm your email',
		html: `<p>Click <a href="${confirmLink}">here</a> to confirm email. </p>`,
	})
}
export const sendPasswordResetEmail = async (email: string, token: string) => {
	const resetLink = `${process.env.BASE_URL}/auth/new-password?token=${token}`

	await transporter.sendMail({
		from: process.env.EMAIL_FROM,
		to: email,
		subject: 'Reset your password',
		html: `<p>Click <a href="${resetLink}">here</a> to reset your password. </p>`,
	})
}
