
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Import Navigation
import { toast } from 'react-toastify';                            // Import Toast
import 'react-toastify/dist/ReactToastify.css';                    // Import Toast CSS

// API - Handle Fetch Requests
import fetchAPI from '../../fetchAPI';

// CSS
import '../../App.css';
import './Explore.css';

const Explore = () => 
{
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]); // To store all categories

  const location = useLocation(); // To get query params

  // Parse query parameters and set as initial filters
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(location.search);
    return {
      name: params.get('name') || '',
      city: params.get('city') || '',
      country: params.get('country') || '',
      categoryName: params.get('category') ? [params.get('category')] : [],
      startDate: params.get('startDate') || '',
      endDate: params.get('endDate') || '',
      status: '',
    };
  });

  const [sortOptions, setSortOptions] = useState({
    sortBy: '',
    sortOrder: 'asc',
  });

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({ 

        ...filters,
        categoryName: filters.categoryName, // Send as an array
        ...sortOptions 

      }).toString();

      const data = await fetchAPI(`/api/v1/events?${query}`, { method: 'GET' });

      setEvents(data);
    } 
    
    catch (error) 
    {
      console.error('Error Fetching Events:', error.message);
      toast.error(`Error: ${error.message}`);
    } 
    
    finally 
    {
      setLoading(false);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {

      const data = await fetchAPI('/api/v1/eventsCategory', { method: 'GET' });

      setCategories(data);

    } 
    
    catch (error) 
    {
      console.error('Error fetching categories:', error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters, sortOptions]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryName) => {
    setFilters((prevFilters) => {
      let updatedCategories = [...prevFilters.categoryName];
      if (updatedCategories.includes(categoryName)) {
        // Remove category if already selected
        updatedCategories = updatedCategories.filter((name) => name !== categoryName);
      } else {
        // Add category if not selected
        updatedCategories.push(categoryName);
      }
      return {
        ...prevFilters,
        categoryName: updatedCategories,
      };
    });
  };
  

  // Handle input changes for filters
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Handle sorting changes
  const handleSortChange = (e) => {
    setSortOptions({
      ...sortOptions,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="explore">
      <div className="event-container">

        <div className="filters">

          <select name="sortBy" value={sortOptions.sortBy} onChange={handleSortChange}>
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="startDate">Start Date</option>
            <option value="endDate">End Date</option>
          </select>

          <select name="sortOrder" value={sortOptions.sortOrder} onChange={handleSortChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          <input
            type="text"
            name="name"
            placeholder="Search by Name"
            value={filters.name}
            onChange={handleFilterChange}
          />

          <div className="category-filters">
          <h4>Categories</h4>
            {categories.map((category) => (
              <div className="category-filters-div" key={category.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={filters.categoryName.includes(category.name)}
                    onChange={() => handleCategoryChange(category.name)}
                  />
                  {category.name}
                </label>
              </div>
            ))}
          </div>

          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />

          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={filters.city}
            onChange={handleFilterChange}
          />

          <input
            type="text"
            name="country"
            placeholder="Country"
            value={filters.country}
            onChange={handleFilterChange}
          />

        </div>
        <div className="event-list">
          {loading ? (
            <h1 className="no-event">Loading Events...</h1>
          ) : events.length ? (
            events

              .filter((event) => {
                // If no categories are selected, show all events
                if (filters.categoryName.length === 0) {
                  return true;
                }

                // Check if the event's category matches any of the selected categories (case insensitive)
                return filters.categoryName.some((category) =>
                  event.category && event.category.toLowerCase().includes(category.toLowerCase())
                );
              })   

              .map((event) => (
                <Link key={event.id} to={`/event/${event.id}`} className="event-card">
                  <img
                    src={
                      event.cover
                        ? event.cover.startsWith('data:image')
                          ? event.cover
                          : `/uploads/covers/${event.cover}`
                        : '/uploads/covers/default-cover.jpg'
                    }
                    alt={event.name}
                    className="event-image"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="event-details">
                    <h2 className="event-title">{event.name}</h2>
                    <p className="event-category">{event.category || 'N/A'}</p>
                    <p className="event-dates">
                      Date: {new Date(event.startDate).toLocaleDateString()} -{' '}
                      {new Date(event.endDate).toLocaleDateString()}
                    </p>
                    <p className="event-location">
                      Location: {event.city}, {event.country}
                    </p>
                  </div>
                </Link>
              ))
          ) : (
            <div className="no-event-center">
              <h1 className="no-event">No Events Found...</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;