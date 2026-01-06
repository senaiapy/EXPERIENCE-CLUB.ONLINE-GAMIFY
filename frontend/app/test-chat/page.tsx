'use client';

export default function TestChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            🎯 Chat Widget Test Page
          </h1>

          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-3">
                ✅ Chat Widget Features
              </h2>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Click the green WhatsApp button in the bottom-right corner</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Type messages and press Enter to send</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Receive automated responses (development mode)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>See typing indicators when agent is responding</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Close the chat with the X button in the header</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-3">
                ⚙️ Webhook Configuration
              </h2>
              <div className="space-y-3 text-sm">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg font-mono">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Send Endpoint:</p>
                  <code className="text-blue-600 dark:text-blue-400">POST /api/chat/send</code>
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg font-mono">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Receive Endpoint:</p>
                  <code className="text-green-600 dark:text-green-400">POST /api/chat/receive</code>
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg font-mono">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Poll Endpoint:</p>
                  <code className="text-purple-600 dark:text-purple-400">GET /api/chat/receive</code>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-yellow-700 dark:text-yellow-400 mb-3">
                🔧 Environment Variables
              </h2>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <p>Configure these in your <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">.env</code> file:</p>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg font-mono text-xs">
                  <p className="text-green-600">NEXT_PUBLIC_CHAT_WEBHOOK_SEND_URL</p>
                  <p className="text-blue-600">NEXT_PUBLIC_CHAT_WEBHOOK_RECEIVE_URL</p>
                  <p className="text-purple-600">CHAT_WEBHOOK_SECRET</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-500 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-3">
                📚 Documentation
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                For complete integration guide, see:
              </p>
              <code className="bg-gray-800 text-green-400 px-4 py-2 rounded-lg block">
                /frontend/CHAT_WEBHOOK_GUIDE.md
              </code>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-3">
                🚀 Try It Now!
              </h2>
              <p className="text-green-50">
                Look for the green WhatsApp button in the bottom-right corner of this page.
                Click it to start chatting!
              </p>
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/"
            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl p-6 text-center shadow-lg transition-all hover:scale-105"
          >
            <h3 className="font-bold text-gray-800 dark:text-white mb-2">← Home</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Back to homepage</p>
          </a>

          <a
            href="/cart"
            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl p-6 text-center shadow-lg transition-all hover:scale-105"
          >
            <h3 className="font-bold text-gray-800 dark:text-white mb-2">🛒 Cart</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Test cart with chat</p>
          </a>

          <a
            href="/checkout"
            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl p-6 text-center shadow-lg transition-all hover:scale-105"
          >
            <h3 className="font-bold text-gray-800 dark:text-white mb-2">💳 Checkout</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Test checkout with chat</p>
          </a>
        </div>
      </div>
    </div>
  );
}
