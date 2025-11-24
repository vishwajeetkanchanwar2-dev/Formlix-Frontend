import api from './api';

const authService = {
  // ✅ Fixed: Accept object instead of individual params
  register: async (userData) => {
    console.log('authService sending:', userData); // Debug
    
    const response = await api.post('/user/register', {
      name: userData.name,        // ✅ Backend expects "name"
      email: userData.email,
      password: userData.password
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        email: response.data.email,
        username: response.data.username, // Backend returns this as "name"
      }));
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/user/login', {
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        email: response.data.email,
        username: response.data.username,
      }));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;