import React, { useState, useEffect } from 'react';

// CSS
import '../cards/Cards.css';

// Components
import CardItem from './CardItem';

// API Fetch (Replace this with your actual API call if needed)
import fetchAPI from '../../fetchAPI'; 

function Cards() {
  const [events, setEvents] = useState([]); // State to hold events

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await fetchAPI('/api/v1/events/');
        console.log('Fetched events:', data); // Log the entire response to confirm the structure
  
        // Make sure the response contains the 'data' field, and handle accordingly
        if (data && data.data && Array.isArray(data.data)) {
          const sortedEvents = data.data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
          setEvents(sortedEvents.slice(0, 5)); // Get the last 3 events
        } else {
          console.error('Data format is incorrect:', data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents(); // Call the fetch function to load events
  }, []); // Empty dependency array ensures it only runs once when the component is mounted

  return (
    <div className='cards'>
      <h1>Discover Our Latest Events!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            {events.map(event => (
              <CardItem
                key={event.id}
                src={
                  event.cover
                    ? event.cover.startsWith('data:image')
                      ? event.cover
                      : `/uploads/covers/${event.cover}`
                    : '/uploads/covers/default-cover.jpg'
                }
                text={event.name || 'No Title Available'} // Handle missing description
                label={event.category || 'General'}
                path={`/event/${event.id}`} // Assuming there's a detail page for each event
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;