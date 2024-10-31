import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [messages, setMessages] = useState({}); // Store messages for each user
    const [editableUserId, setEditableUserId] = useState(null); // Track which user is being edited
    const [newRole, setNewRole] = useState(''); // Track the new role for the editable user

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/get-users`);
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users');
            }
        };

        fetchUsers();
    }, []);

    const handleRoleChange = async (userId) => {
        try {
            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/update-role/${userId}`, { role: newRole });
            setUsers((prevUsers) =>
                prevUsers.map((user) => (user._id === userId ? { ...user, role: newRole } : user))
            );
            // Set message for the updated user
            setMessages((prevMessages) => ({
                ...prevMessages,
                [userId]: 'Role updated successfully!', // Success message
            }));
            // Clear the message after 3 seconds
            setTimeout(() => {
                setMessages((prevMessages) => ({ ...prevMessages, [userId]: '' }));
            }, 3000);
            // Reset edit mode
            setEditableUserId(null);
            setNewRole('');
        } catch (err) {
            setError('Failed to update role');
        }
    };

    const handleEditClick = (user) => {
        setEditableUserId(user._id); // Set the user to be edited
        setNewRole(user.role); // Pre-fill the new role with the current role
    };

    if (error) return <p>{error}</p>;

    return (
        <div className="container"> {/* Add container class for styling */}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phoneNumber}</td>
                            <td>
                                {editableUserId === user._id ? (
                                    <div>
                                        <select
                                            value={newRole}
                                            onChange={(e) => setNewRole(e.target.value)} // Update newRole state
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                            <option value="developer">Developer</option>
                                        </select>
                                        <button onClick={() => handleRoleChange(user._id)}>Save</button>
                                        <button onClick={() => setEditableUserId(null)}>Cancel</button>
                                    </div>
                                ) : (
                                    <div>
                                        <span>{user.role}</span>
                                        <span className="edit-icon" title="Edit role" onClick={() => handleEditClick(user)}>
                                            <i className="fa fa-pencil" aria-hidden="true"></i>
                                        </span>
                                    </div>
                                )}
                                {messages[user._id] && <p className="message">{messages[user._id]}</p>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersPage;
