import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();

  const name    = form.get('name')?.toString().trim()    ?? '';
  const email   = form.get('email')?.toString().trim()   ?? '';
  const phone   = form.get('phone')?.toString().trim()   ?? '';
  const subject = form.get('subject')?.toString().trim() ?? '';
  const message = form.get('message')?.toString().trim() ?? '';

  if (!name || !email || !subject || !message) {
    return new Response(
      JSON.stringify({ error: 'Please fill in all required fields.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from:    'Satya Shastra Website <onboarding@resend.dev>',
    to:      'contact@satyashastra.com',
    replyTo: email,
    subject: `New Enquiry: ${subject}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:#1a1a1a;padding:24px 32px">
          <h1 style="color:#fff;margin:0;font-size:20px;letter-spacing:1px">SATYA SHASTRA</h1>
          <p style="color:#aaa;margin:4px 0 0;font-size:12px">New Website Enquiry</p>
        </div>
        <div style="padding:32px;border:1px solid #e0e0e0;border-top:none">
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f2f2f2;width:120px;color:#888;font-size:13px;vertical-align:top">Name</td>
              <td style="padding:10px 0;border-bottom:1px solid #f2f2f2;font-size:14px;font-weight:600">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f2f2f2;color:#888;font-size:13px;vertical-align:top">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid #f2f2f2;font-size:14px"><a href="mailto:${email}" style="color:#1a1a1a">${email}</a></td>
            </tr>
            ${phone ? `<tr>
              <td style="padding:10px 0;border-bottom:1px solid #f2f2f2;color:#888;font-size:13px;vertical-align:top">Phone</td>
              <td style="padding:10px 0;border-bottom:1px solid #f2f2f2;font-size:14px">${phone}</td>
            </tr>` : ''}
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f2f2f2;color:#888;font-size:13px;vertical-align:top">Subject</td>
              <td style="padding:10px 0;border-bottom:1px solid #f2f2f2;font-size:14px">${subject}</td>
            </tr>
            <tr>
              <td style="padding:16px 0 0;color:#888;font-size:13px;vertical-align:top">Message</td>
              <td style="padding:16px 0 0;font-size:14px;line-height:1.6">${message.replace(/\n/g, '<br>')}</td>
            </tr>
          </table>
        </div>
        <div style="padding:16px 32px;background:#f7f7f7;font-size:11px;color:#aaa;text-align:center">
          Sent from the contact form at satyashastra.com
        </div>
      </div>
    `,
  });

  if (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to send message. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
};
