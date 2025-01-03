
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // For dynamic routing

// API - Handle Fetch Requests
import fetchAPI from '../../fetchAPI';

// CSS
import '../../App.css';
import './Event.css';

const Event = () => 
{
  const { id } = useParams(); // Get event ID from URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await fetchAPI(`/api/v1/events/${id}`); // Adjust URL based on your API endpoint
        setEvent(data);
      } catch (error) {
        setError(error.message || 'Failed to fetch event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>No event found.</p>;

  return (
    <div className="event-container">
      <div className="event-header">
        <h1 className="event-title">{event.name}</h1>
        <button className="event-category">{event.category || 'General'}</button>
      </div>
      <div className="event-content">
        <div className="event-cover">
          <img src={event.cover || 'default-cover.jpg'} alt={event.name} />
        </div>
        <div className="event-details">
          <p><strong>Description:</strong> {event.description}</p>
          <p><strong>Date:</strong> {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</p>
          <p><strong>Location:</strong> {event.addressLine1}, {event.city}, {event.country}</p>
          <p><strong>Category:</strong> {event.category || 'General'}</p>
          <p><strong>Contact:</strong> {event.contactEmail || 'Not Provided'}</p>
        </div>
      </div>
    </div>
  );
};

export default Event;