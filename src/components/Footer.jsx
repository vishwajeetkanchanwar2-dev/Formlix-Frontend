import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !message) {
      setStatus('Please fill all fields');
      return;
    }

    setSending(true);
    setStatus('');

    try {
      const response = await api.post('/contact/send', { 
        email, 
        message 
      });
      
      setStatus(response.data.message || '✅ Message sent successfully!');
      setEmail('');
      setMessage('');
      
      setTimeout(() => setStatus(''), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus(error.response?.data?.message || '❌ Failed to send. Please try again.');
      
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center flex-shrink-0">
                <svg 
                  className="w-6 h-6 text-blue-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2.5} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              </div>
              <span className="text-xl sm:text-2xl font-bold">Formlix</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pr-0 sm:pr-4">
              Your intelligent AI-powered report generation platform. Create professional reports in seconds.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-blue-300">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition text-sm">
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link to="/generate-report" className="text-gray-300 hover:text-white transition text-sm">
                  📝 Generate Report
                </Link>
              </li>
              <li>
                <Link to="/generate-from-content" className="text-gray-300 hover:text-white transition text-sm">
                  📄 From Content
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-gray-300 hover:text-white transition text-sm">
                  💬 Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-purple-300">Features</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start">
                <span className="mr-2 flex-shrink-0">⚡</span>
                <span>AI-Powered Generation</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex-shrink-0">📊</span>
                <span>Professional Formatting</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex-shrink-0">💾</span>
                <span>Export to DOCX/PDF</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex-shrink-0">🔒</span>
                <span>Secure & Private</span>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-pink-300">Connect With Us</h3>
            
            <p className="text-gray-300 text-sm flex items-start mb-4 break-all">
              <span className="mr-2 flex-shrink-0">📧</span>
              <span>formlix5@gmail.com</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
                disabled={sending}
              />
              
              <textarea
                placeholder="Share your problems or suggestions..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                required
                disabled={sending}
              />
              
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-md text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
              
              {status && (
                <div className={`text-xs p-2 rounded break-words ${
                  status.includes('✅') 
                    ? 'bg-green-900/50 text-green-400 border border-green-700' 
                    : 'bg-red-900/50 text-red-400 border border-red-700'
                }`}>
                  {status}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
            © {currentYear} Formlix. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition">
              Cookie Policy
            </a>
          </div>
        </div>

        {/* Made with love */}
        <div className="text-center mt-4 sm:mt-6">
          <p className="text-gray-500 text-xs sm:text-sm">
            Made with <span className="text-red-500 animate-pulse">❤️</span> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;