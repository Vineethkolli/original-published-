import { Link } from 'react-router-dom';

function Sidebar({ isOpen, onClose }) {
    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            
            <ul>
                <li>
                    <Link to="/home" onClick={onClose}>Home</Link>
                </li>
                <li>
                    <Link to="/profile" onClick={onClose}>Profile</Link> {/* Link to Profile */}
                </li>
                <li>
                    <Link to="/users" onClick={onClose}>Users</Link> {/* Link to Profile */}
                </li>
                <li>
                    <Link to="/installapp" onClick={onClose}>Install App</Link> {/* Link to Profile */}
                </li>
                {/* Add other links similarly */}
            </ul>
        </div>
    );
}

export default Sidebar;
