import React from 'react';
import './UserProfile.css';

const UserProfile = ({ name, username, investmentAmount }) => {
  return (
    <div className="user-profile">
      <div className="profile-header">
        <h1>Welcome, {name}!</h1>
        <p>@{username}</p>
      </div>

      <div className="investment-details">
        <h2>Investment Summary</h2>
        <p>Total Investment Amount:</p>
        <div className="investment-amount">${investmentAmount.toLocaleString()}</div>
      </div>

      <div className="profile-actions">
        <button className="action-button">Edit Profile</button>
        <button className="action-button">View Portfolio</button>
        <button className="action-button">Log Out</button>
      </div>
    </div>
  );
};

export default UserProfile;
