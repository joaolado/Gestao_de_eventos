import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// API - Handle Fetch Requests
import fetchAPI from '../../fetchAPI';

// CSS
import '../search/Search.css';

function Search() {
  const navigate = useNavigate(); // Initialize navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [dates, setDates] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories

  useEffect(() => {
    // Fetch categories from the database
    const fetchCategories = async () => {
      try {
        const data = await fetchAPI('/api/v1/eventsCategory', { method: 'GET' });
        setCategories(data); // Set fetched categories
      } catch (error) {
        console.error('Error fetching categories:', error.message);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = () => {
    // Build query string
    const query = new URLSearchParams({
      name: searchQuery,
      category: category !== 'all' ? category : '',
      startDate: dates.length ? dates[0]?.format('YYYY-MM-DD') : '',
      endDate: dates.length ? dates[1]?.format('YYYY-MM-DD') : '',
    }).toString();

    // Redirect to the Explore page with query params
    navigate(`/explore?${query}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); // Trigger search when Enter is pressed
    }
  };

  return (
    <div className="search-container">

      <select
        className="category-dropdown"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search Event..."
        className="search-bar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown} // Handle Enter key press
      />

      <DatePicker.RangePicker
        className="date-picker"
        onChange={(values) => setDates(values || [])}
      />

      <button className="search-button" onClick={handleSearch}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <g fill="#000"><path d="M18.748 12.816c-1.74.067-3.313.688-4.154 1.53a1 1 0 1 1-1.414-1.415c1.297-1.297 
          3.409-2.033 5.49-2.114c2.095-.081 4.382.492 5.984 2.094a1 1 0 0 1-1.415 1.414c-1.09-1.091-2.764-1.577-4.491-1.51"/>
            <path fillRule="evenodd" d="M28.936 27.384A12.95 12.95 0 0 0 32 19c0-7.18-5.82-13-13-13S6 11.82 6 19s5.82 13 13 
              13c3.195 0 6.12-1.152 8.384-3.064L27 31.144l7.514 7.514l4.144-4.144L31.144 27zM19 29c5.523 0 10-4.477 10-10S24.523 
              9 19 9S9 13.477 9 19s4.477 10 10 10" clipRule="evenodd"/>
            <path d="m35.928 40.072l4.144-4.144l1.356 1.356c.763.763.763 
          2 0 2.762l-1.382 1.382c-.763.763-2 .763-2.762 0z"/>
        </g>
      </svg>
      </button>
    </div>
  );
}

export default Search;