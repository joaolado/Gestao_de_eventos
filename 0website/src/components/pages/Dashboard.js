import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For programmatic navigation
import { toast } from 'react-toastify';         // Importing toast
import 'react-toastify/dist/ReactToastify.css'; // Importing toast CSS

// API
import fetchAPI from '../../fetchAPI';

// CSS
import '../../App.css';
import './Dashboard.css';

const Dashboard = () => {
  const [profile, setProfile] = useState({
    profilePic: '/uploads/profilePic/default-pic.jpeg',
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

  const [isLoading, setIsLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [sharedEvents, setSharedEvents] = useState([]);
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [emailEdited, setEmailEdited] = useState(false);
  const [passwordEdited, setPasswordEdited] = useState(false);
  const [file, setFile] = useState(null);

  const navigate = useNavigate(); // Hook for navigation

    // Redirect to /dashboard on refresh
    useEffect(() => {
      const navigationType = window.performance.getEntriesByType('navigation')[0]?.type || window.performance.navigation.type;
  
      if (navigationType === 'reload') {
        console.log('Page reloaded, redirecting to /dashboard');
        navigate('/dashboard');
      }
    }, [navigate]);

  useEffect(() => {
    
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAPI('/api/v1/profile/get-profile');
        console.log('Fetched profile data:', data); // Debugging

        setProfile((prevProfile = {}) => ({
          ...prevProfile,
          ...data,
          profilePic: data.profilePic || prevProfile.profilePic || '',
          address: {
            ...prevProfile.address,
            ...data.address,
          },
        }));
        setIsLoading(false); // Set loading to false once the data is fetched
      } catch (error) {
        console.error('Error fetching profile:', error);
        setIsLoading(false); // Even in case of error, stop loading
      }
    };

    const fetchWishlist = async () => {
      try {
        const data = await fetchAPI('/api/v1/profile/get-wishlist');
        setWishlist(data.wishlist);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    fetchProfile();
    fetchWishlist();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'userPassword') {
      setPasswordEdited(true);
    }
  
    if (name === 'email') {
      setEmailEdited(true);
    }
  
    if (name.startsWith('address.')) {
      const addressKey = name.split('.')[1];
      setProfile((prevProfile) => ({
        ...prevProfile,
        address: {
          ...prevProfile.address,
          [addressKey]: value,
        },
      }));
    } else {
      setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (emailEdited && profile.email !== profile.doubleCheckEmail) {
      alert('Email and double-check email do not match');
      return;
    }
  
    if (passwordEdited && profile.userPassword !== profile.doubleCheckPassword) {
      alert('Password and double-check password do not match');
      return;
    }
  
    const updatedProfile = { ...profile };
  
    // Only include userPassword if explicitly changed
    if (!passwordEdited || !profile.userPassword) {
      delete updatedProfile.userPassword;
    }
  
    console.log('Updated Profile Payload:', updatedProfile); // Debug log for payload
  
    try {
      const response = await fetchAPI('/api/v1/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile),
      });
  
      if (response.success) {
        alert('Profile updated successfully');
        setIsEditing(false);
        setEmailEdited(false);
        setPasswordEdited(false);
      } else {
        alert('Profile update failed: ' + response.message);
      }

            // Redirect to the Dashboard
            navigate('/dashboard');

    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };  

  const toggleEdit = () => {
    console.log('Toggling edit mode: ', isEditing); // Debug log
    setIsEditing(true);
  };
  
  const closeEdit = () => {
    console.log('Closing edit mode'); // Debug log
    setIsEditing(false);
    setEmailEdited(false);
    setPasswordEdited(false);
  };

  const renderButtons = () => (
    <div className="button-group">
      {!isEditing && (
        <button type="button" onClick={toggleEdit}>
          Edit
        </button>
      )}
      {isEditing && (
        <>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={closeEdit}>Close</button>
        </>
      )}
    </div>
  );

// File change handler to preview the image
const handleFileChange = (e) => {
  const file = e.target.files[0];
  setFile(file);
  if (file) {
    const reader = new FileReader();
    reader.onload = () => setProfile((prev) => ({ ...prev, profilePic: reader.result }));
    reader.readAsDataURL(file);
  }
};

  const handleProfilePicUpdate = async (e) => {
    e.preventDefault();
  
    if (!file) {
      alert('Please select a file to upload');
      return;
    }
  
    const formData = new FormData();
    formData.append('profilePic', file);
  
    try {
      const response = await fetchAPI('/api/v1/profile/update', {
        method: 'PUT',
        body: formData,
      });
  
      if (response.success) {
        alert('Profile Picture updated successfully');
        
        // Fetch updated profile data to refresh the UI
        const updatedProfileData = await fetchAPI('/api/v1/profile/get-profile');
        setProfile((prevProfile) => ({
          ...prevProfile,
          profilePic: updatedProfileData.profilePic || prevProfile.profilePic,
        }));
      } else {
        alert('Failed to update Profile Picture');
      }

    // Redirect to the Dashboard
    navigate('/dashboard');

    } catch (error) {
      alert('Error updating profile picture');
    }
  };
  
  return (
    <div className="dashboard">
      <div className="side-menu">
      {isLoading ? (
      <div>Loading...</div> // Or a loading spinner
    ) : (
      <div className="profile-pic">
        <img
          src={
            profile?.profilePic 
              ? profile.profilePic.startsWith('data:image')
                ? profile.profilePic 
                : `/uploads/profilePic/${profile.profilePic}` 
              : '/uploads/profilePic/default-pic.jpeg'
          }
          alt="Profile"
          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
        />
        <button onClick={() => document.getElementById('file').click()}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16"><path fill="#000" d="M11.498 5.501a1.002 1.002 0 1 1-2.003 0a1.002 1.002 0 0 1 2.003 0M2 4.5A2.5 2.5 0 0 1 4.5 2h6.998a2.5 2.5 0 0 1 2.5 2.5v1.558a2.6 2.6 0 0 0-1-.023V4.5a1.5 1.5 0 0 0-1.5-1.5H4.5A1.5 1.5 0 0 0 3 4.5v6.998c0 .232.052.451.146.647l3.651-3.651a1.7 1.7 0 0 1 2.404 0l.34.34l-.706.707l-.341-.34a.7.7 0 0 0-.99 0l-3.651 3.65c.196.094.415.147.647.147h1.796l-.25 1H4.5a2.5 2.5 0 0 1-2.5-2.5zm11.263 2.507a1.56 1.56 0 0 0-.927.447L8.05 11.742a2.8 2.8 0 0 0-.722 1.256l-.009.033l-.303 1.211a.61.61 0 0 0 .74.74l1.21-.303a2.8 2.8 0 0 0 1.29-.73l4.288-4.288a1.56 1.56 0 0 0-1.28-2.654"/></svg></button>
        <input
          id="file"
          type="file"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />
        <button onClick={handleProfilePicUpdate} className="submit"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 20 20"><path fill="#000" d="M17 6.125v2.91A3.5 3.5 0 0 0 16.5 9H16V6.125a.97.97 0 0 0-.289-.711l-2.125-2.125A.96.96 0 0 0 13 3.008V5.5a1.51 1.51 0 0 1-.922 1.383A1.3 1.3 0 0 1 11.5 7h-4a1.51 1.51 0 0 1-1.383-.922A1.3 1.3 0 0 1 6 5.5V3H5a.97.97 0 0 0-.703.289a1.1 1.1 0 0 0-.219.32A.86.86 0 0 0 4 4v10a1 1 0 0 0 .078.391q.079.178.211.32a.85.85 0 0 0 .313.211q.192.073.398.078v-4.5a1.51 1.51 0 0 1 .922-1.383c.181-.082.379-.122.578-.117h5.992a3.5 3.5 0 0 0-2.442 1H6.5a.505.505 0 0 0-.5.5V15h3v1H5a1.9 1.9 0 0 1-.758-.156a2.2 2.2 0 0 1-.64-.422A1.9 1.9 0 0 1 3 14.039V4c-.001-.26.052-.519.156-.758a2.2 2.2 0 0 1 .422-.642a1.9 1.9 0 0 1 .622-.436c.24-.105.499-.16.761-.164h7.914c.262 0 .523.05.766.148c.244.099.465.248.648.438l2.125 2.125c.186.185.332.405.43.648c.099.244.152.503.156.766M7 3v2.5a.505.505 0 0 0 .5.5h4a.505.505 0 0 0 .5-.5V3zm3 9.5a2.5 2.5 0 0 1 2.5-2.5h4a2.5 2.5 0 0 1 2.5 2.5v4c0 .51-.152.983-.414 1.379l-3.025-3.025a1.5 1.5 0 0 0-2.122 0l-3.025 3.025A2.5 2.5 0 0 1 10 16.5zm7 .25a.75.75 0 1 0-1.5 0a.75.75 0 0 0 1.5 0m-5.879 5.836c.396.262.87.414 1.379.414h4c.51 0 .983-.152 1.379-.414l-3.025-3.025a.5.5 0 0 0-.708 0z"/></svg></button>
      </div>
    )}

        <div>WELCOME!</div>
        <div className="email">{profile.email}</div>
        <ul>
          <li onClick={() => setActiveSection('profile')}>Profile</li>
          <li onClick={() => setActiveSection('address')}>Address</li>
          <li onClick={() => setActiveSection('security')}>Security</li>
          <li onClick={() => setActiveSection('wishlist')}>Wishlist</li>
          <li onClick={() => setActiveSection('sharedEvents')}>Shared Events</li>
        </ul>
      </div>
      <div className="content">
        {activeSection === 'profile' && (
          <div className="section-box">
            <div className="section">
              <h2>Profile</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-col">
                    <label>Username</label>
                    <input type="text" name="userName" value={profile.userName} onChange={handleChange} placeholder="Username" disabled={!isEditing} />
                  </div>
                  <div className="form-col">
                    <label>First Name</label>
                    <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} placeholder="First Name" disabled={!isEditing} />
                  </div>
                  <div className="form-col">
                    <label>Last Name</label>
                    <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} placeholder="Last Name" disabled={!isEditing} />
                  </div>
                  <div className="form-col">
                    <label>Phone</label>
                    <input type="text" name="phone" value={profile.phone} onChange={handleChange} placeholder="Phone" disabled={!isEditing} />
                  </div>
                  <div className="form-col">
                    <label>Email</label>
                    <input type="email" name="email" value={profile.email} onChange={handleChange} placeholder="Email" disabled={!isEditing} />
                  </div>
                  
                    <div className="form-col">
                      <label>Double-check Email</label>
                      <input type="email" name="doubleCheckEmail" placeholder="Double-check Email" onChange={handleChange} disabled={!isEditing} />
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
              <h2>Address</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-col">
                    <label>Address Line 1</label>
                    <input type="text" name="addressLine1" value={profile.address.addressLine1} onChange={handleChange} placeholder="Address Line 1" disabled={!isEditing} />
                  </div>
                  <div className="form-col">
                    <label>Address Line 2</label>
                    <input type="text" name="addressLine2" value={profile.address.addressLine2} onChange={handleChange} placeholder="Address Line 2" disabled={!isEditing} />
                  </div>
                  <div className="form-col">
                    <label>Postal Code</label>
                    <input type="text" name="postalCode" value={profile.address.postalCode} onChange={handleChange} placeholder="Postal Code" disabled={!isEditing} />
                  </div>
                  <div className="form-col">
                    <label>City</label>
                    <input type="text" name="city" value={profile.address.city} onChange={handleChange} placeholder="City" disabled={!isEditing} />
                  </div>
                  <div className="form-col">
                    <label>Region</label>
                    <input type="text" name="region" value={profile.address.region} onChange={handleChange} placeholder="Region" disabled={!isEditing} />
                  </div>
                  <div className="form-col">
                    <label>Country</label>
                    <input type="text" name="country" value={profile.address.country} onChange={handleChange} placeholder="Country" disabled={!isEditing} />
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
              <h2>Security</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-col">
                    <label>Password</label>
                    <input type="password" name="userPassword" value={profile.userPassword} placeholder={isEditing ? 'Enter new password' : '********'} onChange={handleChange} disabled={!isEditing} />
                  </div>
                  
                  <div className="form-col">
                    <label>Double-check Password</label>
                    <input type="password" name="doubleCheckPassword" placeholder="Double-check Password" onChange={handleChange} disabled={!isEditing} />
                  </div>
                  
                </div>
                {renderButtons()}
              </form>
            </div>
          </div>
        )}

        {activeSection === 'wishlist' && (
          <div className="section-box">
            <div className="section">
              <h2>Wishlist</h2>
              <ul>
                {wishlist.map(event => (
                  <li key={event.id}>
                    {event.name} - {event.startDate} to {event.endDate}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeSection === 'sharedEvents' && (
          <div className="section-box">
            <div className="section">
              <h2>Shared Events</h2>
              <ul>
                {sharedEvents.map(event => (
                  <li key={event.id}>
                    Sender: {event.senderEmail}, Receiver: {event.receiverEmail}, Event: {event.name} - {event.startDate} to {event.endDate}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
