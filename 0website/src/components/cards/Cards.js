
import React, { useState, useEffect } from 'react';

// API - Handle Fetch Requests
import fetchAPI from '../../fetchAPI'; 

// CSS
import '../cards/Cards.css';

// Components
import CardItem from './CardItem';

function Cards() 
{
  const [events, setEvents] = useState([]); // State to Hold Events

  useEffect(() => 
  {
    // Fetch Events
    const fetchEvents = async () => 
    {
      try 
      {
        // Make an API Call to Get Events
        const data = await fetchAPI('/api/v1/events/');
  
        // Check if the Fetched Data is in the Expected Format
        if (data && data.data && Array.isArray(data.data)) 
        {
          // Sort the Events by Start Date in Descending =rder
          const sortedEvents = data.data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

          setEvents(sortedEvents.slice(0, 5)); // Get the last 5 Events
        } 
        
        else 
        {
          console.error('Data Format is Incorrect:', data);
        }
      } 
      
      catch (error) 
      {
        console.error('Error Fetching Events:', error);
      }
    };
    
    // Call the Fetch Function to Load Data
    fetchEvents();
  }, []);

  //-----------------------------------------------------------------------------------------------------------------
  // FRONTEND
  //-----------------------------------------------------------------------------------------------------------------
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

                text={event.name || 'No Title Available.'}
                label={event.category || 'General'}
                path={`/event/${event.id}`}
              />

            ))}

          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;