import { Resend, type CreateEmailOptions, type Attachment } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string | string[];
  attachments?: EmailAttachment[];
}

export async function sendEmail(mailOptions: EmailOptions) {
  try {
    // Ensure at least one of html or text is provided
    if (!mailOptions.html && !mailOptions.text) {
      throw new Error("Either 'html' or 'text' must be provided");
    }

    const basePayload = {
      from:
        mailOptions.from ||
        process.env.RESEND_FROM_EMAIL ||
        "onboarding@resend.dev",
      to: mailOptions.to,
      subject: mailOptions.subject,
      ...(mailOptions.cc && { cc: mailOptions.cc }),
      ...(mailOptions.bcc && { bcc: mailOptions.bcc }),
      ...(mailOptions.replyTo && { replyTo: mailOptions.replyTo }),
      ...(mailOptions.attachments && {
        attachments: mailOptions.attachments.map((att) => ({
          filename: att.filename,
          content: att.content,
          ...(att.contentType && { contentType: att.contentType }),
        })) as Attachment[],
      }),
    };

    let emailPayload: CreateEmailOptions;

    if (mailOptions.html && mailOptions.text) {
      emailPayload = {
        ...basePayload,
        html: mailOptions.html,
        text: mailOptions.text,
      };
    } else if (mailOptions.html) {
      emailPayload = {
        ...basePayload,
        html: mailOptions.html,
      };
    } else {
      emailPayload = {
        ...basePayload,
        text: mailOptions.text!,
      };
    }

    const result = await resend.emails.send(emailPayload);

    if (result.error) {
      console.error("Email sending failed:", result.error);
      throw new Error(result.error.message);
    }

    console.log("Email sent successfully:", result.data?.id);
    return result;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}
