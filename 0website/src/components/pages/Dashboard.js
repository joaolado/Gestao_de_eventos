
import ReactModal from 'react-modal';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import Navigation
import { toast } from 'react-toastify';         // Import Toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toast CSS

// API - Handle Fetch Requests
import fetchAPI from '../../fetchAPI';

// CSS
import '../../App.css';
import './Dashboard.css';

// Configure Modal Root Element (once in your app entry file)
ReactModal.setAppElement('#root');

const Dashboard = () => 
{
  // State Hooks for Managing Profiles
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

  // State Hooks for Handling Loading, Sections, and Other States
  const [isLoading, setIsLoading] = useState(true);                // Determines if Data is Still Loading
  const [wishlist, setWishlist] = useState([]);                    // Wishlist Data
  const [sharedEvents, setSharedEvents] = useState([]);            // Shared Events Fata
  const [activeSection, setActiveSection] = useState('profile');   // Active Section for UI
  const [isEditing, setIsEditing] = useState(false);               // Whether the User is Editing Their Profile
  const [emailEdited, setEmailEdited] = useState(false);           // Whether Email was Edited
  const [passwordEdited, setPasswordEdited] = useState(false);     // Whether Password was Edited
  const [profilePicEdited, setProfilePicEdited] = useState(false); // Whether Profile Picture was Edited
  const [file, setFile] = useState(null);                          // File for Uploading Profile Picture
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

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
    // Fetch the Profile Data
    const fetchProfile = async () =>
    {
      setIsLoading(true); // Set Loading to True While Fetching Data

      try 
      {
        // Fetch Profile Data From the Server
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

        setIsLoading(false); // Set Loading to False once the Data is Fetched
      } 
      
      catch (error) 
      {
        console.error('Error Fetching Profile:', error);
        setIsLoading(false); // In case of Error - Stop Loading
      }
    };

    const fetchWishlist = async () => 
    {
      try 
      { 
        // Fetch Profile Wishlist Data From the Server
        const data = await fetchAPI('/api/v1/profile/get-wishlist');

        setWishlist(data.wishlist);
      } 

      catch (error) 
      {
        console.error('Error Fetching Wishlist:', error);
      }
    };

    const fetchSharedEvents = async () => {
      try {
        const data = await fetchAPI('/api/v1/profile/get-shared-events');  // Create an endpoint to fetch shared events
        setSharedEvents(data.sharedEvents);  // Assuming response contains 'sharedEvents' data
      } catch (error) {
        console.error('Error Fetching Shared Events:', error);
      }
    };

    // Call the Fetch Function to Load Data
    fetchProfile();
    fetchWishlist();
    fetchSharedEvents();

  }, []); // Empty Dependency Array

  // Handle Input Changes and Update Profile Data
  const handleChange = (e) => 
  { 
    // Destructure the Name and Value from the Event Target
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

    // Create the updated profile data to send in the Request Body
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
  
    // Ensure address is part of updatedProfile
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
        body: JSON.stringify(updatedProfile), // Send the Updated Profile Data in the Request Body
      });
      
      // Handle Success or Failure Based on the Response from the API
      if (response.success) 
      {
        toast.success('Profile Updated Successfully.');
        setIsEditing(false);         // Stop Editing After Successful Update
        setEmailEdited(false);       // Reset Email Edit State
        setPasswordEdited(false);    // Reset Password Edit State
        setProfilePicEdited(false);  // Reset Profile Picture Edit State
      } 
      
      else 
      {
        // Show Error if Update Fails
        toast.error('Profile Update failed. ' + response.message);
      }

      // Redirect to the Dashboard
      navigate('/dashboard');
    } 
    
    catch (error) 
    {
      console.error('Error Updating Profile ', error);
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

        // Once the file is Read Successfully, Update the profilePic in the Profile State
        setProfile((prev) => ({ ...prev, profilePic: reader.result }));

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

    // File to the FormData Object
    formData.append('profilePic', file);
  
    try 
    {
      // Make the PUT Request to Update the Profile Picture
      const response = await fetchAPI('/api/v1/profile/update', 
      {
        method: 'PUT',
        body: formData, // Send the FormData With the Image File
      });
      
      // If the Response is Successful, Update the Profile Picture
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
      console.error('Error Updating Profile Picture ', error);
      toast.error('Error Updating profile Picture.');
    }
  };

  // Open the modal and set the selected event ID
  const openModal = (eventId) => {
    setSelectedEventId(eventId);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEventId(null);
  };

  // Remove from Wishlist Handler
  const handleRemoveFromWishlist = async () => {
    try {
      await fetchAPI('/api/v1/profile/remove-from-wishlist', {
        method: 'DELETE',
        body: JSON.stringify({ eventId: selectedEventId }),
        headers: { 'Content-Type': 'application/json' },
      });

      // Update wishlist state
      setWishlist((prevWishlist) =>
        prevWishlist.filter((item) => item.event.id !== selectedEventId)
      );

      // Show success message
      toast.success('Event removed from wishlist');
    } catch (error) {
      toast.error('Error removing event from wishlist');
    } finally {
      // Close the modal
      closeModal();
    }
  };

  // Open Share Modal
  const openShareModal = (eventId) => {
    setSelectedEventId(eventId);
    setIsShareModalOpen(true);
  };

  // Close Share Modal
  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setSelectedEventId(null);
    setEmail('');
    setMessage('');
  };

  // Handle Share Event
  const handleShareEvent = async (eventId) => {
    if (!email || !message) {
      toast.error("Email and message are required.");
      return;
    }
  
    try {
      const response = await fetchAPI('/api/v1/profile/share-event', {
        method: 'POST',
        body: JSON.stringify({
          senderId: profile.id,  // Assuming 'profile.id' holds the current user's ID
          receiverEmail: email,
          eventId,  // Only the eventId is needed to link the event
          message,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      toast.success("Event shared successfully.");
      closeShareModal();
    } catch (error) {
      console.error("Error sharing event:", error);
      toast.error("Failed to share the event.");
    }
  };
  
  
  



  // Frontend
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
                        <button className="cs-btn" type="button" disabled>
                          COMING SOON
                        </button>
                        <button onClick={() => openModal(event.id)} className="remove-btn">
                          REMOVE
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

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
                  placeholder="Add a Message (Optional)"
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

              {/* Modal Component */}
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
                const event = item.event;  // Assuming 'item.event' holds the event details
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
                      
                        {/*

                        <button onClick={handleAddToWishlist} >
                          {isEventInWishlist ? 'ALREADY IN WISHLIST' : 'ADD TO WISHLIST'}
                        </button>
                        

                        <span>
                          <strong>Sender Email:</strong> {senderEmail || 'N/A'}
                        </span>

                        <span>
                          <strong>Message:</strong> {message || 'No message provided'}
                        </span>

                        */}

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