import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [messages, setMessages] = useState({});
    const [editableUserId, setEditableUserId] = useState(null);
    const [newRole, setNewRole] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/get-users`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users');
            }
        };

        fetchUsers();
    }, []);

    const handleRoleChange = async (userId) => {
        try {
            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/update-role/${userId}`, 
                { role: newRole },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setUsers((prevUsers) =>
                prevUsers.map((user) => (user._id === userId ? { ...user, role: newRole } : user))
            );
            setMessages((prevMessages) => ({
                ...prevMessages,
                [userId]: 'Role updated successfully!',
            }));
            setTimeout(() => setMessages((prevMessages) => ({ ...prevMessages, [userId]: '' })), 3000);
            setEditableUserId(null);
            setNewRole('');
        } catch (err) {
            setError('Failed to update role');
        }
    };

    const handleEditClick = (user) => {
        setEditableUserId(user._id);
        setNewRole(user.role);
    };

    if (error) return <p>{error}</p>;

    return (
        <div className="container">
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
                                            onChange={(e) => setNewRole(e.target.value)}
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
                                        <span className="edit-icon" onClick={() => handleEditClick(user)}>
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
