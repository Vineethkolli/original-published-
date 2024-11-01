// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Home from './pages/Home';
import ForgetPassword from './pages/ForgetPassword';
import Profile from './pages/Profile'; // Import Profile
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import IncomeEntry from './pages/IncomeEntry';
import InstallApp from './pages/InstallApp';
import UsersPage from './pages/UsersPage';
import 'font-awesome/css/font-awesome.min.css';


// App.jsx
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userData, setUserData] = useState(null); // Store user data

    const handleSignIn = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserData(null); // Clear user data
        localStorage.removeItem('token');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Router>
            <div className="App">
                {isAuthenticated && <Header onToggleSidebar={toggleSidebar} />} 
                {isAuthenticated && <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} userRole={userData?.role} />} {/* Pass user role to Sidebar */}
                <Routes>
                    <Route path="/" element={<Signin onSignIn={handleSignIn} setUserData={setUserData} />} /> 
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/signin" element={<Signin onSignIn={handleSignIn} setUserData={setUserData} />} />
                    <Route path="/home" element={<Home onLogout={handleLogout} />} />
                    <Route path="/forget-password" element={<ForgetPassword />} />
                    <Route path="/profile" element={<Profile user={userData} onLogout={handleLogout} />} />
                    <Route path="/incomeentry" element={<IncomeEntry />} />
                    <Route path="/installapp" element={<InstallApp />} />
                    {/* Only allow /users route if the user has the developer role */}
                    {userData?.role === 'developer' && <Route path="/users" element={<UsersPage />} />}
                </Routes>
                {isAuthenticated && <Footer />} 
            </div>
        </Router>
    );
}

export default App;

