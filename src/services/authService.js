import api from './api';

const authService = {
  // ✅ REGISTER - Fixed to store userId properly
  register: async (userData) => {
    console.log('📤 authService.register sending:', userData);
    
    const response = await api.post('/user/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password
    });
    
    console.log('✅ Register response:', response.data);
    
    if (response.data.token) {
      // ✅ CLEAR OLD DATA FIRST
      localStorage.clear();
      
      // ✅ STORE ALL USER DATA PROPERLY
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.id || response.data.userId);
      localStorage.setItem('userName', response.data.name || response.data.username);
      localStorage.setItem('userEmail', response.data.email);
      
      // ✅ ALSO STORE AS JSON FOR COMPATIBILITY
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id || response.data.userId,
        email: response.data.email,
        username: response.data.name || response.data.username,
      }));
      
      console.log('✅ Stored userId:', localStorage.getItem('userId'));
      console.log('✅ Stored userName:', localStorage.getItem('userName'));
    }
    
    return response.data;
  },

  // ✅ LOGIN - Fixed to store userId properly
  login: async (email, password) => {
    console.log('📤 authService.login for:', email);
    
    const response = await api.post('/user/login', {
      email,
      password,
    });
    
    console.log('✅ Login response:', response.data);
    
    if (response.data.token) {
      // ✅ CLEAR OLD DATA FIRST (CRITICAL!)
      localStorage.clear();
      
      // ✅ STORE ALL USER DATA PROPERLY
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.id || response.data.userId);
      localStorage.setItem('userName', response.data.name || response.data.username);
      localStorage.setItem('userEmail', response.data.email);
      
      // ✅ ALSO STORE AS JSON FOR COMPATIBILITY
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id || response.data.userId,
        email: response.data.email,
        username: response.data.name || response.data.username,
      }));
      
      console.log('✅ Login successful!');
      console.log('   UserId:', localStorage.getItem('userId'));
      console.log('   UserName:', localStorage.getItem('userName'));
      console.log('   Token:', localStorage.getItem('token') ? 'Set ✅' : 'Missing ❌');
    }
    
    return response.data;
  },

  // ✅ LOGOUT - Clear everything
  logout: () => {
    console.log('🚪 Logging out...');
    localStorage.clear();
    sessionStorage.clear();
  },

  // ✅ GET CURRENT USER - Updated to return userId
  getCurrentUser: () => {
    const userJson = localStorage.getItem('user');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    
    if (userJson) {
      const user = JSON.parse(userJson);
      return {
        ...user,
        id: user.id || userId, // Ensure id is present
      };
    }
    
    if (userId) {
      return {
        id: parseInt(userId),
        username: userName,
        email: localStorage.getItem('userEmail'),
      };
    }
    
    return null;
  },

  // ✅ GET USER ID - New helper method
  getUserId: () => {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;
