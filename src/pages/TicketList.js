import React from 'react';
import '../App.css';

export default function TicketList() {
  return (
    <div className="container">
      <h2>My Tickets</h2>
      <button>Create New Ticket</button>
      <ul>
        <li>Network issue – open</li>
        <li>Printer not working – resolved</li>
      </ul>
    </div>
  );
}

