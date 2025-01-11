
const API_BASE_URL = 'http://localhost:4005'; // Backend URL

// Helper Function to Make API Requests
const fetchAPI = async (url, options = {}) => 
{
  // Get the Token from localStorage
  const token = localStorage.getItem('token');

  // Default Headers (Conditionally Set Content-Type)
  const headers = {

    ...(options.body && !(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
    ...options.headers, 

  };
  
  // Attach Authorization Header if a Token is Present
  if (token) 
  {
    headers.Authorization = `Bearer ${token}`;
  }

  // Make the Fetch Request
  const response = await fetch(`${API_BASE_URL}${url}`, 
  {
    ...options,
    headers,
  });

  // Handle JSON Response
  const data = await response.json();

  // Error Responses
  if (!response.ok) 
  {
    throw new Error(data.error || 'API Request Failed.');
  }

  return data;
};

export default fetchAPI;