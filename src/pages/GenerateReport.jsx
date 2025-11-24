import { useState } from 'react';
import api from '../services/api';

const GenerateReport = () => {
  const [formData, setFormData] = useState({
    topic: '',
    formatType: 'docx',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const downloadFile = async (filename) => {
    try {
      const response = await api.get(`/reports/download/${filename}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setMessage('Report downloaded successfully! ✅');
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download file. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await api.post('/reports/generate', formData);
      const result = response.data;
      
      console.log('Backend Response:', result);
      
      setMessage('Report generated successfully! Preparing download...');
      
      if (result.includes('Report generated:')) {
        const filename = result.split('reports/')[1];
        console.log('Extracted filename:', filename);
        
        if (filename) {
          setTimeout(() => {
            downloadFile(filename);
          }, 500);
        } else {
          setError('Could not extract filename from response');
        }
      } else {
        setMessage(result);
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.response?.data || 'Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              📝 Generate Report from Topic
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Enter a topic and we'll generate a comprehensive report for you
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm break-words">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-400 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm break-words">
                {message}
              </div>
            )}

            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Report Topic *
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                required
                value={formData.topic}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Artificial Intelligence in Healthcare"
              />
            </div>

            <div>
              <label htmlFor="formatType" className="block text-sm font-medium text-gray-700 mb-2">
                Format Type
              </label>
              <select
                id="formatType"
                name="formatType"
                value={formData.formatType}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="docx">DOCX (Word Document)</option>
                <option value="pdf">PDF</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 sm:py-3 px-4 rounded-md hover:from-blue-700 hover:to-purple-700 font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating Report...
                </span>
              ) : (
                'Generate & Download Report'
              )}
            </button>
          </form>

          <div className="mt-5 sm:mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">💡 Tips:</h3>
            <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
              <li>• Be specific with your topic for better results</li>
              <li>• Report will be automatically downloaded after generation</li>
              <li>• Default page limit is set in backend configuration</li>
              <li>• Check your Downloads folder for the file</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;