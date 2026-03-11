import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;
    private readonly logger = new Logger(MailService.name);

    constructor(private config: ConfigService) {
        // Cấu hình nodemailer (Sử dụng Gmail hoặc SMTP khác)
        // Nếu không có cấu hình SMTP trong .env, nó sẽ log ra console để test
        const host = this.config.get('MAIL_HOST');
        const user = this.config.get('MAIL_USER');
        const pass = this.config.get('MAIL_PASS');

        if (host && user && pass) {
            this.transporter = nodemailer.createTransport({
                host: host,
                port: this.config.get('MAIL_PORT', 587),
                secure: false, // true for 465, false for other ports
                auth: { user, pass },
            });
            this.logger.log('MailService initialized with SMTP');
        } else {
            this.logger.warn('SMTP not configured. Emails will be logged to console.');
        }
    }

    async sendResetPasswordEmail(email: string, token: string) {
        const resetLink = `${this.config.get('FRONTEND_URL', 'http://localhost:3000')}/auth/reset-password?token=${token}`;
        const subject = '[MotoShop] Đặt lại mật khẩu của bạn';
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #e63946; text-align: center;">MotoShop Elite</h2>
                <p>Xin chào,</p>
                <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                <p>Vui lòng nhấn vào nút bên dưới để tiến hành đặt lại mật khẩu. Liên kết này có hiệu lực trong 1 giờ.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #e63946; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Đặt lại mật khẩu</a>
                </div>
                <p>Nếu bạn không yêu cầu điều này, bạn có thể bỏ qua email này.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #777; text-align: center;">Đây là email tự động, vui lòng không trả lời.</p>
            </div>
        `;

        if (this.transporter) {
            try {
                await this.transporter.sendMail({
                    from: '"MotoShop" <no-reply@motoshop.com>',
                    to: email,
                    subject,
                    html,
                });
                this.logger.log(`Reset email sent to ${email}`);
            } catch (error) {
                this.logger.error(`Failed to send email to ${email}`, error.stack);
                throw error;
            }
        } else {
            console.log('-------------------------------------------');
            console.log(`To: ${email}`);
            console.log(`Subject: ${subject}`);
            console.log(`Reset Link: ${resetLink}`);
            console.log('-------------------------------------------');
        }
    }
}
