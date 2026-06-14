import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendQuotationEmail({
  to,
  customerName,
  quotationNumber,
  pdfBuffer
}) {
  const result = await resend.emails.send({
    from: 'The Famous Halwai <onboarding@resend.dev>',
    to,
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

  console.log('[Resend] Email sent:', result);

  return result;
}
export default sendQuotationEmail;