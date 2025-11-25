import { useState, useEffect } from 'react';
import authService from '../services/authService';
import api from '../services/api';

const Feedback = () => {
  const [formData, setFormData] = useState({
    message: '',
    rating: 5,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoadStatus, setUserLoadStatus] = useState('loading');

  // ✅ LOAD USER FROM AUTHSERVICE
  useEffect(() => {
    const loadUser = () => {
      try {
        setUserLoadStatus('loading');
        
        // ✅ GET USER FROM AUTHSERVICE
        const user = authService.getCurrentUser();
        const userId = authService.getUserId();
        
        console.log('👤 Loading user from authService...');
        console.log('   User object:', user);
        console.log('   User ID:', userId);
        
        if (userId && user) {
          setCurrentUser({
            id: userId,
            name: user.username || user.name || `User ${userId}`,
            email: user.email,
          });
          setUserLoadStatus('success');
          console.log('✅ User loaded successfully:', { id: userId, name: user.username });
        } else {
          console.error('❌ No user found');
          setError('Please login to submit feedback');
          setUserLoadStatus('error');
        }
      } catch (err) {
        console.error('❌ Error loading user:', err);
        setError('Failed to load user data. Please login again.');
        setUserLoadStatus('error');
      }
    };

    loadUser();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser || !currentUser.id) {
      setError('Unable to identify user. Please login again.');
      return;
    }

    if (!formData.message.trim()) {
      setError('Please enter your feedback message');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        userId: currentUser.id,
        message: formData.message.trim(),
        rating: formData.rating,
      };
      
      console.log('📤 Submitting feedback:', payload);

      // ✅ USE API INSTANCE (AUTOMATICALLY ADDS TOKEN)
      const response = await api.post('/feedback/create', payload);

      console.log('✅ Feedback saved successfully:', response.data);
      setSuccess('Thank you for your feedback! 🎉');
      setFormData({ message: '', rating: 5 });
      
      // Auto-clear success message
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('❌ Feedback submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              💬 Share Your Feedback
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              We'd love to hear about your experience
            </p>
           
          </div>

          <div className="space-y-5 sm:space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded">
                <p className="font-medium">❌ Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded animate-pulse">
                <p className="font-medium">✅ Success</p>
                <p className="text-sm">{success}</p>
              </div>
            )}

            {userLoadStatus === 'loading' && (
              <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 px-3 sm:px-4 py-2 sm:py-3 rounded">
                <p className="text-sm">⏳ Loading user data...</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="text-3xl sm:text-4xl focus:outline-none transition-transform hover:scale-110 active:scale-95"
                  >
                    {star <= formData.rating ? '⭐' : '☆'}
                  </button>
                ))}
                <span className="ml-2 text-gray-600 font-medium text-sm sm:text-base">
                  {formData.rating}/5
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Your Feedback *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows="6"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Tell us what you think..."
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !currentUser || userLoadStatus === 'loading'}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-md hover:from-green-700 hover:to-blue-700 font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Submitting...
                </span>
              ) : userLoadStatus === 'loading' ? 'Loading User...' : 'Submit Feedback'}
            </button>
          </div>

          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Why Your Feedback Matters
            </h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-600">
              <li className="flex items-start">
                <span className="mr-2 flex-shrink-0">✅</span>
                <span>Helps us improve our services</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex-shrink-0">✅</span>
                <span>Shapes future features</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex-shrink-0">✅</span>
                <span>Enhances user experience</span>
              </li>
            </ul>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default Feedback;
