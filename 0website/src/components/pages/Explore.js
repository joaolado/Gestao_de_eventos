
import React, { useState, useEffect } from 'react';

// Import Navigation
import { useNavigate, Link, useLocation } from 'react-router-dom';

// Import Toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// API - Handle Fetch Requests
import fetchAPI from '../../fetchAPI';

// CSS
import '../../App.css';
import './Explore.css';

const Explore = () => 
{
  // State Variables for Managing User Inputs and Fetched Data
  const [loading, setLoading] = useState(false);         // To Show a Loading Indicator
  const [userType, setUserType] = useState(null);        // To Store the Logged-in User Type
  const [events, setEvents] = useState([]);              // To Store the List of Fetched Events
  const [categories, setCategories] = useState([]);      // To Store All Event Categories
  const [showDeleted, setShowDeleted] = useState(false); // Toggle for Showing Deleted Events
  const [currentPage, setCurrentPage] = useState(1);     // Track the Current Page for Pagination
  const [totalPages, setTotalPages] = useState(1);       // Track the Total Pages
  const [pageSize] = useState(8);                        // Number of Events per Page

  const location = useLocation();  // Access the URL and Query Parameters
  const navigate = useNavigate();  // Hook for Navigation

  // Query parameters and set Initial Filters
  const [filters, setFilters] = useState(() => 
  {
    // Extract Query Parameters from URL
    const params = new URLSearchParams(location.search);

    return {

      name: params.get('name') || '',
      city: params.get('city') || '',
      country: params.get('country') || '',
      categoryName: params.get('category') ? [params.get('category')] : [],
      startDate: params.get('startDate') || '',
      endDate: params.get('endDate') || '',
      startTime: params.get('startTime') || '',
      endTime: params.get('endTime') || '',
      status: '',

    };
  });

  // State for Sorting Options
  const [sortOptions, setSortOptions] = useState({

    sortBy: '',
    sortOrder: 'asc',

  });

  // Fetch the User Type
  const fetchUserType = async () => 
  {
    try 
    {
      // Make an API Call to Get Profile (User Type)
      const response = await fetchAPI('/api/v1/profile/get-profile');

      if (response?.usersType) 
      {
        setUserType(response.usersType);
      }
    } 
    
    catch (error) 
    {
      console.error('Error fetching user type:', error);
    }
  };

  // Fetch Events
  const fetchEvents = async (page = 1, pageSize = 8) => 
  {
    try 
    {
      setLoading(true);

      // Construct Query String With Filters, Sorting, and Pagination
      const query = new URLSearchParams({ 

        ...filters,
        categoryName: filters.categoryName,
        ...sortOptions,
        showDeleted: showDeleted.toString(), 
        page: page.toString(),
        pageSize: pageSize.toString(),

      }).toString();

      // Make an API Call to Get Events Query
      const data = await fetchAPI(`/api/v1/events?${query}`, { method: 'GET' });

      setEvents(data.data);           
      setTotalPages(data.totalPages); 
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

  // Fetch Events Categories
  const fetchCategories = async () => 
  {
    try 
    {
      // Make an API Call to Get Events Categories
      const data = await fetchAPI('/api/v1/eventsCategory', { method: 'GET' });

      setCategories(data);
    } 
    
    catch (error) 
    {
      console.error('Error Fetching Categories:', error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  // Fetch User Type
  useEffect(() => 
  {
    fetchUserType();
  }, []);

  // Fetch Events When Filters, Sorting Options, or Pagination Change
  useEffect(() => 
  {
    fetchEvents(currentPage, pageSize);
  }, [filters, sortOptions, showDeleted, currentPage]);

  // Fetch Events Categories
  useEffect(() => 
  {
    fetchCategories();
  }, []);

  // Handle Category Filter Changes (Add or Remove Categories)
  const handleCategoryChange = (categoryName) => 
  {
    setFilters((prevFilters) => 
    {
      let updatedCategories = [...prevFilters.categoryName];

      // Remove Category if Already Selected
      if (updatedCategories.includes(categoryName)) 
      {
        updatedCategories = updatedCategories.filter((name) => name !== categoryName);
      } 

      // Add Category if Not Selected
      else 
      {
        updatedCategories.push(categoryName);
      }
      
      return {
        ...prevFilters,
        categoryName: updatedCategories,
      };
    });
  };
  
  // Handle Input Changes for Filters
  const handleFilterChange = (e) => 
  {
    setFilters({

      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Sorting Changes
  const handleSortChange = (e) => 
  {
    setSortOptions({

      ...sortOptions,
      [e.target.name]: e.target.value,
    });
  };

  // Toggle the Display of Deleted Events
  const handleToggleDeleted = () => 
  {
    setShowDeleted((prevState) => {
      
      return !prevState;
    });
  };

  // Handle Button Click to Create a New Event
  const handleCreateEvent = () => 
  {
    navigate('/event/new');  // Navigate to the 'Create' Route
  };

  //-----------------------------------------------------------------------------------------------------------------
  // FRONTEND
  //-----------------------------------------------------------------------------------------------------------------
  return (

    <div className="explore">
      <div className="event-container">

        <div className="filters">

          {['UserAdmin', 'UserSuperAdmin'].includes(userType) && (

            <div>
              <button onClick={handleCreateEvent} className="add-event">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#fff" d="M11 13v3q0 .425.288.713T12 17t.713-.288T13 16v-3h3q.425 0 .713-.288T17 
                  12t-.288-.712T16 11h-3V8q0-.425-.288-.712T12 7t-.712.288T11 8v3H8q-.425 0-.712.288T7 12t.288.713T8 
                  13zm-6 8q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 
                  1.413T19 21z"/>
                </svg>
                ADD EVENT
              </button>

              <label className="toggle-switch">
                <div className="toggle-label">
                  <p>Active / Deleted Events</p>
                </div>
                <input
                  type="checkbox"
                  checked={showDeleted}
                  onChange={handleToggleDeleted}
                />
                <span className="slider"></span>
              </label>
            </div>
          )}

          <div className="category-filters pag-filters">

            <h4>Events Page</h4>
          
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                disabled={currentPage === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#fff" d="M9.857 15.962a.5.5 0 0 0 .243.68l9.402 4.193c1.496.667 
                    3.047-.814 2.306-2.202l-3.152-5.904c-.245-.459-.245-1 
                    0-1.458l3.152-5.904c.741-1.388-.81-2.87-2.306-2.202l-3.524 1.572a2 2 0 0 0-.975.932z"/>
                  <path fill="#fff" d="M8.466 15.39a.5.5 0 0 1-.65.233l-4.823-2.15c-1.324-.59-1.324-2.355 
                    0-2.945L11.89 6.56a.5.5 0 0 1 .651.68z" opacity="0.5"/>
                </svg>
              </button>
              
              <span>
                {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#fff" d="M14.143 15.962a.5.5 0 0 1-.244.68l-9.402 
                    4.193c-1.495.667-3.047-.814-2.306-2.202l3.152-5.904c.245-.459.245-1 0-1.458L2.191 5.367c-.74-1.388.81-2.87 
                    2.306-2.202l3.525 1.572a2 2 0 0 1 .974.932z"/>
                  <path fill="#fff" d="M15.533 15.39a.5.5 0 0 0 .651.233l4.823-2.15c1.323-.59 1.323-2.355 0-2.945L12.109 
                    6.56a.5.5 0 0 0-.651.68z" opacity="0.5"/>
                </svg>
              </button>
            </div>
          </div>

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

          <div className="category-filters cat-filters">

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
            className="date-cursor"
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />

          <input
            className="date-cursor"
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

            <div className="no-event-center">
              <h1 className="no-event">Loading Events...</h1>
            </div>

          ) : events && events.length ? (
            events

              .filter((event) => 
              {
                // If no Categories are Selected, Show All Events
                if (filters.categoryName.length === 0) 
                {
                  return true;
                }

                // Check if the Events Category Matches Selected Categories (Case Insensitive)
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
                    
                    <h2 className="event-title">{event.name && event.name.length > 15 ? `${event.name.slice(0, 15)}...` : event.name}</h2>
                    <p className="event-category">{event.category || 'N/A'}</p>

                    <p className="event-data-time">
                      Date: {new Date(event.startDate).toLocaleDateString('en-GB')} -{' '}
                      {new Date(event.endDate).toLocaleDateString('en-GB')}
                    </p>

                    <p className="event-data-time">
                      Time: {new Date(event.startDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {new Date(event.endDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
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