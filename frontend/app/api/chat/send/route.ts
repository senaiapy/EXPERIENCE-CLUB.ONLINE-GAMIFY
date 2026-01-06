import { NextRequest, NextResponse } from 'next/server';

// This endpoint sends messages to the external webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, timestamp } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get webhook URL from environment variables
    const webhookUrl = process.env.NEXT_PUBLIC_CHAT_WEBHOOK_SEND_URL;

    if (!webhookUrl) {
      console.warn('NEXT_PUBLIC_CHAT_WEBHOOK_SEND_URL not configured');

      // Return a mock response for development
      return NextResponse.json({
        success: true,
        response: 'Gracias por tu mensaje. Un agente se pondrá en contacto contigo pronto. 😊',
        timestamp: new Date().toISOString(),
      });
    }

    // Send message to external webhook
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CHAT_WEBHOOK_SECRET || ''}`,
      },
      body: JSON.stringify({
        message,
        timestamp,
        source: 'clubdeofertas-frontend',
      }),
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook failed with status ${webhookResponse.status}`);
    }

    const webhookData = await webhookResponse.json();

    return NextResponse.json({
      success: true,
      response: webhookData.response || 'Mensaje recibido. Te responderemos pronto.',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in chat send API:', error);

    // Return fallback response
    return NextResponse.json({
      success: true,
      response: 'Gracias por contactarnos. Un agente te responderá pronto.',
      timestamp: new Date().toISOString(),
    });
  }
}
