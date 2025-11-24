import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import api from '../services/api';

const Dashboard = () => {
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReports: 0,
    totalFeedbacks: 0,
    averageRating: 0,
    totalUsers: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, feedbackResponse] = await Promise.all([
        api.get('/stats/all'),
        api.get('/feedback/all')
      ]);

      const feedbackData = feedbackResponse.data;
      
      let averageRating = 0;
      if (feedbackData.length > 0) {
        const totalRating = feedbackData.reduce((sum, feedback) => sum + feedback.rating, 0);
        averageRating = (totalRating / feedbackData.length).toFixed(1);
      }

      // Debug: Backend se kya aa raha hai dekho
      console.log('📊 Stats from backend:', statsResponse.data);
      
      setStats({
        totalReports: statsResponse.data.totalReports || 0,
        totalFeedbacks: feedbackData.length,
        averageRating: averageRating,
        totalUsers: statsResponse.data.totalUsers || 0
      });

      setFeedbacks(feedbackData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setFeedbacks([]);
      setStats({
        totalReports: 0,
        totalFeedbacks: 0,
        averageRating: 0,
        totalUsers: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const features = [
    {
      title: 'Generate from Topic',
      description: 'Generate comprehensive reports from any topic using AI',
      icon: '📝',
      link: '/generate-report',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Generate from Content',
      description: 'Convert your existing content into professional reports',
      icon: '📄',
      link: '/generate-from-content',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Welcome to Formlix! 📄
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-blue-100 px-4">
              Your Intelligent Report Generation Platform
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-blue-50 transition transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-blue-800 transition transform hover:scale-105 border-2 border-white shadow-lg"
                >
                  Login
                </Link>
              </div>
            )}
            {isAuthenticated && (
              <p className="text-xl sm:text-2xl font-semibold px-4">
                Welcome back, <span className="text-yellow-300">{user?.username}</span>! 👋
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-blue-100 text-xs sm:text-sm font-medium mb-2">Total Reports Generated</p>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold truncate">{stats.totalReports}</p>
                <p className="text-blue-100 text-xs sm:text-sm mt-2">
                  {isAuthenticated ? 'Your reports' : 'By all users'}
                </p>
              </div>
              <div className="text-4xl sm:text-5xl lg:text-6xl opacity-80 ml-4">📊</div>
            </div>
          </div>  

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-purple-100 text-xs sm:text-sm font-medium mb-2">Average User Rating</p>
                <div className="flex items-baseline">
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-bold">{stats.averageRating || '0.0'}</p>
                  <p className="text-xl sm:text-2xl font-semibold ml-2 text-purple-200">/5</p>
                </div>
                <p className="text-purple-100 text-xs sm:text-sm mt-2">
                  Based on {stats.totalFeedbacks} {stats.totalFeedbacks === 1 ? 'review' : 'reviews'}
                </p>
              </div>
              <div className="text-4xl sm:text-5xl lg:text-6xl opacity-80 ml-4">⭐</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6 sm:p-8 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-green-100 text-xs sm:text-sm font-medium mb-2">Total Users</p>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold truncate">{stats.totalUsers}</p>
                <p className="text-green-100 text-xs sm:text-sm mt-2">
                  Registered members
                </p>
              </div>
              <div className="text-4xl sm:text-5xl lg:text-6xl opacity-80 ml-4">👥</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 text-center px-4">
            Our Features
          </h2>
          <p className="text-gray-600 text-center text-base sm:text-lg mb-8 sm:mb-10 px-4">
            {isAuthenticated 
              ? 'Choose a feature to get started' 
              : 'Login to access these amazing features'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="bg-white rounded-xl shadow-lg p-6 sm:p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mb-4 sm:mb-6 shadow-md`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-base sm:text-lg">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Why Choose Section */}
        {!isAuthenticated && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Why Choose Formlix?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🚀</div>
                <h4 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3">Lightning Fast</h4>
                <p className="text-sm sm:text-base text-gray-600">Generate professional reports in seconds with AI power</p>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🎨</div>
                <h4 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3">Professional Format</h4>
                <p className="text-sm sm:text-base text-gray-600">Export in DOCX or PDF with beautiful formatting</p>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">💡</div>
                <h4 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3">AI Powered</h4>
                <p className="text-sm sm:text-base text-gray-600">Intelligent content generation and structuring</p>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Section */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-10 px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
              What Our Users Say 💬
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Real feedback from real users
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4 text-sm sm:text-base">Loading feedbacks...</p>
            </div>
          ) : feedbacks.filter(f => f.user?.name).length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {feedbacks
                  .filter(feedback => feedback.user?.name)
                  .slice(0, 6)
                  .map((feedback, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-lg p-5 sm:p-6 hover:shadow-xl transition-all"
                    >
                      <div className="flex items-center mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                          {feedback.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3 min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                            {feedback.user.name}
                          </p>
                          <p className="text-yellow-500 text-base sm:text-lg">
                            {renderStars(feedback.rating)}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base break-words">
                        "{feedback.message}"
                      </p>
                    </div>
                  ))}
              </div>

              {isAuthenticated && (
                <div className="text-center mt-6 sm:mt-8">
                  <Link
                    to="/feedback"
                    className="inline-block bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:from-green-700 hover:to-blue-700 transition transform hover:scale-105 shadow-lg"
                  >
                    Share Your Feedback ✍️
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
              <div className="text-5xl sm:text-6xl mb-4">💬</div>
              <p className="text-gray-600 text-base sm:text-lg mb-6 px-4">
                No feedback yet. Be the first to share your experience!
              </p>
              {isAuthenticated && (
                <Link
                  to="/feedback"
                  className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:from-blue-700 hover:to-purple-700 transition"
                >
                  Share Your Feedback
                </Link>
              )}
            </div>
          )}
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-2xl p-8 sm:p-12 text-center text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 px-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-blue-100 px-4">
              Join thousands of users generating professional reports
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-blue-600 px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-blue-50 transition transform hover:scale-105 shadow-lg"
            >
              Create Free Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;