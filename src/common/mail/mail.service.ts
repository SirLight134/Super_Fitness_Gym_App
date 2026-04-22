import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: `"Super Fitness" <${process.env.MAIL_FROM}>`,
        to,
        subject,
        html,
      });

      return { message: 'Email sent successfully' };
    } catch (error) {
      console.error('Email sending error:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async sendOtpEmail(to: string, otp: string) {
    const html = `
                <div
                    style="
                        margin: 0;
                        margin-top: 70px;
                        padding: 92px 30px 115px;
                        background: #ffffff;
                        border-radius: 30px;
                        text-align: center;
                    "
                    >
                    <div style="width: 100%; max-width: 489px; margin: 0 auto;">
                        <h1
                        style="
                            margin: 0;
                            font-size: 24px;
                            font-weight: 500;
                            color: #1f1f1f;
                        "
                        >
                        Your OTP
                        </h1>
                        <p
                        style="
                            margin: 0;
                            margin-top: 17px;
                            font-weight: 500;
                            letter-spacing: 0.56px;
                        "
                        >
                        Thank you for choosing Super Fitness App. Use the following OTP
                        to complete the procedure to change your email address. OTP is
                        valid for
                        <span style="font-weight: 600; color: #1f1f1f;">5 minutes</span>.
                        Do not share this code with others.
                        </p>
                        <p
                        style="
                            margin: 0;
                            margin-top: 60px;
                            font-size: 40px;
                            font-weight: 600;
                            letter-spacing: 25px;
                            color: #ba3d4f;
                        "
                        >
                        ${otp}
                        </p>
                    </div>
                    </div>
    `;

    return this.sendMail(to, 'Your Verification Code', html);
  }
}
