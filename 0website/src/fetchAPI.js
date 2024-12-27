const API_BASE_URL = 'http://localhost:4000'; // Replace with your backend's URL

// Helper function to make API requests
const fetchAPI = async (url, options = {}) => {
  // Get the token from localStorage
  const token = localStorage.getItem('token');

  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers, // Include any custom headers passed in options
  };

  // Attach Authorization header if a token is present
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Make the fetch request
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // Handle JSON response
  const data = await response.json();

  // Throw an error for unsuccessful responses
  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
};

export default fetchAPI;