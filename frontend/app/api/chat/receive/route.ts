import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes
// In production, use Redis, database, or other persistent storage
let messageQueue: any[] = [];

// This endpoint receives messages from external webhooks (webhook receiver)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, timestamp, sender } = body;

    // Verify webhook secret if configured
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.CHAT_WEBHOOK_SECRET;

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Add message to queue
    messageQueue.push({
      id: Date.now().toString(),
      text: message,
      timestamp: timestamp || new Date().toISOString(),
      sender: sender || 'agent',
    });

    // Keep only last 50 messages in queue
    if (messageQueue.length > 50) {
      messageQueue = messageQueue.slice(-50);
    }

    return NextResponse.json({
      success: true,
      message: 'Message received',
    });

  } catch (error) {
    console.error('Error in chat receive webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

// This endpoint allows the frontend to poll for new messages
export async function GET(request: NextRequest) {
  try {
    // Get session ID from query params or headers to filter messages
    const sessionId = request.nextUrl.searchParams.get('session');

    // Return messages from queue
    const messages = [...messageQueue];

    // Clear the queue after reading
    messageQueue = [];

    return NextResponse.json({
      messages,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in chat receive API:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve messages' },
      { status: 500 }
    );
  }
}
