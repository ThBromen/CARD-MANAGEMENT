// API Service for Student Card Management System
const BASE_URL = 'https://student-card-api.onrender.com/api/v1';

// Helper function to get authorization header
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const responseData = await response.json().catch(() => ({ message: 'Invalid JSON response' }));
  
  if (!response.ok) {
    console.error('API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      data: responseData
    });
    throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
  }
  
  console.log('API Success Response:', responseData); // Debug log
  return responseData;
};

// ==================== USER MANAGEMENT ====================

export const userAPI = {
  // Register a new user
  register: async (userData) => {
    const response = await fetch(`${BASE_URL}/user/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  // Login user
  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/user/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  // Update user by ID
  updateUser: async (id, userData) => {
    const response = await fetch(`${BASE_URL}/user/updateuser/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  // Delete user by ID
  deleteUser: async (id) => {
    const response = await fetch(`${BASE_URL}/deleteuser/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get all users
  getAllUsers: async () => {
    const response = await fetch(`${BASE_URL}/user/getUser/`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await fetch(`${BASE_URL}/user/userbyid/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== CARD REQUEST MANAGEMENT ====================

export const cardRequestAPI = {
  // Create a new card request
  createCardRequest: async (cardRequestData) => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    // Check if data is already FormData or contains file
    let body;
    let requestHeaders = { ...headers };
    
    if (cardRequestData instanceof FormData) {
      // Data is already FormData, use it as is
      body = cardRequestData;
      // Don't set Content-Type header for FormData, let the browser set it
    } else if (cardRequestData.photo instanceof File) {
      // Convert to FormData if photo is a File
      const formData = new FormData();
      Object.keys(cardRequestData).forEach(key => {
        formData.append(key, cardRequestData[key]);
      });
      body = formData;
    } else {
      // Use JSON for other cases
      requestHeaders['Content-Type'] = 'application/json';
      body = JSON.stringify(cardRequestData);
    }
    
    const response = await fetch(`${BASE_URL}/cardRequest/card`, {
      method: 'POST',
      headers: requestHeaders,
      body
    });
    return handleResponse(response);
  },

  // Update card request by ID
  updateCardRequest: async (id, cardRequestData) => {
    const response = await fetch(`${BASE_URL}/cardRequest/card/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(cardRequestData)
    });
    return handleResponse(response);
  },

  // Delete card request by ID
  deleteCardRequest: async (id) => {
    const response = await fetch(`${BASE_URL}/cardRequest/card/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get all card requests
  getAllCardRequests: async () => {
    const response = await fetch(`${BASE_URL}/cardRequest/card`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get card request by ID
  getCardRequestById: async (id) => {
    const response = await fetch(`${BASE_URL}/cardRequest/card/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Update card status (approve/reject)
  updateCardStatus: async (id, status) => {
    const response = await fetch(`${BASE_URL}/cardRequest/card/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  }
};

// ==================== CARD MANAGEMENT ====================

export const cardAPI = {
  // Get all approved cards
  getAllCards: async () => {
    const response = await fetch(`${BASE_URL}/cardRequest/card/all-cards`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== UTILITY FUNCTIONS ====================

export const authUtils = {
  // Store authentication token
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  // Get authentication token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Remove authentication token
  removeToken: () => {
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    // Clear any other user-related data if needed
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
  }
};

// ==================== ERROR HANDLER ====================

export const apiErrorHandler = (error) => {
  console.error('API Error:', error);
  
  if (error.message.includes('Network error')) {
    return 'Network connection failed. Please check your internet connection.';
  }
  
  if (error.message.includes('401')) {
    authUtils.removeToken();
    window.location.href = '/login';
    return 'Session expired. Please login again.';
  }
  
  if (error.message.includes('403')) {
    return 'You do not have permission to perform this action.';
  }
  
  if (error.message.includes('404')) {
    return 'Requested resource not found.';
  }
  
  if (error.message.includes('500')) {
    return 'Server error. Please try again later.';
  }
  
  return error.message || 'An unexpected error occurred.';
};

export default {
  userAPI,
  cardRequestAPI,
  cardAPI,
  authUtils,
  apiErrorHandler
};
