
import React from 'react';
import { DatePicker } from 'antd';

// CSS
import '../search/Search.css';

function Search() 
{
  return (
    <div className="search-container">

      <select className="category-dropdown">
        <option value="all">All Categories</option>
        <option value="concerts">Concerts</option>
        <option value="sports">Sports</option>
        <option value="theater">Theater</option>
      </select>

      <input
        type="text"
        placeholder="Search by Event, City, or Country ..."
        className="search-bar"
      />

      <DatePicker.RangePicker className="date-picker" />
      
    </div>
  );
}

export default Search;