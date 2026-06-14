import nodemailer from 'nodemailer';

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;

let transporter = null;

function getTransporter() {
  if (!transporter && EMAIL_USER && EMAIL_APP_PASSWORD) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_APP_PASSWORD
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      family: 4
    });

    transporter.verify((err) => {
      if (err) {
        console.error('[Email] SMTP Verify Error:', err);
      } else {
        console.log('[Email] SMTP Ready');
      }
    });
  }

  return transporter;
}

export async function sendQuotationEmail({ to, customerName, quotationNumber, pdfBuffer }) {
  const transport = getTransporter();
  
  if (!transport) {
    console.error('[Email] Transporter not configured. EMAIL_USER:', !!EMAIL_USER, 'EMAIL_APP_PASSWORD:', !!EMAIL_APP_PASSWORD);
    throw new Error('Email service not configured. Set EMAIL_USER and EMAIL_APP_PASSWORD in environment.');
  }

  const mailOptions = {
    from: `"The Famous Halwai" <${EMAIL_USER}>`,
    to: to,
    subject: `Quotation #${quotationNumber} - Your Order Confirmation`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank you for your order!</h2>
        <p>Dear ${customerName},</p>
        <p>We have received your order request. Please find your quotation attached to this email.</p>
        <p><strong>Quotation #: ${quotationNumber}</strong></p>
        <p>Our team will contact you shortly to confirm the details.</p>
        <br>
        <p>Best regards,<br>The Famous Halwai Team</p>
      </div>
    `,
    attachments: [
      {
        filename: `Quotation_${quotationNumber}.pdf`,
        content: Buffer.from(pdfBuffer),
        contentType: 'application/pdf'
      }
    ]
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log(`[Email] Quotation sent to ${to}, Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[Email] Failed to send quotation to ${to}:`, err.message);
    throw err;
  }
}

export default sendQuotationEmail;