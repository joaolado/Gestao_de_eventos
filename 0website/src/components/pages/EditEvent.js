
import React, { useState, useEffect } from 'react';

// Import Navigation
import { useNavigate, useParams } from 'react-router-dom';

// Import Toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// API - Handle Fetch Requests
import fetchAPI from '../../fetchAPI';

// CSS
import '../../App.css';
import './EditEvent.css';

const EditEvent = () => 
{
  const { id } = useParams(); // Get the Event ID from the URL

  // State Variables for Managing Edit Events
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

  // State Variables for Managing User Inputs and Fetched Data
  const [userType, setUserType] = useState(null);                        // Track User Type
  const [isInWishlist, setIsInWishlist] = useState(false);               // Track Wishlist State
  const [currentView, setCurrentView] = useState("menu");                // Current View 'menu', 'create', or 'edit'
  const [categories, setCategories] = useState([]);                      // List of Categories
  const [newCategoryName, setNewCategoryName] = useState("");            // Category Name for New Category
  const [isLoading, setIsLoading] = useState(true);                      // Determines if Data is Still Loading
  const [isEditing, setIsEditing] = useState(false);                     // Whether the User is Editing Their Event
  const [coverEdited, setCoverEdited] = useState(false);                 // Whether Cover was Edited
  const [file, setFile] = useState(null);                                // File for Uploading Event Cover

  const navigate = useNavigate(); // Hook for Navigation

  useEffect(() => 
  {
    // Fetch Wishlist
    const fetchWishlist = async () => 
    {
      try 
      {
        // Make an API Call to Get Wishlist
        const wishlistResponse = await fetchAPI('/api/v1/profile/get-wishlist');
        const updatedWishlist = wishlistResponse?.wishlist || [];
  
        // Check if the Current Event is in the Wishlist
        const isInUpdatedWishlist = updatedWishlist.some((item) => item.event?.id === editEvent.id);
        setIsInWishlist(isInUpdatedWishlist);
      } 
      
      catch (error) 
      {
        console.error('Error Fetching Wishlist:', error);
      }
    };
  
    fetchWishlist();
  }, [editEvent.id]);  // Re-run Whenever the Event ID Changes
  

  useEffect(() => 
  {
    // Fetch User Type
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
        console.error('Error Fetching User Type:', error);
      }
    };

    // Fetch Event
    const fetchEvent = async () =>
    {
      if (!id) return; // Ensure ID Exists
      
      setIsLoading(true);

      try
      {
        // Make an API Call to Get Event
        const data = await fetchAPI(`/api/v1/events/${id}`);

        // Ensure Data Contains ID
        if (!data.id) {
          console.error("Event ID not Found in API Response.");
          setIsLoading(false);
          return;
        }

        // Update the Event State With the Fetched Data
        setEditEvent((prevEvent = {}) => ({

          ...prevEvent,
          ...data,
          id: data.id,
          startDate: data.startDate,  
          endDate: data.endDate,      
          capacity: data.capacity ?? null,

          tickets: {
            price: data.tickets?.price ?? null,
            quantity: data.tickets?.quantity ?? null,
          },
          
          // Fetched Event Cover if Available
          cover: data.cover || prevEvent.cover,

          // Set the Category Name
          categoryName: data.category ? data.category.name : "",

          // Merge the Fetched Tickets Data
          tickets: {

            ...prevEvent.tickets,
            ...data.tickets,
          },
        }));

        setIsLoading(false);
      } 
      
      catch (error) 
      {
        console.error('Error Fetching Event:', error);
        setIsLoading(false);
      }
    };  

    fetchUserType();
    fetchEvent();
  }, [id]);

  
  useEffect(() => 
  {
    // Fetch Events Categories
    const fetchCategories = async () => 
    {
      try 
      {
        // Make an API Call to Get Events Categories
        const response = await fetchAPI('/api/v1/eventsCategory');
        setCategories(response);
      } 
      
      catch (error) 
      {
        console.error('Error Fetching Categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Handle Input Changes and Update Event Data
  const handleChange = (e) => 
  {
    const { name, value } = e.target;

    // Mark Cover as Edited if Cover Change
    if (name === 'cover') setCoverEdited(true);

    if (name === "categoryName") 
    {
      // Find the Category by Name
      const selectedCategory = categories.find((cat) => cat.name === value);
  
      // If the Category Exists, Set the Category ID (Not Just the Name)
      if (selectedCategory) 
      {
        setEditEvent((prevEvent) => ({

          ...prevEvent,
          category: selectedCategory.name,
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

    if (name === 'status') 
    {
      setEditEvent((prevEvent) => ({

        ...prevEvent,
        status: value,
      }));
    }
    
    // Update Other Fields Directly in the Event State
    else 
    { 
      setEditEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
    }
  };

  // Format a Date String Into ISO Format
  const formatDateToISO = (dateTime) => 
  {
    if (!dateTime) return null;
  
    const [date, time] = dateTime.split('T');
    const validTime = time || '00:00:00';
    const isoString = `${date}T${validTime}`;
  
    // Ensure Date and Time are Valid
    const parsedDate = new Date(isoString);

    if (isNaN(parsedDate.getTime())) 
    {
      console.error('Invalid DateTime:', isoString);
      return null;
    }
  
    return isoString;
  };
  
  // Extract the Date From an ISO String (yyyy-MM-dd)
  const extractDate = (isoString) => 
  {
    if (!isoString) return "N/A";
    const date = new Date(isoString);

    if (isNaN(date)) return "Invalid Date.";
    return date.toISOString().split('T')[0];
  };
  
  // Extract the Time From an ISO String (hh:mm)
  const extractTime = (isoString) => 
  {
    if (!isoString) return "N/A";
    const date = new Date(isoString);

    if (isNaN(date.getTime())) return "Invalid Time.";
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  // Format Date for Display (dd/mm/yyyy)
  const formatDateDisplay = (isoString) => 
  {
    if (!isoString) return 'N/A';
    
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  };  
  
  // Format Time for Display (hh:mm)
  const formatTimeDisplay = (isoString) => 
  {
    if (!isoString) return 'N/A';
  
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${hours}:${minutes}`;
  };
  
  // Create New Category
  const saveNewCategory = async () => 
  {
    // Don't Proceed if the Category Name is Empty
    if (!newCategoryName) return;

    try 
    {
      // Make an API Call to Create New Category
      const response = await fetchAPI('/api/v1/eventsCategory/create', 
      {
        method: 'POST',
        body: JSON.stringify({ name: newCategoryName }),
      });

      // If the Category was Successfully Created, Update the UI
      if (response.success) 
      {
        toast.success('Category Created Successfully.');

        // Add the New Created Category 
        setCategories((prevCategories) => [

          ...prevCategories,
          { id: response.categoryId, name: newCategoryName },
        ]);

        setEditEvent((prev) => ({ ...prev, categoryName: newCategoryName }));
      } 
      
      else 
      {
        toast.error('Error Creating Category.');
      }
    } 
    
    catch (error) 
    {
      console.error('Error Saving New Category:', error);
      toast.error('Error Saving New Category.');
    }
  };

  // Update Category
  const updateCategory = async (categoryId, updatedName) => 
  {
    // Don't Proceed if the Updated Name is Empty
    if (!updatedName) return;

    try 
    {
        // Make an API Call to Update the Category
        const response = await fetchAPI(`/api/v1/eventsCategory/update/${categoryId}`, 
        {
            method: 'PUT',
            body: JSON.stringify({ name: updatedName }),
        });

        // If the Category was Successfully Updated, Update the UI
        if (response.success) 
        {
            toast.success('Category Updated Successfully.');

            // Update the Category in the State
            setCategories((prevCategories) =>

                prevCategories.map((category) =>
                    category.id === categoryId ? { ...category, name: updatedName } : category
                )
            );
        } 
        
        else 
        {
            toast.error('Error Updating Category.');
        }
    } 
    
    catch (error) 
    {
        console.error('Error Updating Category:', error);
        toast.error('Error Updating Category.');
    }
  };

  // Delete Category
  const deleteCategory = async (categoryId) => 
  {
    try 
    {
        // Make an API Call to Delete the Category
        const response = await fetchAPI(`/api/v1/eventsCategory/delete/${categoryId}`, 
        {
            method: 'DELETE',
        });

        // If the Category was Successfully Deleted, Update the UI
        if (response.success) 
        {
            toast.success('Category Deleted Successfully.');

            // Remove the Deleted Category from the State
            setCategories((prevCategories) =>

                prevCategories.filter((category) => category.id !== categoryId)
            );
        } 
        
        else 
        {
            toast.error('Error Deleting Category.');
        }
    } 
    
    catch (error) 
    {
        console.error('Error Deleting Category:', error);
        toast.error('Error Deleting Category.');
    }
  };

  // Get the ID of the Selected Category
  const getSelectedCategoryId = () => 
  {
    const selectedCategory = categories.find((cat) => cat.name === editEvent.categoryName);

    return selectedCategory?.id || null;
  };

  // Validate the Form Before Submitting
  const validateForm = () => 
  {
    if (!editEvent.name.trim()) 
    {
      toast.error('Event Name is Required.');
      return false;
    }

    if (!editEvent.startDate || !editEvent.endDate) 
    {
      toast.error('Start and End Dates are Required.');
      return false;
    }

    if (editEvent.capacity && isNaN(editEvent.capacity)) 
    {
      toast.error('Capacity Must be a Number.');
      return false;
    }

    if (editEvent.categoryName && !categories.some((cat) => cat.name === editEvent.categoryName)) 
    {
      toast.error('Please Select a Valid Category.');
      return false;
    }

    return true;
  };
  
  // Handle Form Submission to Update the Event
  const handleSubmit = async (e) => 
  {
    e.preventDefault(); // Prevent the Default Form Submit Action

    if (!validateForm()) return; // Check Validation
    
    // Create the Updated Event Data to Send in the Request Body
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
      status: editEvent.status,

      price: editEvent.tickets.price ? parseInt(editEvent.tickets.price, 10) : null,
      quantity: editEvent.tickets.quantity ? parseInt(editEvent.tickets.quantity, 10) : null,
    };

    // Only include ID if it exists (for updates)
    if (editEvent.id) { updatedEvent.id = editEvent.id; } 
    
    // Ensure Tickets Data is Included
    if (!updatedEvent.tickets) updatedEvent.tickets = editEvent.tickets;
    
    try 
    {
      // Make the API Call to Update the Event
      const response = await fetchAPI('/api/v1/events/edit', 
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(updatedEvent),
      });
  
      // If the Event was Successfully Updated, Update the UI
      if (response.success) 
      {
        toast.success('Event Updated Successfully.');
        setCurrentView("menu");
        setIsEditing(false);        
        setCoverEdited(false); 
      } 
      
      else 
      {
        toast.error('Event Update failed.' + response.message);
      }

    } 
    
    catch (error) 
    {
      console.error('Error Updating Event.', error);
      toast.error('Failed to Update Event.');
    }
  };

  // Handle File Selection for Event Cover Update
  const handleFileChange = (e) => 
  {
    // Get the Selected File
    const file = e.target.files[0];

    // Store the File in the State
    setFile(file);

    if (file) 
    {
      // Create a FileReader to Preview the Image
      const reader = new FileReader(); 

      reader.onload = () =>

        // Once the file is Read Successfully, Update the cover in the Event State
        setEditEvent((prev) => ({ 
          
          ...prev, 
          cover: reader.result,
          id: prev.id || id,
        }));

      // Read the File as a Data URL (For Image Preview)
      reader.readAsDataURL(file);
    }
  };

  // Handle Event Cover Update on Form Submission
  const handleCoverUpdate = async (e) => 
  {
    if (!id) return; // Ensure ID Exists
    
    e.preventDefault();  // Prevent the Default Form Submit Action

    // Ensure ID Exists Before Proceeding
    if (!editEvent.id) {
      toast.error('Event ID is Missing.');
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

    // Append the Event ID and the Selected File
    formData.append('id', editEvent.id);
    formData.append('cover', file);

    try 
    {
      // Make the API Call to Update the Event Cover
      const response = await fetchAPI('/api/v1/events/edit', 
      {
        method: 'PUT',
        body: formData,
      });
      
      // If the Cover Update is Successful, Update the UI
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
    } 
    
    catch (error) 
    {
      console.error('Error Updating Event Cover ', error);
      toast.error('Error Updating Event Cover.');
    }
  };

  // Reset the Edit Event to Empty when Creating a New Event
  const handleCreateEvent = () => 
  {
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
      status: "",
      tickets: { price: "", quantity: "" }

    });
    
    // Switch to the "create" View
    setCurrentView("create");
  };

  // Handle the Change of Start or End Date
  const handleDateChange = (e) => 
  {
    const { name, value } = e.target;

    setEditEvent((prev) => 
    {
      const existingTime = prev[name]?.split('T')[1] || '00:00:00';

      return {

        ...prev,
        [name]: `${value}T${existingTime}`,
      };
    });
  };
  
  // Handle the Change of Start or End Time 
  const handleTimeChange = (e) => 
  {
    const { name, value } = e.target;
    const field = name.replace('Time', 'Date');

    setEditEvent((prev) => 
    {
      const existingDate = prev[field]?.split('T')[0] || new Date().toISOString().split('T')[0];

      return {

        ...prev,
        [field]: `${existingDate}T${value}`,
      };
    });
  };
  
  // Handle Soft Delete Event
  const handleSoftDelete = async () => 
  {
    try 
    {
      // Make an API Call to Soft Delete Event
      const response = await fetchAPI(`/api/v1/events/delete/${id}`, 
      {
        method: 'DELETE',
      });


      if (response?.message) 
      {
        toast.success('Event Deleted Successfully.');

        // Go Back to the Menu View
        setCurrentView('menu'); 
      }
      
      else 
      {
        toast.error('Failed to Delete Event.');
      }
    } 
    
    catch (error) 
    {
      console.error('Error Deleting Event:', error);
      toast.error('An Error Occurred While Deleting the Event.');
    }
  };

  // Handle Restore Event
  const handleRestoreEvent = async () => 
  {
    try 
    {
      // Make an API Call to Restore Event
      const response = await fetchAPI(`/api/v1/events/restore/${id}`, 
      {
        method: 'PATCH',
      });

      if (response?.message) 
      {
        toast.success('Event Restored Successfully.');

        // Go Back to the Menu View
        setCurrentView('menu');
      } 
      
      else 
      {
        toast.error('Failed to Restore Event.');
      }
    } 
    
    catch (error) 
    {
      console.error('Error Restoring Event:', error);
      toast.error('An Error Occurred While Restoring the Event.');
    }
  };

  // Toggle Wishlist (Add or Remove From Wishlist)
  const toggleWishlist = async () => 
  {
    try 
    {
      if (!editEvent.id) 
      {
        toast.error('Event ID is Missing. Unable to Add or Remove from Wishlist.');
        return;
      }
  
      let response;
  
      // Add to wishlist
      if (!isInWishlist) 
      {
        response = await fetchAPI('/api/v1/profile/add-to-wishlist', 
        {
          method: 'POST',
          body: JSON.stringify({ eventId: editEvent.id }),
        });

        toast.success('Added to Wishlist.');
      } 
      
      // Remove from wishlist
      else 
      {
        response = await fetchAPI('/api/v1/profile/remove-from-wishlist', 
        {
          method: 'DELETE',
          body: JSON.stringify({ eventId: editEvent.id }),
        });

        toast.success('Removed from Wishlist.');
      }
  
      // Refetch Wishlist to Get the Updated Status
      const wishlistResponse = await fetchAPI('/api/v1/profile/get-wishlist');
      const updatedWishlist = wishlistResponse?.wishlist || [];
  
      // Check if the Event is Present in the Updated Wishlist
      const isInUpdatedWishlist = updatedWishlist.some((item) => item.event?.id === editEvent.id);
  
      setIsInWishlist(isInUpdatedWishlist);
    } 

    catch (error) 
    {
      toast.error(error.message || 'Failed to Update Wishlist.');
    }
  };

  //-----------------------------------------------------------------------------------------------------------------
  // FRONTEND
  //-----------------------------------------------------------------------------------------------------------------
  return (

      <div className="event-page-container">

        {currentView === "menu" && (
          <div className="edit-event-container">
            <div className="event-header">

              <button onClick={() => navigate('/explore')} className="explore-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="#fff" d="M9.857 15.962a.5.5 0 0 0 .243.68l9.402 4.193c1.496.667 
                    3.047-.814 2.306-2.202l-3.152-5.904c-.245-.459-.245-1 0-1.458l3.152-5.904c.741-1.388-.81-2.87-2.306-2.202l-3.524 
                    1.572a2 2 0 0 0-.975.932z"/>
                  <path fill="#fff" d="M8.466 15.39a.5.5 0 0 1-.65.233l-4.823-2.15c-1.324-.59-1.324-2.355 
                    0-2.945L11.89 6.56a.5.5 0 0 1 .651.68z" opacity="0.5"/>
                </svg>
                <p>BACK TO EXPLORE</p>
              </button>

              <h1 className="event-title">EVENT: <span>{editEvent.name || "N/A"}</span></h1>

              <button onClick={toggleWishlist} className="wishlist-button">
                {isInWishlist ? 
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path  d="M22 10.1c.1-.5-.3-1.1-.8-1.1l-5.7-.8L12.9 
                    3c-.1-.2-.2-.3-.4-.4c-.5-.3-1.1-.1-1.4.4L8.6 8.2L2.9 
                    9q-.45 0-.6.3c-.4.4-.4 1 0 1.4l4.1 4l-1 5.7c0 .2 0 
                    .4.1.6c.3.5.9.7 1.4.4l5.1-2.7l5.1 2.7c.1.1.3.1.5.1h.2c.5-.1.9-.6.8-1.2l-1-5.7l4.1-4c.2-.1.3-.3.3-.5"/>
                  </svg>
                  : 
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path  d="M21.919 10.127a1 1 0 0 0-.845-1.136l-5.651-.826l-2.526-5.147a1.037 1.037 
                    0 0 0-1.795.001L8.577 8.165l-5.651.826a1 1 0 0 0-.556 1.704l4.093 4.013l-.966 5.664a1.002 1.002 0 
                    0 0 1.453 1.052l5.05-2.67l5.049 2.669a1 1 0 0 0 1.454-1.05l-.966-5.665l4.094-4.014a1 1 0 0 0 
                    .288-.567m-5.269 4.05a.5.5 0 0 0-.143.441l1.01 5.921l-5.284-2.793a.5.5 0 0 0-.466 0L6.483 
                    20.54l1.01-5.922a.5.5 0 0 0-.143-.441L3.07 9.98l5.912-.864a.5.5 0 0 0 .377-.275L12 3.46l2.64 5.382a.5.5 
                    0 0 0 .378.275l5.913.863z"/>
                  </svg> 
                }
              </button>

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
                    <span>{editEvent.startDate ? formatDateDisplay(editEvent.startDate) : 'N/A'}</span>
                  </div>

                  <div className="form-group">
                    <label>End Date</label>
                    <span>{editEvent.endDate ? formatDateDisplay(editEvent.endDate) : 'N/A'}</span>
                  </div>

                  <div className="form-group">
                    <label>Start Time</label>
                    <span>{editEvent.startDate ? formatTimeDisplay(editEvent.startDate) : 'N/A'}</span>
                  </div>

                  <div className="form-group">
                    <label>End Time</label>
                    <span>{editEvent.endDate ? formatTimeDisplay(editEvent.endDate) : 'N/A'}</span>
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

                <div className="event-form event-form-span">

                  {['UserAdmin', 'UserSuperAdmin'].includes(userType) && (
                    <>             
                      <div className="menu-div button-box-c-e">
                        <button onClick={handleCreateEvent} className="menu-button">
                          CREATE EVENT
                        </button>

                        <button onClick={() => setCurrentView("edit")} className="menu-button">
                          EDIT EVENT
                        </button>
                      </div>
                    </>
                  )}
                  
                </div>
              </div>
            </div>
          </div>

          
        )}
  
        {currentView === "create" && (
          <div className="edit-event-container">

            <div className="event-header-c-e">
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
                    <label htmlFor="name">Event Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editEvent.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">                  
                    <label htmlFor="categoryName">Category *</label>
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

                    {editEvent.categoryName === 'new' && (
                      <div>
                        <label htmlFor="newCategory">New Category Name</label>
                        <input
                          id="newCategory"
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                        />

                        <button 
                          className="save-catg" 
                          type="button" 
                          onClick={saveNewCategory}
                          >
                          Create Category
                        </button>
                      </div>
                    )}

                    {editEvent.categoryName && editEvent.categoryName !== "new" && (
                      <div>
                        <label htmlFor="updateCategory">Update Category Name</label>
                        <input
                          id="updateCategory"
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                        />

                        <button
                          className="save-catg edit-catg"
                          type="button"
                          onClick={() => updateCategory(getSelectedCategoryId(), newCategoryName)}
                          >
                          Update Category
                        </button>

                        <button
                          className="save-catg"
                          type="button"
                          onClick={() => deleteCategory(getSelectedCategoryId())}
                          >
                          Delete Category
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
                    <label htmlFor="startDate">Start Date *</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={editEvent.startDate ? extractDate(editEvent.startDate) : ''}
                      onChange={handleDateChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endDate">End Date *</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={editEvent.endDate ? extractDate(editEvent.endDate) : ''}
                      onChange={handleDateChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="startTime">Start Time</label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={editEvent.startDate ? extractTime(editEvent.startDate) : ''}
                      onChange={handleTimeChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endTime">End Time</label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={editEvent.endDate ? extractTime(editEvent.endDate) : ''}
                      onChange={handleTimeChange}
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

                  <div className="button-box">
                    <button type="submit" className="submit-button">
                      SAVE
                    </button>

                    <button onClick={() => setCurrentView("menu")} className="back-button">
                      BACK
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
  
        {currentView === "edit" && (
          <div className="edit-event-container">

            <div className="event-header-c-e">
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
                    <label htmlFor="name">Event Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editEvent.name}
                      onChange={handleChange}                      
                    />
                  </div>

                  <div className="form-group">                  
                    <label htmlFor="categoryName">Category *</label>
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

                        <button 
                          className="save-catg" 
                          type="button" 
                          onClick={saveNewCategory}
                          >
                          Create Category
                        </button>
                      </div>
                    )}

                    {editEvent.categoryName && editEvent.categoryName !== "new" && (
                      <div>
                        <label htmlFor="updateCategory">Update Category Name</label>
                        <input
                          id="updateCategory"
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                        />

                        <button
                          className="save-catg edit-catg"
                          type="button"
                          onClick={() => updateCategory(getSelectedCategoryId(), newCategoryName)}
                          >
                          Update Category
                        </button>

                        <button
                          className="save-catg"
                          type="button"
                          onClick={() => deleteCategory(getSelectedCategoryId())}
                          >
                          Delete Category
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
                    <label htmlFor="startDate">Start Date *</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={editEvent.startDate ? extractDate(editEvent.startDate) : ''}
                      onChange={handleDateChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endDate">End Date *</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={editEvent.endDate ? extractDate(editEvent.endDate) : ''}
                      onChange={handleDateChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="startTime">Start Time</label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={editEvent.startDate ? extractTime(editEvent.startDate) : ''}
                      onChange={handleTimeChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endTime">End Time</label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={editEvent.endDate ? extractTime(editEvent.endDate) : ''}
                      onChange={handleTimeChange}
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

                  <div className="button-box">
                    <button type="submit" className="submit-button">
                      SAVE
                    </button>

                    <button onClick={() => setCurrentView("menu")} className="back-button">
                      BACK
                    </button>

                    <div className="button-line">
                      <hr />
                    </div>

                    <button onClick={handleSoftDelete} className="back-button">
                      DELETE
                    </button>

                    <button onClick={handleRestoreEvent} className="back-button">
                      RESTORE
                    </button>
                  </div>                
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default EditEvent;