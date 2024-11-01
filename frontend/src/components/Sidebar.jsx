import { Link } from 'react-router-dom';

function Sidebar({ isOpen, onClose, userRole }) {
    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <ul>
                <li>
                    <Link to="/home" onClick={onClose}>Home</Link>
                </li>
                <li>
                    <Link to="/profile" onClick={onClose}>Profile</Link>
                </li>
                {/* Render the Users link only if the user has the 'developer' role */}
                {userRole === 'developer' && (
                    <li>
                        <Link to="/users" onClick={onClose}>Users</Link>
                    </li>
                )}
                <li>
                    <Link to="/IncomeEntry" onClick={onClose}>Income Entry</Link>
                </li>
                <li>
                    <Link to="/installapp" onClick={onClose}>Install App</Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
