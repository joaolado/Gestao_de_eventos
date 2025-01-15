
import React, { useState, useEffect } from 'react';

// Import Navigation & Modal
import ReactModal from 'react-modal';
import { useNavigate } from 'react-router-dom'; 

// Import Toast
import { toast } from 'react-toastify';         
import 'react-toastify/dist/ReactToastify.css';

// Import Calendar
import MyCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// API - Handle Fetch Requests
import fetchAPI from '../../fetchAPI';

// CSS
import '../../App.css';
import './Dashboard.css';

// Configure Modal Root Element
ReactModal.setAppElement('#root');

const Dashboard = () => 
{
  // State Variables for Managing Profiles
  const [profile, setProfile] = useState({

    profilePic: '',
    userName: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',

    address: {
      addressLine1: '',
      addressLine2: '',
      postalCode: '',
      city: '',
      region: '',
      country: ''
    },

    userPassword: ''

  });

  // State Variables for Managing User Inputs and Fetched Data
  const [isLoading, setIsLoading] = useState(true);                // Tracks if Data is Loading
  const [wishlist, setWishlist] = useState([]);                    // Stores User Wishlist
  const [sharedEvents, setSharedEvents] = useState([]);            // Stores Events Shared With User
  const [activeSection, setActiveSection] = useState('profile');   // Current UI Section Being Displayed
  const [isEditing, setIsEditing] = useState(false);               // Tracks if User is Editing Profile
  const [emailEdited, setEmailEdited] = useState(false);           // Tracks if Email was Edited
  const [passwordEdited, setPasswordEdited] = useState(false);     // Tracks if Password was Edited
  const [profilePicEdited, setProfilePicEdited] = useState(false); // Tracks if Profile Picture was Edited
  const [file, setFile] = useState(null);                          // Stores Selected Profile Picture File for Upload
  const [isModalOpen, setIsModalOpen] = useState(false);           // Controls Remove from Wishlist Modal Visibility
  const [selectedEventId, setSelectedEventId] = useState(null);    // Stores Selected Event ID for Sharing
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // Controls Sharing modal Visibility
  const [email, setEmail] = useState('');                          // Email for Event Sharing
  const [message, setMessage] = useState('');                      // Message for Event Sharing
  const [isCalModalOpen, setIsCalModalOpen] = useState(false);     // Controls Calendar modal Visibility
  const [selectedDate, setSelectedDate] = useState(new Date());    // Tracks Selected Date in Calendar
  const [eventsOnDate, setEventsOnDate] = useState([]);            // Stores Events for the Selected Date
  const [eventDates, setEventDates] = useState([]);                // Stores All Event Dates for Calendar

  const navigate = useNavigate(); // Hook for Navigation

  // Redirect to /dashboard on Page Reload
  useEffect(() => 
  {
    const navigationType = window.performance.getEntriesByType('navigation')[0]?.type || window.performance.navigation.type;

    // If Page Reloaded, Redirect to Dashboard
    if (navigationType === 'reload') 
    {
      navigate('/dashboard');
    }

  }, [navigate]);

  useEffect(() => 
  {
    // Fetch Profile
    const fetchProfile = async () =>
    {
      setIsLoading(true); 

      try 
      {
        // Make an API Call to Get Profile
        const data = await fetchAPI('/api/v1/profile/get-profile');

        // Update the Profile State With the Fetched Data
        setProfile((prevProfile = {}) => ({

          ...prevProfile,
          ...data,
          
          // Use the Fetched Profile Picture if Available
          profilePic: data.profilePic || prevProfile.profilePic,

          // Merge the Fetched Address Data With the Existing Address Data
          address: {
            ...prevProfile.address,
            ...data.address,
          },
        }));

        setIsLoading(false);
      } 
      
      catch (error) 
      {
        console.error('Error Fetching Profile:', error);
        setIsLoading(false);
      }
    };

    // Fetch Wishlist
    const fetchWishlist = async () => 
    {
      try 
      { 
        // Make an API Call to Get Profile Wishlist
        const data = await fetchAPI('/api/v1/profile/get-wishlist');

        setWishlist(data.wishlist);

        // Extract Dates from Wishlist Events to Highlight on the Calendar
        const eventDates = data.wishlist.map(item => ({

          startDate: new Date(item.event.startDate),
          endDate: new Date(item.event.endDate),
        }));

        setEventDates(eventDates);
      } 

      catch (error) 
      {
        console.error('Error Fetching Wishlist:', error);
      }
    };

    // Fetch Shared Events
    const fetchSharedEvents = async () => 
    {
      try 
      {
        // Make an API Call to Get Profile Shared Events
        const data = await fetchAPI('/api/v1/profile/get-shared-events');

        setSharedEvents(data.sharedEvents);
      } 
      
      catch (error) 
      {
        console.error('Error Fetching Shared Events:', error);
      }
    };

    fetchProfile();
    fetchWishlist();
    fetchSharedEvents();

  }, []);

  // Handle Input Changes and Update Profile Data
  const handleChange = (e) => 
  { 
    const { name, value } = e.target; 
    
    // Set Flags for Specific Fields When They are Edited
    if (name === 'userPassword') setPasswordEdited(true);
    if (name === 'email') setEmailEdited(true);
    if (name === 'profilePic') setProfilePicEdited(true);
    
    // Check if the Input Field is Part of the Address Object
    if (name.startsWith('address.')) 
    {
      const addressKey = name.split('.')[1]; // Extract Address Field Key

      // Update the Corresponding Address Field in the Profile State
      setProfile((prevProfile) => ({
        ...prevProfile,

        address: {
          ...prevProfile.address,
          [addressKey]: value,
        },

      }));
    } 
    
    else 
    { 
      // Update Other Fields Directly in the Profile State
      setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    }
  };
  
  // Handle Form Submission to Update the Profile
  const handleSubmit = async (e) => 
  {
    e.preventDefault(); // Prevent the Default Form Submit Action

    // Create the Updated Profile Data to Send in the Request Body
    const updatedProfile = 
    {
      userName: profile.userName,
      userPassword: profile.userPassword,
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      email: profile.email,
      addressLine1: profile.address.addressLine1,
      addressLine2: profile.address.addressLine2,
      postalCode: profile.address.postalCode,
      city: profile.address.city,
      region: profile.address.region,
      country: profile.address.country
    };
    
    // Validate if the Email Match
    if (emailEdited && profile.email !== profile.doubleCheckEmail) 
    {
      toast.info('Emails do not Match.');
      return;
    }
    
    // Validate if the Password Match
    if (passwordEdited && profile.userPassword !== profile.doubleCheckPassword) 
    {
      toast.info('Passwords do not Match.');
      return;
    }
  
    // Ensure Address is Part of Updated Profile
    if (!updatedProfile.address) updatedProfile.address = profile.address;
    
    // Only Include userPassword if Changed
    if (!passwordEdited || !profile.userPassword) delete updatedProfile.userPassword;
  
    try 
    { 
      // Make the API Call to Update the Profile
      const response = await fetchAPI('/api/v1/profile/update', 
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile),
      });
      
      if (response.success) 
      {
        toast.success('Profile Updated Successfully.');
        setIsEditing(false);         
        setEmailEdited(false);      
        setPasswordEdited(false);    
        setProfilePicEdited(false); 
      } 
      
      else 
      {
        toast.error('Profile Update failed.' + response.message);
      }

      // Redirect to the Dashboard
      navigate('/dashboard');
    } 
    
    catch (error) 
    {
      console.error('Error Updating Profile.', error);
      toast.error('Failed to Update Profile.');
    }
  };  

  // Toggle Edit Mode when the "Edit" Button is Clicked
  const toggleEdit = () => setIsEditing(true);
  
  // Close Edit Mode and Reset Edit Flags
  const closeEdit = () => 
  {
    setIsEditing(false);
    setEmailEdited(false);
    setPasswordEdited(false);
    setProfilePicEdited(false);
  };

  // Render Buttons Based on Whether the Profile is Being Edited
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

  // Handle File Selection for Profile Picture Update 
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

        // Once the file is Read Successfully, Update the profilePic in the Profile State
        setProfile((prev) => ({ 
          
          ...prev, 
          profilePic: reader.result 
        }));

      // Read the File as a Data URL (For Image Preview)
      reader.readAsDataURL(file);
    }
  };

  // Handle Profile Picture Update on Form Submission
  const handleProfilePicUpdate = async (e) => 
  {
    e.preventDefault();  // Prevent the Default Form Submit Action
    
    // Check if a File is Selected
    if (!file) 
    {
      toast.info('Please Select a File to Upload.');
      return;
    }
    
    // Create a FormData Object for Image File
    const formData = new FormData();

    // Append the ProfilePic
    formData.append('profilePic', file);
  
    try 
    {
      // Make the API Call to Update the Profile Picture
      const response = await fetchAPI('/api/v1/profile/update', 
      {
        method: 'PUT',
        body: formData,
      });

      // If the Profile Picture Update is Successful, Update the UI
      if (response.success) 
      {
        toast.success('Profile Picture Updated Successfully.');
        
        // Fetch Updated Profile Data to Refresh the UI
        const updatedProfileData = await fetchAPI('/api/v1/profile/get-profile');

        // Update the Profile State With the New Profile Picture
        setProfile((prevProfile) => ({

          ...prevProfile,
          profilePic: updatedProfileData.profilePic || prevProfile.profilePic,

        }));
      } 
      
      else 
      {
        toast.error('Failed to Update Profile Picture.');
      }

      // Redirect to the Dashboard
      navigate('/dashboard');
    } 
    
    catch (error) 
    {
      console.error('Error Updating Profile Picture.', error);
      toast.error('Error Updating profile Picture.');
    }
  };

  // Open Remove from Wishlist Modal
  const openModal = (eventId) => 
  {
    setSelectedEventId(eventId);
    setIsModalOpen(true);
  };

  // Close Remove from Wishlist Modal
  const closeModal = () => 
  {
    setIsModalOpen(false);
    setSelectedEventId(null);
  };

  // Remove From Wishlist
  const handleRemoveFromWishlist = async () => 
  {
    try 
    {
      // Make the API Call to Remove from Wishlist
      await fetchAPI('/api/v1/profile/remove-from-wishlist', 
      {
        method: 'DELETE',
        body: JSON.stringify({ eventId: selectedEventId }),
        headers: { 'Content-Type': 'application/json' },
      });

      // Update Wishlist State by Filtering out the Removed Event
      setWishlist((prevWishlist) =>

        prevWishlist.filter((item) => item.event.id !== selectedEventId)
      );

      toast.success('Event Removed from Wishlist.');
    } 
    
    catch (error) 
    {
      toast.error('Error Removing Event from Wishlist.');
    } 
    
    finally 
    {
      closeModal();
    }
  };

  // Open Share Modal
  const openShareModal = (eventId) => 
  {
    setSelectedEventId(eventId); // Store the Selected Event ID
    setIsShareModalOpen(true);   // Open the Share Modal
  };

  // Close Share Modal
  const closeShareModal = () => 
  {
    setIsShareModalOpen(false);  // Close the Share Modal
    setSelectedEventId(null);    // Clear the Selected Event ID
    setEmail('');                // Reset Email Input
    setMessage('');              // Reset Message Input
  };

  // Handle Share Event
  const handleShareEvent = async (eventId) => 
  {
    // Ensure Email is Provided
    if (!email) 
    {
      toast.error("Email is Required.");
      return;
    }
  
    try 
    {
      // Make the API Call to Share the Event
      const response = await fetchAPI('/api/v1/profile/share-event', 
      {
        method: 'POST',
        body: JSON.stringify({

          senderId: profile.id,
          receiverEmail: email,
          eventId,
          message,
        }),

        headers: { 'Content-Type': 'application/json' },
      });
  
      toast.success("Event Shared Successfully.");
      closeShareModal();
    } 
    
    catch (error) 
    {
      console.error("Error Sharing Event:", error);
      toast.error("Failed to Share the Event, Email Probably Incorrect, Try Again.");
    }
  };
  
  // Prepare Event Data for Calendar Display
  const events = wishlist.map((item) => ({

    title: item.event.name,
    startDate: new Date(item.event.startDate),
    endDate: new Date(item.event.endDate),
  }));

  // Open the Calendar Modal
  const openCalendarModal = () => 
  {
    setIsCalModalOpen(true);
  };

  // Close the Calendar Modal
  const closeCalendarModal = () => 
  {
    setIsCalModalOpen(false);
  };
  
  // Normalize Date to Remove the Time Part (Set Time to Midnight)
  const normalizeDate = (date) => 
  {
    return new Date(date.setHours(0, 0, 0, 0));
  };
  
  // Assign CSS Class to Calendar Tile Based on Event Dates
  const tileClassName = ({ date, view }) => 
  {
    // Apply Logic Only if the View is 'month'
    if (view === 'month') 
    {

      const normalizedCurrentDate = normalizeDate(new Date(date));

      for (let i = 0; i < eventDates.length; i++) 
      {
        const { startDate, endDate } = eventDates[i];
  
        const normalizedStartDate = normalizeDate(new Date(startDate));
        const normalizedEndDate = normalizeDate(new Date(endDate));
        
        // Compare Normalized Dates
        if (
          normalizedCurrentDate >= normalizedStartDate && 
          normalizedCurrentDate <= normalizedEndDate
        ) 
        
        {
          // Apply 'highlighted-date' Class if the Date is Within the Event Range
          return 'highlighted-date';
        }
      }
    }
  };

  // Handle Date Change in Calendar (for Events on the Selected Date)
  const onDateChange = (date) => 
  {
    setSelectedDate(date);
    
    // Normalize the Selected Date
    const normalizedSelectedDate = normalizeDate(new Date(date));
    
    // Filter Events that Fall on the Selected Date
    const eventsForSelectedDate = events.filter((event) => 
    {
      const normalizedStartDate = normalizeDate(new Date(event.startDate));
      const normalizedEndDate = normalizeDate(new Date(event.endDate));
      
      return normalizedSelectedDate >= normalizedStartDate && normalizedSelectedDate <= normalizedEndDate;
    });
    
    setEventsOnDate(eventsForSelectedDate);
  };

  //-----------------------------------------------------------------------------------------------------------------
  // FRONTEND
  //-----------------------------------------------------------------------------------------------------------------
  return (

    <div className="dashboard">
      <div className="side-menu">

        {isLoading ? (

          <div>Loading...</div> // ADD Loading Animation

        ) : (

          <div className="profile-pic">
            <img

              src={
                profile?.profilePic 
                  ? profile.profilePic.startsWith('data:image')
                  ? profile.profilePic 
                  : `/uploads/profilePic/${profile.profilePic}` 
                  : '/uploads/profilePic/default-pic.png'
              }

              alt="Profile"
              style={{ objectFit: 'cover' }}
            />

            <button onClick={() => document.getElementById('file').click()}>
              <svg className="edit-pic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
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

            <button onClick={handleProfilePicUpdate} className="submit">
              <svg className="save-pic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
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

        <div><h4>WELCOME!</h4></div>
        <div className="type">{profile.usersType}</div>
        <div className="email">{profile.email}</div>

        <ul>
          <li 
            className={activeSection === 'profile' ? 'active' : ''}
            onClick={() => setActiveSection('profile')}
            >Profile
          </li>

          <li 
            className={activeSection === 'address' ? 'active' : ''}
            onClick={() => setActiveSection('address')}
            >Address
          </li>

          <li 
            className={activeSection === 'security' ? 'active' : ''}
            onClick={() => setActiveSection('security')}
            >Security
          </li>

          <li 
            className={activeSection === 'wishlist' ? 'active' : ''}
            onClick={() => setActiveSection('wishlist')}
            >Wishlist
          </li>

          <li 
            className={activeSection === 'sharedEvents' ? 'active' : ''}
            onClick={() => setActiveSection('sharedEvents')}
            >Shared Events
          </li>
        </ul>
      </div>
      
      <div className="content">
        {activeSection === 'profile' && (
          <div className="section-box">
            <div className="section">

              <div className="section-header">
                <h2 className="section-title">PROFILE</h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-col">
                    <label>User Name</label>
                    <input 
                      type="text" 
                      name="userName" 
                      value={profile.userName || ''} 
                      onChange={handleChange} 
                      pattern="[a-zA-Z0-9_]{3,20}" 
                      title="Username | Length 3-20 Characters | Only Allowed (a-z), (A-Z), (0-9), (_)"
                      minLength={3}
                      maxLength={20}
                      placeholder="User_Name"
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="form-col">
                    <label>First Name</label>
                    <input 
                      type="text" 
                      name="firstName" 
                      value={profile.firstName || ''} 
                      onChange={handleChange} 
                      placeholder="John" 
                      disabled={!isEditing} 
                    />
                  </div>

                  <div className="form-col">
                    <label>Last Name</label>
                    <input 
                      type="text" 
                      name="lastName" 
                      value={profile.lastName || ''} 
                      onChange={handleChange} 
                      placeholder="Doe" 
                      disabled={!isEditing} 
                    />
                  </div>

                  <div className="form-col phone">
                    <label>Phone</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={profile.phone || ''} 
                      onChange={handleChange}
                      onInput={(e) => e.target.value = e.target.value.replace(/[^+\d]/g, '')} // Remove Invalid Characters
                      pattern="^\+?\d{1,15}$" 
                      title="Phone Number | Optional '+' | Followed by Up to 15 digits" 
                      maxLength={16}
                      placeholder="+351963321123"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-col">
                    <label>Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={profile.email || ''} 
                      onChange={handleChange}
                      pattern="^[^@\s]+@[^@\s]+\.(com|pt)$" 
                      title="Email | Must Contain (@) | End With (.com) or (.pt)"  
                      placeholder="example@email.com" 
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  
                  <div className="form-col">
                    <label>Double-check Email</label>
                    <input 
                      type="email" 
                      name="doubleCheckEmail" 
                      placeholder="Exact same as email" 
                      onChange={handleChange} 
                      disabled={!isEditing} 
                    />
                  </div>
               
                </div>

                {renderButtons()}
                
              </form>
            </div>
          </div>
        )}

        {activeSection === 'address' && (
          <div className="section-box">
            <div className="section">

              <div className="section-header">
                <h2 className="section-title">ADDRESS</h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-col">
                    <label>Address Line 1</label>
                    <input 
                      type="text" 
                      name="address.addressLine1" 
                      value={profile.address.addressLine1 || ''} 
                      onChange={handleChange} 
                      placeholder="Rua Example" 
                      disabled={!isEditing} 
                    />
                  </div>

                  <div className="form-col">
                    <label>Address Line 2</label>
                    <input 
                      type="text" 
                      name="address.addressLine2" 
                      value={profile.address.addressLine2 || ''} 
                      onChange={handleChange} 
                      placeholder="nº123" 
                      disabled={!isEditing} 
                    />
                  </div>

                  <div className="form-col">
                    <label>Postal Code</label>
                    <input 
                      type="text" 
                      name="address.postalCode" 
                      value={profile.address.postalCode || ''} 
                      onChange={handleChange}
                      onInput={(e) => e.target.value = e.target.value.replace(/[^0-9\-]/g, '')} // Remove Invalid Characters
                      pattern="[0-9\-]*"
                      title="Postal Code | Only Allowed (0-9), (-)"
                      placeholder="0000-000" 
                      disabled={!isEditing} 
                    />
                  </div>

                  <div className="form-col">
                    <label>City</label>
                    <input 
                      type="text" 
                      name="address.city" 
                      value={profile.address.city || ''} 
                      onChange={handleChange} 
                      placeholder="City" 
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-col">
                    <label>Region</label>
                    <input 
                      type="text" 
                      name="address.region" 
                      value={profile.address.region || ''} 
                      onChange={handleChange} 
                      placeholder="Region" 
                      disabled={!isEditing} 
                    />
                  </div>

                  <div className="form-col">
                    <label>Country</label>
                    <input 
                      type="text" 
                      name="address.country" 
                      value={profile.address.country || ''} 
                      onChange={handleChange} 
                      placeholder="Country" 
                      disabled={!isEditing} 
                    />
                  </div>
                </div>

                {renderButtons()}

              </form>
            </div>
          </div>
        )}

        {activeSection === 'security' && (
          <div className="section-box">
            <div className="section">

              <div className="section-header">
                <h2 className="section-title">SECURITY</h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-col">
                    <label>Password</label>
                    <input 
                      type="password" 
                      name="userPassword"
                      value={profile.userPassword || ''} 
                      pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,8}" 
                      title="Password | Must Have 8 Characters | 1 (a-z), 1 (A-Z), 1 (0-9)" 
                      minLength={8}
                      maxLength={8}
                      placeholder={isEditing ? 'Enter new password' : '********'} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="form-col">
                    <label>Double-check Password</label>
                    <input 
                      type="password" 
                      name="doubleCheckPassword" 
                      placeholder="Exact same as password" 
                      onChange={handleChange} 
                      disabled={!isEditing} 
                    />
                  </div>
                  
                </div>

                {renderButtons()}

              </form>
            </div>
          </div>
        )}

        {activeSection === 'wishlist' && (
          <div className="section-box wish-box">
            <div className="section wish-wd">

              <div className="section-header section-header-wish">
                <h2 className="section-title">WISHLIST</h2>
              </div>

              <ul>
                {wishlist.map((item) => {

                  const event = item.event;

                  return (

                    <li key={event.id} className="wishlist-item">
                      <div className="wishlist-item-details button-wish">

                        <h3>{event.name}</h3>
                        <p>Category: {event.category?.name || 'N/A'}</p>

                        <p>
                          Date: {new Date(event.startDate).toLocaleDateString('en-GB')} -{' '}
                          {new Date(event.endDate).toLocaleDateString('en-GB')}
                        </p>

                        <button onClick={() => navigate(`/event/${event.id}`)} className="view-event-btn">
                          VIEW EVENT
                        </button>
                      </div>

                      <div className="wishlist-item-actions button-wish">
                        <button onClick={() => openShareModal(event.id)} className="share-btn">
                          SHARE
                        </button>
                        <button onClick={() => openCalendarModal()} className="share-btn">
                          CALENDAR
                        </button>
                        <button onClick={() => openModal(event.id)} className="remove-btn">
                          REMOVE
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

                {/* Calendar Modal */}
                <ReactModal 
                  isOpen={isCalModalOpen} 
                  onRequestClose={closeCalendarModal} 
                  className="calendar-content"
                  overlayClassName="calendar-overlay"
                >
                    
                  <h2>Wishlist Calendar</h2>
                  
                  <div className="my-calendar-container">
                    <MyCalendar
                      onChange={onDateChange}
                      value={selectedDate}
                      tileClassName={tileClassName}
                    />
                  </div>

                  <hr/>

                  <h3 className="wish-event-title">Events on {selectedDate.toLocaleDateString()}</h3>
                  
                  <ul>
                    {eventsOnDate.length > 0 ? (

                      eventsOnDate.map((event, index) => (
                        <li key={index}>{event.title}</li>
                      ))

                    ) : (

                      <p>No Events on this Day.</p>
                    )}
                  </ul>
                  
                  <div className="modal-actions-myCal">
                    <button onClick={closeCalendarModal} className="remove-btn">Close</button>
                  </div>
                </ReactModal>

                {/* Share Modal */}
                <ReactModal
                  isOpen={isShareModalOpen}
                  onRequestClose={closeShareModal}
                  contentLabel="Share Event"
                  className="modal-content"
                  overlayClassName="modal-overlay"
                >
                  <h2>Share Event</h2>
                  <p>Enter the Receiver Email and an Optional Message:</p>

                  <input
                    type="email"
                    placeholder="Receiver Email: example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                  />

                  <textarea
                    placeholder="Add a Message (Optional)."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="textarea-field"
                  />

                  <div className="modal-actions">
                    <button onClick={() => handleShareEvent(selectedEventId)}>
                      SHARE
                    </button>
                    <button onClick={closeShareModal} className='remove-btn'>
                      CANCEL
                    </button>
                  </div>
                </ReactModal>

                {/* Remove from Wishlist Modal */}
                <ReactModal
                  isOpen={isModalOpen}
                  onRequestClose={closeModal}
                  contentLabel="Confirm Removal"
                  className="modal-content"
                  overlayClassName="modal-overlay"
                >
                  <h2>Confirm Removal</h2>

                  <p className='removal-txt'>Are you sure you want to </p>
                  <p className='red-txt'>REMOVE</p>
                  <p className='removal-txt'> this Event from your Wishlist?</p>

                  <div className="modal-actions">
                    <button onClick={handleRemoveFromWishlist} className="remove-btn">
                      YES, REMOVE
                    </button>
                    <button onClick={closeModal}>
                      NO, CANCEL
                    </button>
                  </div>
                </ReactModal>
            </div>
          </div>
        )}

        {activeSection === 'sharedEvents' && (
          <div className="section-box wish-box">
            <div className="section wish-wd">

              <div className="section-header section-header-wish">
                <h2 className="section-title">SHARED EVENTS</h2>
              </div>

              <ul>
                {sharedEvents.map((item) => {

                  const event = item.event;
                  const senderEmail = item.sender?.email || 'N/A';
                  const message = item.message || 'No Message Provided.';

                  return (

                    <li key={event.id} className="wishlist-item">
                      <div className="wishlist-item-details button-wish">

                        <h3>{event.name}</h3>
                        <p>Category: {event.category?.name || 'N/A'}</p>

                        <p>
                          Date: {new Date(event.startDate).toLocaleDateString('en-GB')} -{' '}
                          {new Date(event.endDate).toLocaleDateString('en-GB')}
                        </p>

                        <button onClick={() => navigate(`/event/${event.id}`)} className="view-event-btn">
                          VIEW EVENT
                        </button>
                      </div>

                      <div className="share-item-actions button-share">
                        
                        <span>
                          <strong>Sender Email:</strong> {senderEmail}
                        </span>

                        <hr />

                        <span>
                          <strong>Message:</strong> {message}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;