
import React from 'react';

const TicketModal = ({ isOpen, onClose, onSave, tickets, handleTicketChange, handleAddTicket, ticketTypes }) => 
{
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Ticket Information</h2>

        <div className="form-group">
          {Array.isArray(tickets) && tickets.map((ticket, index) => (
            ticket && (
              <div key={index} className="ticket-info">
                <select
                  name={`tickets[${index}].type`}
                  value={ticket.type}
                  onChange={e => handleTicketChange(e, index)}
                >
                  <option value="" disabled>Select Ticket Type</option>
                  {ticketTypes?.map((ticketType, i) => (
                    <option key={i} value={ticketType.name}>
                      {ticketType.name}
                    </option>
                  ))}
                  <option value="new">Create New Ticket Type</option>
                </select>

                {ticket.type === 'new' && (
                  <div>
                    <input
                      type="text"
                      placeholder="New Ticket Type"
                      onChange={handleTicketChange} // Handle new ticket type input
                    />
                    <button type="button" onClick={handleAddTicket}>
                      Add New Ticket Type
                    </button>
                  </div>
                )}

                <input
                  type="number"
                  name={`tickets[${index}].price`}
                  placeholder="Price"
                  value={ticket.price}
                  onChange={e => handleTicketChange(e, index)}
                />
                <input
                  type="number"
                  name={`tickets[${index}].quantity`}
                  placeholder="Quantity"
                  value={ticket.quantity}
                  onChange={e => handleTicketChange(e, index)}
                />
                <select
                  name={`tickets[${index}].status`}
                  value={ticket.status}
                  onChange={e => handleTicketChange(e, index)}
                >
                  <option value="Available">Available</option>
                  <option value="Sold_Out">Sold Out</option>
                  <option value="Coming_Soon">Coming Soon</option>
                </select>
              </div>
            )
          ))}
          <button type="button" onClick={handleAddTicket}>Add Ticket</button>
        </div>

        <button className="submit-button" onClick={onSave}>Save Ticket Info</button>
        <button className="cancel-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TicketModal;