import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmNewPasswordVisible, setConfirmNewPasswordVisible] = useState(false);
    const [otpButtonDisabled, setOtpButtonDisabled] = useState(false);

    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();

        if (otpSent || otpButtonDisabled) return;

        setOtpButtonDisabled(true);

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forget-password`, { email });
            setMessage('OTP sent to your email! Please check your inbox');
            setErrorMessage('');
            setOtpSent(true);
        } catch (error) {
            setErrorMessage('Error sending OTP: ' + error.response?.data?.message || 'Something went wrong!');
            setMessage('');
            setOtpButtonDisabled(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setErrorMessage("Passwords do not match");
            setMessage('');
            return;
        }
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`, { email, otp, newPassword });
            setMessage('Password reset successful! You can now login.');
            setErrorMessage('');

            setTimeout(() => {
                navigate('/signin');
            }, 500);
        } catch (error) {
            setErrorMessage('Error resetting password: ' + error.response?.data?.message || 'Something went wrong!');
            setMessage('');
        }
    };

    return (
        <div className="form-container">
            <h2>Forget Password</h2>
            {!otpSent ? (
                <form onSubmit={handleSendOtp}>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <button type="submit" disabled={otpButtonDisabled}>Send OTP</button>
                    {message && <p className="confirmation-message">{message}</p>}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
            ) : (
                <form onSubmit={handleResetPassword}>
                    <input 
                        type="text" 
                        placeholder="Enter OTP" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        required 
                    />
                    <div className="password-container">
                        <input 
                            type={newPasswordVisible ? "text" : "password"} 
                            placeholder="New Password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            required 
                        />
                        <span className="eye-icon" onClick={() => setNewPasswordVisible(!newPasswordVisible)}>
                            {newPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <div className="password-container">
                        <input 
                            type={confirmNewPasswordVisible ? "text" : "password"} 
                            placeholder="Confirm New Password" 
                            value={confirmNewPassword} 
                            onChange={(e) => setConfirmNewPassword(e.target.value)} 
                            required 
                        />
                        <span className="eye-icon" onClick={() => setConfirmNewPasswordVisible(!confirmNewPasswordVisible)}>
                            {confirmNewPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <button type="submit">Reset Password</button>
                    {message && <p className="confirmation-message">{message}</p>}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
            )}
        </div>
    );
}

export default ForgetPassword;
