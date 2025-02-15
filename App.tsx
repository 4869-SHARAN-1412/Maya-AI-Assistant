import React, { useState } from 'react';
import { Send, Bot, User, Moon, Sun, Sparkles } from 'lucide-react';

interface Message {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  latency?: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your personal AI assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: messages[messages.length - 1].sender === 'ai' 
            ? messages[messages.length - 1].content 
            : '',
          user_input: input,
        }),
      });

      const data = await response.json();
      console.log(data);
      
      const aiMessage: Message = {
        content: data.response,
        sender: 'ai',
        timestamp: new Date(),
        latency: data.latency,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        content: "I apologize, but I'm having trouble connecting to the server. Please try again later.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-64 p-4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col">
          <div className="flex items-center gap-2 px-2 py-3">
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-lg font-bold text-gray-800 dark:text-white">AI Assistant</h1>
          </div>
          
          <nav className="mt-8 flex-1">
            <div className="px-2">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </nav>
          
          <div className="mt-auto p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Bot className="w-4 h-4" />
              <span>AI Assistant v1.0</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Personal AI Assistant</h1>
                </div>
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </header>

          {/* Chat Container */}
          <main className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 flex items-center justify-center shadow-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 text-white'
                        : 'bg-white dark:bg-gray-800 dark:text-white border border-gray-100 dark:border-gray-700'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className="flex justify-between items-center mt-1 text-xs opacity-70">
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      {message.latency && (
                        <span className="ml-2">Latency: {message.latency}</span>
                      )}
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 flex items-center justify-center shadow-lg animate-pulse">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm bg-white dark:bg-gray-800 dark:text-white border border-gray-100 dark:border-gray-700">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Input Form */}
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 text-white rounded-xl px-6 py-3 flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
