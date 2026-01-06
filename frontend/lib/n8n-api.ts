/**
 * n8n Webhook API Service
 * Handles communication with n8n workflows for chatbot functionality
 */

interface ChatMessage {
  message: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  context?: {
    page?: string;
    userAgent?: string;
    [key: string]: any;
  };
}

interface ChatResponse {
  response: string;
  responseId?: string;
  suggestions?: string[];
  actions?: Array<{
    type: string;
    label: string;
    data: any;
  }>;
}

interface N8nConfig {
  webhookUrl: string;
  webhookId?: string;
  timeout?: number;
}

class N8nChatService {
  private config: N8nConfig;
  private sessionId: string;

  constructor(config: N8nConfig) {
    this.config = {
      timeout: 30000, // 30 seconds default
      ...config,
    };
    this.sessionId = this.generateSessionId();
  }

  /**
   * Generate a unique session ID for tracking conversations
   */
  private generateSessionId(): string {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      // Server-side: generate temporary session
      return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }

    // Client-side: use localStorage
    const existingSession = localStorage.getItem('n8n_session_id');
    if (existingSession) {
      return existingSession;
    }

    const newSession = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('n8n_session_id', newSession);
    return newSession;
  }

  /**
   * Get user ID from auth or generate anonymous ID
   */
  private getUserId(): string {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return 'anonymous';
    }

    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.id || userData.email || 'anonymous';
      } catch {
        return 'anonymous';
      }
    }
    return 'anonymous';
  }

  /**
   * Send message to n8n webhook and get response
   */
  async sendMessage(message: string, additionalContext?: Record<string, any>): Promise<ChatResponse> {
    const payload: ChatMessage = {
      message: message.trim(),
      timestamp: new Date().toISOString(),
      userId: this.getUserId(),
      sessionId: this.sessionId,
      context: {
        page: typeof window !== 'undefined' ? window.location.pathname : '/',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
        ...additionalContext,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle different n8n response formats
      return this.normalizeResponse(data);
    } catch (error) {
      console.error('Error sending message to n8n:', error);

      // Return graceful error response
      return {
        response: 'Lo sentimos, estamos experimentando problemas técnicos. Por favor, intenta nuevamente en unos momentos.',
        responseId: 'error',
      };
    }
  }

  /**
   * Normalize different n8n response formats
   */
  private normalizeResponse(data: any): ChatResponse {
    // If response is directly in data
    if (typeof data === 'string') {
      return { response: data };
    }

    // If response is in a response field
    if (data.response) {
      return {
        response: data.response,
        responseId: data.responseId || data.id,
        suggestions: data.suggestions,
        actions: data.actions,
      };
    }

    // If response is in a message field
    if (data.message) {
      return {
        response: data.message,
        responseId: data.id,
      };
    }

    // If response is in output field (common n8n format)
    if (data.output) {
      return {
        response: data.output,
        responseId: data.id,
      };
    }

    // Fallback
    return {
      response: 'Recibimos tu mensaje. ¿En qué más puedo ayudarte?',
    };
  }

  /**
   * Send feedback about a response
   */
  async sendFeedback(messageId: string, rating: 'positive' | 'negative', comment?: string): Promise<boolean> {
    try {
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'feedback',
          messageId,
          rating,
          comment,
          sessionId: this.sessionId,
          userId: this.getUserId(),
          timestamp: new Date().toISOString(),
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending feedback:', error);
      return false;
    }
  }

  /**
   * Clear session (for logout or reset)
   */
  clearSession(): void {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      localStorage.removeItem('n8n_session_id');
    }
    this.sessionId = this.generateSessionId();
  }
}

// Export singleton instance
let n8nService: N8nChatService | null = null;

export function getN8nService(): N8nChatService {
  if (!n8nService) {
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/chat';
    n8nService = new N8nChatService({ webhookUrl });
  }
  return n8nService;
}

export type { ChatMessage, ChatResponse, N8nConfig };
export default N8nChatService;
