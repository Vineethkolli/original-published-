import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Signup() {
    const [role, setRole] = useState('user'); // Default to user role
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            setMessage('');
            return;
        }
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, { name, email, phoneNumber, password, role });
            setMessage('Signup successful! You can sign in...');
            setErrorMessage('');
            setTimeout(() => navigate('/signin'), 1000);
        } catch (error) {
            setErrorMessage('Error signing up: ' + (error.response?.data?.message || 'Something went wrong!'));
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSignup} className="form-container">
            <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Signup</h2> {/* Capitalize role */}
            <div className="toggle-container">
                <button type="button" onClick={() => setRole('user')} className={role === 'user' ? 'active' : ''}>User</button>
                <button type="button" onClick={() => setRole('admin')} className={role === 'admin' ? 'active' : ''}>Admin</button>
                <button type="button" onClick={() => setRole('developer')} className={role === 'developer' ? 'active' : ''}>Developer</button>
            </div>
            <input 
                type="text" 
                placeholder="Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
            />
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />
            <input 
                type="text" 
                placeholder="Phone Number" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
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
            <div className="password-container">
                <input 
                    type={confirmPasswordVisible ? "text" : "password"} 
                    placeholder="Confirm Password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                />
                <span className="eye-icon" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                    {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                </span>
            </div>
            <button type="submit">Signup</button>
            {message && <p className="confirmation-message">{message}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <p>Already have an account? <a href="/signin">Sign in</a></p>
        </form>
    );
}

export default Signup;
