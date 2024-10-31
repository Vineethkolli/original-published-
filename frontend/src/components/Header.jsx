import { FaBars } from 'react-icons/fa'; // Import an icon for the sidebar toggle
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'; // Import user circle icon

function Header({ onToggleSidebar }) {
    return (
        <header>
            <nav className="header-nav">
                {/* Sidebar toggle icon on the left */}
                <div className="sidebar-toggle" onClick={onToggleSidebar}>
                    <FaBars />
                </div>
                {/* Spacer to push the profile icon to the far right */}
                <div className="profile-icon-container">
                    {/* Profile icon link on the right */}
                    <Link to="/profile" className="profile-icon">
                        <FontAwesomeIcon icon={faUserCircle} size="2x" />
                    </Link>
                </div>
            </nav>
        </header>
    );
}

export default Header;
