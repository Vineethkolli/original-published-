import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Signin({ onSignIn, setUserData }) {
    const [role, setRole] = useState('user'); // Toggle between User, Admin, Developer
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleSignin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, { emailOrPhone, password, role });
            localStorage.setItem('token', response.data.token);
            setUserData(response.data.user); // Store user data
            setMessage('Signin successful...');
            setErrorMessage('');
            onSignIn(); // Notify App that user is signed in
            setTimeout(() => navigate('/home'), 0); // Navigate to Home
        } catch (error) {
            setErrorMessage('Error signing in: ' + (error.response?.data?.message || 'Something went wrong!'));
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSignin} className="form-container">
            <h2>{role === 'admin' ? 'Admin Signin' : role === 'developer' ? 'Developer Signin' : 'User Signin'}</h2>
            <div className="toggle-container">
                <button type="button" onClick={() => setRole('user')} className={role === 'user' ? 'active' : ''}>User</button>
                <button type="button" onClick={() => setRole('admin')} className={role === 'admin' ? 'active' : ''}>Admin</button>
                <button type="button" onClick={() => setRole('developer')} className={role === 'developer' ? 'active' : ''}>Developer</button>
            </div>
            <input 
                type="text" 
                placeholder="Email/Phone Number" 
                value={emailOrPhone} 
                onChange={(e) => setEmailOrPhone(e.target.value)} 
                required 
            />
            <div className="password-container">
                <input 
                    type={passwordVisible ? "text" : "password"} 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <span className="eye-icon" onClick={() => setPasswordVisible(!passwordVisible)}>
                    {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                </span>
            </div>
            <button type="submit">Signin</button>
            {message && <p className="confirmation-message">{message}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <p>Forgot your password? <a href="/forget-password">Reset it here</a></p>
            <p>Not yet registered? <a href="/signup">Sign up</a></p>
        </form>
    );
}

export default Signin;
