import { useState } from 'react';
import api from '../services/api';

const Feedback = () => {
  const [formData, setFormData] = useState({
    userId: 1,
    message: '',
    rating: 5,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/feedback/create', formData);
      setSuccess('Thank you for your feedback! 🎉');
      setFormData({ ...formData, message: '' });
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
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

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-400 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm">
                {success}
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
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-md hover:from-green-700 hover:to-blue-700 font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>

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