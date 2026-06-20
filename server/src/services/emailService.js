import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function normalizeRecipientList(to) {
  if (!to) return [];
  if (Array.isArray(to)) {
    return to.map((email) => email.trim()).filter(Boolean);
  }
  return to
    .split(/[,;\s]+/)
    .map((email) => email.trim())
    .filter(Boolean);
}

export async function sendQuotationEmail({
  to,
  customerName,
  quotationNumber,
  pdfBuffer
}) {
  const recipients = normalizeRecipientList(to);
  if (recipients.length === 0) {
    throw new Error('No recipient email address provided');
  }

  const result = await resend.emails.send({
    from: 'The Famous Halwai <onboarding@resend.dev>',
    to: recipients,
    subject: `Quotation #${quotationNumber} - Your Order Confirmation`,
    html: `
      <h2>Thank you for your order!</h2>
      <p>Dear ${customerName},</p>
      <p>Please find your quotation attached.</p>
    `,
    attachments: [
      {
        filename: `Quotation_${quotationNumber}.pdf`,
        content: pdfBuffer.toString('base64')
      }
    ]
  });

  console.log('[Resend] Email sent to:', recipients, result);

  return result;
}
export default sendQuotationEmail;