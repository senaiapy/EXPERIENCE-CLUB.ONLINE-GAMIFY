'use client';

import { useState, useEffect, useRef } from 'react';
import { getN8nService } from '@/lib/n8n-api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  suggestions?: string[];
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Lazy initialize n8n service (only on client side)
  const getN8nServiceInstance = () => {
    if (typeof window === 'undefined') return null;
    return getN8nService();
  };

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat with welcome message when opened
  useEffect(() => {
    if (isOpen && !isInitialized) {
      // Check if we're in browser before accessing localStorage
      if (typeof window !== 'undefined') {
        // Try to load chat history from localStorage (client-side only)
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
          try {
            const history = JSON.parse(savedHistory);
            setMessages(history.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })));
            setIsInitialized(true);
            return;
          } catch (error) {
            console.error('Error loading chat history:', error);
          }
        }
      }

      // If no history or server-side, send welcome message
      if (messages.length === 0) {
        const welcomeMessage: Message = {
          id: 'welcome',
          text: '¡Hola! 👋 Bienvenido a Experience Club. ¿En qué podemos ayudarte hoy?',
          sender: 'agent',
          timestamp: new Date(),
          suggestions: [
            'Ver productos',
            'Estado de mi pedido',
            'Información de envío',
            'Hablar con un asesor',
          ],
        };
        setMessages([welcomeMessage]);
      }

      setIsInitialized(true);
    }
  }, [isOpen, isInitialized, messages.length]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsSending(true);
    setIsTyping(true);

    try {
      // Get n8n service instance (client-side only)
      const n8nService = getN8nServiceInstance();
      if (!n8nService) {
        throw new Error('n8n service not available');
      }

      // Send message to n8n webhook
      const response = await n8nService.sendMessage(textToSend, {
        previousMessages: messages.slice(-5).map(m => ({
          text: m.text,
          sender: m.sender,
        })),
      });

      // Simulate typing delay
      setTimeout(() => {
        setIsTyping(false);

        const agentMessage: Message = {
          id: response.responseId || (Date.now() + 1).toString(),
          text: response.response,
          sender: 'agent',
          timestamp: new Date(),
          suggestions: response.suggestions,
        };
        setMessages((prev) => [...prev, agentMessage]);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'No pudimos conectar con el servidor. Verifica tu conexión e intenta nuevamente.',
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    // Save chat history to localStorage before closing (client-side only)
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-50 animate-slideUp">
      {/* Chat Container - Full screen on mobile, fixed size on desktop */}
      <div className="bg-white sm:rounded-2xl shadow-2xl w-full h-full sm:w-96 sm:h-[600px] sm:max-h-[80vh] flex flex-col overflow-hidden sm:border-2 sm:border-green-500">
        {/* Header - Mobile optimized with safe area padding */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 sm:p-4 flex items-center justify-between safe-area-inset-top">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Experience Club</h3>
              <p className="text-xs text-green-100 flex items-center">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                En línea
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white/20 active:bg-white/30 rounded-full p-2 transition-colors touch-manipulation"
            aria-label="Cerrar chat"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Container - Mobile optimized scrolling */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 bg-gray-50"
          style={{
            WebkitOverflowScrolling: 'touch',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
          }}
        >
          {messages.map((message) => (
            <div key={message.id}>
              <div
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-md ${
                    message.sender === 'user'
                      ? 'bg-green-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-base sm:text-sm leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
                  <p
                    className={`text-xs mt-1.5 ${
                      message.sender === 'user' ? 'text-green-100' : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('es-PY', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {/* Quick Reply Suggestions - Mobile optimized touch targets */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 ml-2">
                  {message.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      disabled={isSending}
                      className="px-4 py-2.5 bg-white border-2 border-green-500 text-green-600 text-sm font-medium rounded-full hover:bg-green-50 active:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation shadow-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-md">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Mobile optimized with safe area padding */}
        <div className="p-4 bg-white border-t border-gray-200 safe-area-inset-bottom">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-base text-gray-700 placeholder:text-gray-400 touch-manipulation"
                rows={1}
                style={{ maxHeight: '120px' }}
                disabled={isSending}
              />
            </div>
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isSending}
              className="bg-green-500 hover:bg-green-600 active:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full p-3.5 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg touch-manipulation min-w-[56px] min-h-[56px] flex items-center justify-center"
              aria-label="Enviar mensaje"
            >
              {isSending ? (
                <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <p className="hidden sm:block text-xs text-gray-400 mt-2 text-center">
            Presiona Enter para enviar
          </p>
        </div>

        {/* Powered by footer */}
        <div className="bg-gray-100 px-4 py-2 text-center">
          <p className="text-xs text-gray-500">
            Powered by <span className="font-semibold text-green-600">n8n AI</span>
          </p>
        </div>
      </div>
    </div>
  );
}
