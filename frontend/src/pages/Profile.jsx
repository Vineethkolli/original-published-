// Profile.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Profile({ user, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout(); // Call the passed logout function
        navigate('/signin'); // Redirect to SignIn page
    };

    return (
        <div className="form-container">
            <h2>Profile</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
            <p><strong>Role:</strong> {user.role}</p> {/* Display the user role */}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Profile;
