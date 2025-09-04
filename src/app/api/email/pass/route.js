import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
    console.log("API hit");
  try {
    const { recipient,password } = await req.json();
    if (!recipient) {
      return NextResponse.json({ error: "Recipient email is required" }, { status: 400 });
    }

    // Generate random password

    // Configure SMTP transport
    const transporter = nodemailer.createTransport({
      host: "hackclub.app",
      port: 587,
      secure: false, // must be false for STARTTLS
      auth: {
        user: "niyogi",
        pass: "niyosan42",
      },
      tls: {
        rejectUnauthorized: false, // allows self-signed certs if needed
      },
    });

    // Send mail
    const info = await transporter.sendMail({
      from: '"Niyogi" <niyogi@hackclub.app>',
      to: recipient,
      subject: "Welcome to Nest!",
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to StepUp!</title>
  <style>
    body {
      background: #f6f8fa;
      font-family: 'Segoe UI', Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 540px;
      margin: 40px auto;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      padding: 32px 36px;
    }
    .header {
      text-align: center;
      padding-bottom: 18px;
      border-bottom: 1px solid #eaeaea;
    }
    .header img {
      width: 52px;
      margin-bottom: 8px;
    }
    .header h1 {
      font-size: 28px;
      margin: 0;
      color: #3754db;
      letter-spacing: 1px;
    }
    .greeting {
      margin-top: 28px;
      font-size: 18px;
      color: #23272f;
    }
    .content {
      margin-top: 22px;
      font-size: 16px;
      color: #3c405a;
      line-height: 1.7;
    }
    .password-box {
      margin: 32px auto 18px;
      background: #f2f6fc;
      border: 1px dashed #3754db;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      color: #3754db;
      letter-spacing: 1.5px;
      width: 80%;
    }
    .footer {
      margin-top: 30px;
      font-size: 15px;
      color: #6d7a88;
      text-align: right;
    }
    .footer strong {
      color: #3754db;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img style="width:10vw;" src="https://raw.githubusercontent.com/hello-lab/datasprint1/refs/heads/main/public/logo.png" alt="StepUp Logo" />
      <h1>Welcome to StepUp!</h1>
    </div>
    <div class="greeting">
      Hello <strong>${recipient}</strong>,
    </div>
    <div class="content">
      We're thrilled to have you join our community.<br>
      Your account has been <strong>created successfully</strong>.<br><br>
      To get started, you’ll need your password:
    </div>
    <div class="password-box">
      ${password}
    </div>
   
    <div class="footer">
      Best regards,<br>
      <strong>StepUp Team</strong>
    </div>
  </div>
</body>
</html>`,
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      password,
      messageId: info.messageId,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
