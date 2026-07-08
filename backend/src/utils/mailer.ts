import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, 
    },
});

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
    await transporter.sendMail({
        from: `"Job Portal" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Verify your email",
        html: `<p>Your verification OTP is <b>${otp}</b>. It expires in 3 minutes.</p>`,
    });
};