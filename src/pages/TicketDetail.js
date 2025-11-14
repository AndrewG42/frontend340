import React from 'react';
import '../App.css';

export default function TicketDetail() {
  return (
    <div className="container">
      <h2>Ticket: Network Issue</h2>
      <p>Status: Open</p>
      <p>Last Updated: 2 hours ago</p>
      <div>
        <h3>Conversation</h3>
        <p>User: My internet is down.</p>
        <p>Specialist: Restart your router and test again.</p>
      </div>
      <button>Was this helpful?</button>
    </div>
  );
}

