import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.password) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      const dataToSend = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      };
      
      console.log('Sending to backend:', dataToSend);

      const response = await authService.register(dataToSend);
      
      console.log('Registration successful:', response);
      navigate('/dashboard');
    } catch (err) {
      console.error('Full error:', err);
      setError(err.response?.data?.message || err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6 sm:p-8">
        <div>
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Create Account 🚀
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join us and start generating reports
          </p>
        </div>

        <form className="mt-6 sm:mt-8 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;