import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, projectType, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Ulternative Spaces Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO || 'sulternative@gmail.com',
      replyTo: email,
      subject: `New Enquiry — ${projectType || 'General'} — ${name}`,
      html: `
        <div style="font-family: monospace; max-width: 600px; padding: 40px; background: #000; color: #fff;">
          <h2 style="font-size: 20px; font-weight: 700; letter-spacing: 0.1em; margin: 0 0 32px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px;">
            NEW PROJECT ENQUIRY
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; color: rgba(255,255,255,0.5); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; width: 130px;">Name</td><td style="padding: 10px 0; font-size: 14px;">${name}</td></tr>
            <tr><td style="padding: 10px 0; color: rgba(255,255,255,0.5); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">Email</td><td style="padding: 10px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #fff;">${email}</a></td></tr>
            <tr><td style="padding: 10px 0; color: rgba(255,255,255,0.5); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">Project Type</td><td style="padding: 10px 0; font-size: 14px;">${projectType || '—'}</td></tr>
          </table>
          <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: rgba(255,255,255,0.5); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 12px;">Message</p>
            <p style="font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
