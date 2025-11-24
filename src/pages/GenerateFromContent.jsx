import { useState } from 'react';
import api from '../services/api';

const GenerateFromContent = () => {
  const [formData, setFormData] = useState({
    topic: '',
    content: '',
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
      console.log('📤 Sending data:', formData);
      
      const response = await api.post('/reports/generate-from-text', formData);
      const result = response.data;
      
      console.log('📨 Backend Response:', result);
      
      setMessage('Report generated successfully! Preparing download...');
      
      if (result.includes('Report generated:')) {
        const filename = result.split('reports/')[1];
        console.log('📄 Extracted filename:', filename);
        
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
      console.error('❌ Generation error:', err);
      setError(err.response?.data || 'Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              📄 Generate Report from Content
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Paste your content and we'll convert it into a professional report
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
                Report Title *
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                required
                value={formData.topic}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g., Spring Boot Framework"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows="10"
                value={formData.content}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-y"
                placeholder="Paste your content here..."
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Characters: {formData.content.length}
              </p>
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
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="docx">DOCX (Word Document)</option>
                <option value="pdf">PDF (Portable Document)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-md hover:from-purple-700 hover:to-blue-700 font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition"
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

          <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">💡 Pro Tips:</h3>
            <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
              <li>• Paste your complete content for best results</li>
              <li>• Content should be well-structured with headings</li>
              <li>• Report will be automatically downloaded after generation</li>
              <li>• Page limit is automatically managed by the system</li>
              <li>• Check your Downloads folder for the file</li>
            </ul>
          </div>

          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">📋 Content Format Guide:</h3>
            <p className="text-xs sm:text-sm text-blue-700 mb-2">Use these heading markers in your content:</p>
            <div className="text-xs sm:text-sm text-blue-600 space-y-1 font-mono overflow-x-auto">
              <div>## Introduction</div>
              <div>### Background and Context</div>
              <div>## Literature Review</div>
              <div>### Theoretical Framework</div>
              <div>## Methodology</div>
              <div>## Results and Discussion</div>
              <div>## Conclusion</div>
              <div>## References</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateFromContent;