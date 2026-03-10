import { NextRequest, NextResponse } from 'next/server';
import { EmailTemplate } from '@/app/components/EmailTemplate';
import { Resend } from 'resend';

type SendEmailBody = {
  to: string;
  subject?: string;
  firstName?: string;
};

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing RESEND_API_KEY' },
        { status: 500 }
      );
    }

    const from = process.env.EMAIL_FROM || 'orders@yourdomain.com';

    const body = (await request.json()) as Partial<SendEmailBody>;
    const to = typeof body.to === 'string' ? body.to.trim() : '';
    const subject = typeof body.subject === 'string' && body.subject.trim() ? body.subject.trim() : 'Hello from DoggDenn';
    const firstName = typeof body.firstName === 'string' && body.firstName.trim() ? body.firstName.trim() : 'there';

    if (!to) {
      return NextResponse.json(
        { error: 'Missing required field: to' },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      react: EmailTemplate({ firstName }),
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}
