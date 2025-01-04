
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import Navigation
import { toast } from 'react-toastify';                    // Import Toast
import 'react-toastify/dist/ReactToastify.css';            // Import Toast CSS

// API - Handle Fetch Requests
import fetchAPI from '../../fetchAPI';

// CSS
import '../../App.css';
import './EditEvent.css';

const EditEvent = () => 
{
  const { id } = useParams(); // Get the event ID from the URL

  // State Hooks for Managing Edit Events
  const [editEvent, setEditEvent] = useState({

    cover: '',
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    capacity: 'null',
    categoryName: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    city: '',
    region: '',
    country: '',

    tickets: {
      price: 'null',
      quantity: 'null',
      type: '',
      status: '',
    },

    status: '',
  });

  // State Hooks for Handling Loading, Sections, and Other States
  const [userType, setUserType] = useState(null);
  const [currentView, setCurrentView] = useState("menu"); // 'menu', 'create', or 'edit'
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);                // Determines if Data is Still Loading
  const [isEditing, setIsEditing] = useState(false);               // Whether the User is Editing Their Event
  const [coverEdited, setCoverEdited] = useState(false);           // Whether Cover was Edited
  const [file, setFile] = useState(null);                          // File for Uploading Event Cover

  const navigate = useNavigate(); // Hook for Navigation

  useEffect(() => 
  {
    const fetchUserType = async () => {
      try {
        // Fetch user information from the API using the token
        const response = await fetchAPI('/api/v1/profile/get-profile'); // Adjust endpoint as needed
        if (response?.usersType) {
          setUserType(response.usersType);
        }
      } catch (error) {
        console.error('Error fetching user type:', error);
      }
    };

    // Fetch the Event Data
    const fetchEvent = async () =>
    {
      if (!id) return; // Ensure ID exists
      
      setIsLoading(true); // Set Loading to True While Fetching Data

      try
      {
        // Fetch Event Data From the Server
        const data = await fetchAPI(`/api/v1/events/${id}`);

        // Ensure data contains the id
        if (!data.id) {
          console.error("Event ID not found in API response");
          setIsLoading(false);
          return;
        }

        // Format start and end dates
        const formattedStartDate = new Date(data.startDate).toISOString().split('T')[0];
        const formattedEndDate = new Date(data.endDate).toISOString().split('T')[0];

        // Update the Event State With the Fetched Data
        setEditEvent((prevEvent = {}) => ({

          ...prevEvent,
          ...data,
          id: data.id,  // Ensure that event id is added to the state
          startDate: formattedStartDate,  // Set the formatted start date
          endDate: formattedEndDate,      // Set the formatted end date
          capacity: data.capacity ?? null,
          tickets: {
            price: data.tickets?.price ?? null,
            quantity: data.tickets?.quantity ?? null,
          },
          
          // Use the Fetched Event Cover if Available
          cover: data.cover || prevEvent.cover,

          // Set the category name from the fetched data
          categoryName: data.category ? data.category.name : "", // Ensure categoryName is set if category exists

          // Merge the Fetched Tickets Data With the Existing Tickets Data
          tickets: {
            ...prevEvent.tickets,
            ...data.tickets,
          },
        }));

        setIsLoading(false); // Set Loading to False once the Data is Fetched
      } 
      
      catch (error) 
      {
        console.error('Error Fetching Event:', error);
        setIsLoading(false); // In case of Error - Stop Loading
      }
    };
    
    // Call the Fetch Function to Load Data
    fetchUserType();
    fetchEvent();
  }, [id]);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchAPI('/api/v1/eventsCategory'); // Endpoint to fetch categories
        setCategories(response); // Assuming response is an array of categories
      } catch (error) {
        console.error('Error Fetching Categories:', error);
      }
    };

    fetchCategories();
  }, []); // Empty array means it will run only once when the component mounts

  // Handle Input Changes and Update Event Data
  const handleChange = (e) => 
  {
    const { name, value } = e.target;

    if (name === 'cover') setCoverEdited(true);

    if (name === "categoryName") {
      // Find the category object by its name
      const selectedCategory = categories.find((cat) => cat.name === value);
  
      // If the category exists, set the category ID (not just the name)
      if (selectedCategory) {
        setEditEvent((prevEvent) => ({
          ...prevEvent,
          category: selectedCategory.name, // Store the category ID instead of the name
        }));
      }
    }
    
    // Check if the Input Field is Part of the Tickets Object
    if (name.startsWith('tickets.')) 
    {
      const ticketsKey = name.split('.')[1]; // Extract Tickets Field Key

      // Update the Corresponding Tickets Field in the Event State
      setEditEvent((prevEvent) => ({
        ...prevEvent,

        tickets: {
          ...prevEvent.tickets,
          [ticketsKey]: value,
        },

      }));
    } 

    if (name === 'status') {
      setEditEvent((prevEvent) => ({
        ...prevEvent,
        status: value, // Update the status field in the state
      }));
    }
    
    else 
    { 
      // Update Other Fields Directly in the Event State
      setEditEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
    }
  };

  const formatDateToISO = (date) => {
    // Ensure the date is in dd/MM/yyyy format
    const [day, month, year] = date.split('/');
    const formattedDate = `${year}-${month}-${day}`;
  
    const parsedDate = new Date(formattedDate);
  
    // Check if the parsed date is valid
    if (isNaN(parsedDate)) {
      console.error('Invalid date:', date);
      return null;
    }
  
    // Return date in yyyy-MM-dd format
    return `${year}-${month}-${day}`;
  };

  const extractDate = (isoString) => {
    if (!isoString) return '';
    return isoString.split('T')[0]; // Extract yyyy-MM-dd from ISO string
  };  

  const saveNewCategory = async () => {
    if (!newCategoryName) return;
    try {
      const response = await fetchAPI('/api/v1/eventsCategory/create', {
        method: 'POST',
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (response.success) {
        toast.success('Category created successfully');
        setCategories((prevCategories) => [
          ...prevCategories,
          { id: response.categoryId, name: newCategoryName }, // Assuming the response contains the new category's id
        ]);
        setEditEvent((prev) => ({ ...prev, categoryName: newCategoryName }));
      } else {
        toast.error('Error creating category');
      }
    } catch (error) {
      console.error('Error Saving New Category:', error);
      toast.error('Error saving category');
    }
  };
  
  

  const addTicket = () => {
    setEditEvent(prevState => ({
      ...prevState,
      tickets: [
        ...prevState.tickets,
        { type: 'Standard', price: '', quantity: '', status: 'Available' },
      ],
    }));
  };

  const validateForm = () => {
    if (!editEvent.name.trim()) {
      toast.error('Event name is required.');
      return false;
    }
    if (!editEvent.startDate || !editEvent.endDate) {
      toast.error('Start and End dates are required.');
      return false;
    }
    if (editEvent.capacity && isNaN(editEvent.capacity)) {
      toast.error('Capacity must be a number.');
      return false;
    }

    // Check if categoryName is either undefined or matches a valid category
    if (editEvent.categoryName && !categories.some((cat) => cat.name === editEvent.categoryName)) {
      toast.error('Please select a valid category.');
      return false;
    }

    return true;
  };
  
  // Handle Form Submission to Update the Event
  const handleSubmit = async (e) => 
  {
    e.preventDefault(); // Prevent the Default Form Submit Action

    if (!validateForm()) return; // Check Validation
    
    // Create the updated Event data to send in the Request Body
    const updatedEvent = 
    {
      name: editEvent.name,
      description: editEvent.description,
      startDate: formatDateToISO(editEvent.startDate),
      endDate: formatDateToISO(editEvent.endDate),
      capacity: editEvent.capacity ? parseInt(editEvent.capacity, 10) : null,
      categoryName: editEvent.categoryName,
      addressLine1: editEvent.addressLine1,
      addressLine2: editEvent.addressLine2,
      postalCode: editEvent.postalCode,
      city: editEvent.city,
      region: editEvent.region || '',
      country: editEvent.country,
      status: editEvent.status,  // Ensure status is being sent in the update request

      price: editEvent.tickets.price ? parseInt(editEvent.tickets.price, 10) : null,
      quantity: editEvent.tickets.quantity ? parseInt(editEvent.tickets.quantity, 10) : null,
    };

    // Add event ID only if it's present (for updates only)
    if (editEvent.id) { updatedEvent.id = editEvent.id; } // Only include ID if it exists (for updates)
    
    // Ensure tickets is part of updatedEvent
    if (!updatedEvent.tickets) updatedEvent.tickets = editEvent.tickets;
    
    try 
    {
      // Make the API Call to Update the Event
      const response = await fetchAPI('/api/v1/events/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(updatedEvent), // Send the Updated Event Data in the Request Body
      });

              // Log the response to see more details if it fails
              console.log(response);
  
      // Handle Success or Failure Based on the Response from the API
      if (response.success) {
        toast.success('Event Updated Successfully.');
        setIsEditing(false);         // Stop Editing After Successful Update
        setCoverEdited(false);       // Reset Cover Edit State
      } 
      
      else 
      {
        // Show Error if Update Fails
        toast.error('Event Update failed. ' + response.message);
      }

      // Redirect to the Dashboard
      // navigate('/event/:id');

    } 
    
    catch (error) 
    {
      console.error('Error Updating Event ', error);
      toast.error('Failed to Update Event.');
    }
  };

  // Toggle Edit Mode when the "Edit" Button is Clicked
  const toggleEdit = () => setIsEditing(true);

  // Close Edit Mode and Reset Edit Flags
  const closeEdit = () => 
  {
    setIsEditing(false);
    setCoverEdited(false);
  };

  // Render Buttons Based on Whether the Cover is Being Edited
  // Show "Edit" Button When Not Editing 
  // Show "Save Changes" and "Close" Buttons When Editing
  const renderButtons = () => (

    <div className="button-group">

      {!isEditing && ( <button type="button" onClick={toggleEdit}>EDIT</button> )}

      {isEditing && (
        <>
          <button type="submit">SAVE CHANGES</button>
          <button type="button" onClick={closeEdit}>CLOSE</button>
        </>
      )}

    </div>
  );

  // File Change Handler to Preview the Image
  const handleFileChange = (e) => 
  {
    // Get the First File From the File Input
    const file = e.target.files[0];

    // Set the Selected File to the State Variable "file"
    setFile(file);

    if (file) 
    {
      // Create a New FileReader Object to Read the File
      const reader = new FileReader(); 

      reader.onload = () =>

        // Once the file is Read Successfully, Update the cover in the Event State
        setEditEvent((prev) => ({ 
          ...prev, 
          cover: reader.result,
          id: prev.id || id, // Ensure id is preserved

        }));

      // Read the File as a Data URL (For Image Preview)
      reader.readAsDataURL(file);
    }
  };

  // Handle Event Cover Update on Form Submission
  const handleCoverUpdate = async (e) => 
  {
    if (!id) return; // Ensure ID exists
    
    e.preventDefault();  // Prevent the Default Form Submit Action

      // Debugging log
      console.log("editEvent.id:", editEvent.id);

    // Ensure ID exists before proceeding
    if (!editEvent.id) {
      toast.error('Event ID is missing.');
      return;
    }
    
    // Check if a File is Selected
    if (!file) 
    {
      toast.info('Please Select a File to Upload.');
      return;
    }
    
    // Create a FormData Object for Image File
    const formData = new FormData();

    // Append the event ID for the update operation
    formData.append('id', editEvent.id); // Append the ID

    // File to the FormData Object
    formData.append('cover', file);

    try 
    {
      // Make the PUT Request to Update the Event Cover
      const response = await fetchAPI('/api/v1/events/edit', 
      {
        method: 'PUT',
        body: formData, // Send the FormData With the Image File
      });

                    // Log the response to see more details if it fails
                    console.log(response);
      
      // If the Response is Successful, Update the Event Cover
      if (response.success) 
      {
        toast.success('Cover Updated Successfully.');
        
        // Fetch Updated Event Data to Refresh the UI
        const updatedEventData = await fetchAPI(`/api/v1/events/${editEvent.id}`);

        // Update the Event State With the New Event Cover
        setEditEvent((prevEvent) => ({

          ...prevEvent,
          cover: updatedEventData.cover || prevEvent.cover,

        }));
      } 
      
      else 
      {
        toast.error('Failed to Update Event Cover.');
      }

      // Redirect to the Dashboard
      // navigate('/event/:id');

    } 
    
    catch (error) 
    {
      console.error('Error Updating Event Cover ', error);
      toast.error('Error Updating Event Cover.');
    }
  };

  const handleCreateEvent = () => {
    // Reset the editEvent state to an empty event object when creating a new event
    setEditEvent({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      capacity: "",
      categoryName: "",
      addressLine1: "",
      addressLine2: "",
      postalCode: "",
      city: "",
      region: "",
      country: "",
      status: "", // Add other properties as needed
      tickets: { price: "", quantity: "" }
    });
  
    setCurrentView("create");
  };






  return (

      <div className="event-page-container">
        {currentView === "menu" && (
          <div className="edit-event-container">
              
            <div className="event-header">
              <h1 className="event-title">EVENT: <span>{editEvent.name || "N/A"}</span></h1>
            </div>            

            <div className="event">
              <div className="event-preview">
                {isLoading ? (
                  <div>Loading...</div> // ADD Loading Animation
                ) : (
                  <div className="event-cover">
                    <img
                      src={
                        editEvent?.cover
                          ? editEvent.cover.startsWith("data:image")
                            ? editEvent.cover
                            : `/uploads/covers/${editEvent.cover}`
                          : "/uploads/covers/default-cover.jpg"
                      }
                      alt="Cover"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>

              <div className="event-edit">
                <div className="event-form event-form-span">

                  <div className="form-group">
                    <label>Category</label>
                    <span>{editEvent.category || "N/A"}</span>
                  </div>

                  <div className="form-group">
                    <label>Event Status</label>
                    <span>{editEvent.status || "N/A"}</span>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <span>{editEvent.description || "N/A"}</span>
                  </div>

                  <div className="form-group">
                    <label>Start Date</label>
                    <span>{editEvent.startDate || "N/A"}</span>
                  </div>

                  <div className="form-group">
                    <label>End Date</label>
                    <span>{editEvent.endDate || "N/A"}</span>
                  </div>

                  <div className="form-group">
                    <label>Capacity</label>
                    <span>{editEvent.capacity || "N/A"}</span>
                  </div>

                  <div className="form-group">
                    <label>Address Line 1</label>
                    <span>{editEvent.addressLine1 || "N/A"}</span>
                  </div>

                  <div className="form-group">
                    <label>Address Line 2</label>
                    <span>{editEvent.addressLine2 || "N/A"}</span>
                  </div>

                  <div className="form-group">
                    <label>Postal Code</label>
                    <span>{editEvent.postalCode || "N/A"}</span>
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <span>{editEvent.city || "N/A"}</span>
                  </div>

                  <div className="form-group">
                    <label>Region</label>
                    <span>{editEvent.region || "N/A"}</span>
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <span>{editEvent.country || "N/A"}</span>
                  </div>
                </div>

                <div>

                  {['UserAdmin', 'UserSuperAdmin'].includes(userType) && (
                    <>

                    <button onClick={handleCreateEvent} className="menu-button">
                      CREATE EVENT
                    </button>

                    <button onClick={() => setCurrentView("edit")} className="menu-button">
                      EDIT EVENT
                    </button>

                    </>
                  )}
                  
                </div>

              </div>
            </div>
          </div>

          
        )}
  
        {currentView === "create" && (
          <div className="edit-event-container">

          <div className="event-header">
            <h1 className="event-title">CREATE EVENT</h1>
          </div>

          <div className="event">

            <div className="event-preview">

              {isLoading ? (

                <div>Loading...</div> // ADD Loading Animation

              ) : (

              <div className="event-cover">

                <img
                  src={
                    editEvent?.cover 
                      ? editEvent.cover.startsWith('data:image')
                      ? editEvent.cover 
                      : `/uploads/covers/${editEvent.cover}` 
                      : '/uploads/covers/default-cover.jpg'
                  }
                  alt="Cover"
                  style={{ objectFit: 'cover' }}
                />

                <button onClick={() => document.getElementById('file').click()}>
                  <svg className="edit-cover" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path fill="#000" d="M11.498 5.501a1.002 1.002 0 1 1-2.003 0a1.002 1.002 0 0 1 2.003 0M2 4.5A2.5 
                    2.5 0 0 1 4.5 2h6.998a2.5 2.5 0 0 1 2.5 2.5v1.558a2.6 2.6 0 0 0-1-.023V4.5a1.5 1.5 0 0 0-1.5-1.5H4.5A1.5 
                    1.5 0 0 0 3 4.5v6.998c0 .232.052.451.146.647l3.651-3.651a1.7 1.7 0 0 1 2.404 0l.34.34l-.706.707l-.341-.34a.7.7 
                    0 0 0-.99 0l-3.651 3.65c.196.094.415.147.647.147h1.796l-.25 1H4.5a2.5 2.5 0 0 1-2.5-2.5zm11.263 2.507a1.56 1.56 
                    0 0 0-.927.447L8.05 11.742a2.8 2.8 0 0 0-.722 1.256l-.009.033l-.303 1.211a.61.61 0 0 0 .74.74l1.21-.303a2.8 2.8 
                    0 0 0 1.29-.73l4.288-4.288a1.56 1.56 0 0 0-1.28-2.654"/>
                  </svg>
                </button>

                <input
                  id="file"
                  type="file"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleFileChange}
                />

                <button onClick={handleCoverUpdate} className="submit">
                  <svg className="save-cover" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path fill="#000" d="M17 6.125v2.91A3.5 3.5 0 0 0 16.5 9H16V6.125a.97.97 0 0 0-.289-.711l-2.125-2.125A.96.96 
                    0 0 0 13 3.008V5.5a1.51 1.51 0 0 1-.922 1.383A1.3 1.3 0 0 1 11.5 7h-4a1.51 1.51 0 0 1-1.383-.922A1.3 1.3 0 0 
                    1 6 5.5V3H5a.97.97 0 0 0-.703.289a1.1 1.1 0 0 0-.219.32A.86.86 0 0 0 4 4v10a1 1 0 0 0 
                    .078.391q.079.178.211.32a.85.85 0 0 0 .313.211q.192.073.398.078v-4.5a1.51 1.51 0 0 1 
                    .922-1.383c.181-.082.379-.122.578-.117h5.992a3.5 3.5 0 0 0-2.442 1H6.5a.505.505 0 0 0-.5.5V15h3v1H5a1.9 1.9 0 
                    0 1-.758-.156a2.2 2.2 0 0 1-.64-.422A1.9 1.9 0 0 1 3 14.039V4c-.001-.26.052-.519.156-.758a2.2 2.2 0 0 1 
                    .422-.642a1.9 1.9 0 0 1 .622-.436c.24-.105.499-.16.761-.164h7.914c.262 0 
                    .523.05.766.148c.244.099.465.248.648.438l2.125 2.125c.186.185.332.405.43.648c.099.244.152.503.156.766M7 
                    3v2.5a.505.505 0 0 0 .5.5h4a.505.505 0 0 0 .5-.5V3zm3 9.5a2.5 2.5 0 0 1 2.5-2.5h4a2.5 2.5 0 0 1 2.5 2.5v4c0 
                    .51-.152.983-.414 1.379l-3.025-3.025a1.5 1.5 0 0 0-2.122 0l-3.025 3.025A2.5 2.5 0 0 1 10 16.5zm7 .25a.75.75 
                    0 1 0-1.5 0a.75.75 0 0 0 1.5 0m-5.879 5.836c.396.262.87.414 1.379.414h4c.51 0 .983-.152 
                    1.379-.414l-3.025-3.025a.5.5 0 0 0-.708 0z"/>
                  </svg>
                </button>
              </div>
              )}

            </div>

            <div className="event-edit">

              <form className="event-form" onSubmit={handleSubmit}>

                <div className="form-group">
                  <label htmlFor="name">Event Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editEvent.name}
                    onChange={handleChange}
                    
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="categoryName">Category</label>
                  <select
                    id="categoryName"
                    name="categoryName"
                    value={editEvent.categoryName}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select a Category
                    </option>

                    <option value="new">Create New Category</option>
                    
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                    
                  </select>

                  <p>Selected Category: {editEvent.categoryName}</p>

                  {editEvent.categoryName === 'new' && (
                    <div>
                      <label htmlFor="newCategory">New Category Name</label>
                      <input
                        id="newCategory"
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="new-catg"
                      />
                      <button className="save-catg" type="button" onClick={saveNewCategory}>
                        Save Category
                      </button>
                    </div>
                  )}
                </div>


                <div className="form-group">
                  <label htmlFor="status">Event Status</label>
                  <select
                    id="status"
                    name="status"
                    value={editEvent.status || 'Scheduled'}
                    onChange={handleChange}
                    
                  >
                    <option value="" disabled>
                      Select Status
                    </option>
                    <option value="Active">Active</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={editEvent.description || ''}
                    onChange={handleChange}
                    className="description-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={editEvent.startDate ? extractDate(editEvent.startDate) : ''}
                    onChange={(e) => setEditEvent({ ...editEvent, startDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={editEvent.endDate ? extractDate(editEvent.endDate) : ''}
                    onChange={(e) => setEditEvent({ ...editEvent, endDate: e.target.value })}
                    
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="capacity">Capacity</label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={editEvent.capacity || undefined}
                    onChange={handleChange}
                    
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="addressLine1">Address Line 1</label>
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    value={editEvent.addressLine1 || ''}
                    onChange={handleChange}
                    
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="addressLine2">Address Line 2</label>
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    value={editEvent.addressLine2 || ''}
                    onChange={handleChange}
                    
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={editEvent.postalCode || ''}
                    onChange={handleChange}
                    
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={editEvent.city || ''}
                    onChange={handleChange}
                    
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="region">Region</label>
                  <input
                    type="text"
                    id="region"
                    name="region"
                    value={editEvent.region || ''}
                    onChange={handleChange}
                    
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={editEvent.country || ''}
                    onChange={handleChange}
                    
                  />
                </div>

                <button type="submit" className="submit-button">
                  SAVE CHANGES
                </button>

                <button onClick={() => setCurrentView("menu")} className="back-button">
                  BACK
                </button>
              </form>
            </div>
          </div>
        </div>
        )}
  
        {currentView === "edit" && (
          <div className="edit-event-container">

            <div className="event-header">
              <h1 className="event-title">EDIT EVENT</h1>
            </div>

            <div className="event">

              <div className="event-preview">

                {isLoading ? (

                  <div>Loading...</div> // ADD Loading Animation

                ) : (

                <div className="event-cover">

                  <img
                    src={
                      editEvent?.cover 
                        ? editEvent.cover.startsWith('data:image')
                        ? editEvent.cover 
                        : `/uploads/covers/${editEvent.cover}` 
                        : '/uploads/covers/default-cover.jpg'
                    }
                    alt="Cover"
                    style={{ objectFit: 'cover' }}
                  />

                  <button onClick={() => document.getElementById('file').click()}>
                    <svg className="edit-cover" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                      <path fill="#000" d="M11.498 5.501a1.002 1.002 0 1 1-2.003 0a1.002 1.002 0 0 1 2.003 0M2 4.5A2.5 
                      2.5 0 0 1 4.5 2h6.998a2.5 2.5 0 0 1 2.5 2.5v1.558a2.6 2.6 0 0 0-1-.023V4.5a1.5 1.5 0 0 0-1.5-1.5H4.5A1.5 
                      1.5 0 0 0 3 4.5v6.998c0 .232.052.451.146.647l3.651-3.651a1.7 1.7 0 0 1 2.404 0l.34.34l-.706.707l-.341-.34a.7.7 
                      0 0 0-.99 0l-3.651 3.65c.196.094.415.147.647.147h1.796l-.25 1H4.5a2.5 2.5 0 0 1-2.5-2.5zm11.263 2.507a1.56 1.56 
                      0 0 0-.927.447L8.05 11.742a2.8 2.8 0 0 0-.722 1.256l-.009.033l-.303 1.211a.61.61 0 0 0 .74.74l1.21-.303a2.8 2.8 
                      0 0 0 1.29-.73l4.288-4.288a1.56 1.56 0 0 0-1.28-2.654"/>
                    </svg>
                  </button>

                  <input
                    id="file"
                    type="file"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  <button onClick={handleCoverUpdate} className="submit">
                    <svg className="save-cover" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path fill="#000" d="M17 6.125v2.91A3.5 3.5 0 0 0 16.5 9H16V6.125a.97.97 0 0 0-.289-.711l-2.125-2.125A.96.96 
                      0 0 0 13 3.008V5.5a1.51 1.51 0 0 1-.922 1.383A1.3 1.3 0 0 1 11.5 7h-4a1.51 1.51 0 0 1-1.383-.922A1.3 1.3 0 0 
                      1 6 5.5V3H5a.97.97 0 0 0-.703.289a1.1 1.1 0 0 0-.219.32A.86.86 0 0 0 4 4v10a1 1 0 0 0 
                      .078.391q.079.178.211.32a.85.85 0 0 0 .313.211q.192.073.398.078v-4.5a1.51 1.51 0 0 1 
                      .922-1.383c.181-.082.379-.122.578-.117h5.992a3.5 3.5 0 0 0-2.442 1H6.5a.505.505 0 0 0-.5.5V15h3v1H5a1.9 1.9 0 
                      0 1-.758-.156a2.2 2.2 0 0 1-.64-.422A1.9 1.9 0 0 1 3 14.039V4c-.001-.26.052-.519.156-.758a2.2 2.2 0 0 1 
                      .422-.642a1.9 1.9 0 0 1 .622-.436c.24-.105.499-.16.761-.164h7.914c.262 0 
                      .523.05.766.148c.244.099.465.248.648.438l2.125 2.125c.186.185.332.405.43.648c.099.244.152.503.156.766M7 
                      3v2.5a.505.505 0 0 0 .5.5h4a.505.505 0 0 0 .5-.5V3zm3 9.5a2.5 2.5 0 0 1 2.5-2.5h4a2.5 2.5 0 0 1 2.5 2.5v4c0 
                      .51-.152.983-.414 1.379l-3.025-3.025a1.5 1.5 0 0 0-2.122 0l-3.025 3.025A2.5 2.5 0 0 1 10 16.5zm7 .25a.75.75 
                      0 1 0-1.5 0a.75.75 0 0 0 1.5 0m-5.879 5.836c.396.262.87.414 1.379.414h4c.51 0 .983-.152 
                      1.379-.414l-3.025-3.025a.5.5 0 0 0-.708 0z"/>
                    </svg>
                  </button>
                </div>
                )}

              </div>

              <div className="event-edit">

                <form className="event-form" onSubmit={handleSubmit}>

                  <div className="form-group">
                    <label htmlFor="name">Event Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editEvent.name}
                      onChange={handleChange}
                      
                    />
                  </div>

                  <div className="form-group">
                    
                    <label htmlFor="categoryName">Category</label>
                    <select
                      id="categoryName"
                      name="categoryName"
                      value={editEvent.categoryName || editEvent.category || ""}
                      onChange={handleChange}
                      
                    >
                      <option value="" disabled>
                        Select a Category
                      </option>

                      <option value="new">Create New Category</option>
                      
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>

                    {editEvent.categoryName === 'new' && (
                    <div>
                      <label htmlFor="newCategory">New Category Name</label>
                      <input
                        id="newCategory"
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                      <button className="save-catg" type="button" onClick={saveNewCategory}>
                        Save Category
                      </button>
                    </div>
                  )}

                  </div>

                  <div className="form-group">
                    <label htmlFor="status">Event Status</label>
                    <select
                      id="status"
                      name="status"
                      value={editEvent.status || ''}
                      onChange={handleChange}
                      
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      <option value="Active">Active</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={editEvent.description || ''}
                      onChange={handleChange}
                      className="description-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={editEvent.startDate}
                      onChange={handleChange}
                      
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={editEvent.endDate}
                      onChange={handleChange}
                      
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="capacity">Capacity</label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={editEvent.capacity || undefined}
                      onChange={handleChange}
                      
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="addressLine1">Address Line 1</label>
                    <input
                      type="text"
                      id="addressLine1"
                      name="addressLine1"
                      value={editEvent.addressLine1 || ''}
                      onChange={handleChange}
                      
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="addressLine2">Address Line 2</label>
                    <input
                      type="text"
                      id="addressLine2"
                      name="addressLine2"
                      value={editEvent.addressLine2 || ''}
                      onChange={handleChange}
                      
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={editEvent.postalCode || ''}
                      onChange={handleChange}
                      
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={editEvent.city || ''}
                      onChange={handleChange}
                      
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="region">Region</label>
                    <input
                      type="text"
                      id="region"
                      name="region"
                      value={editEvent.region || ''}
                      onChange={handleChange}
                      
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={editEvent.country || ''}
                      onChange={handleChange}
                      
                    />
                  </div>

                  <button type="submit" className="submit-button">
                    SAVE CHANGES
                  </button>

                  <button onClick={() => setCurrentView("menu")} className="back-button">
                    BACK
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default EditEvent;