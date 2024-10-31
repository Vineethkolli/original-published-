// Home.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin');
        } else {
            // Decode token to get user name (you can use a library like jwt-decode)
            const decoded = JSON.parse(atob(token.split('.')[1]));
            setUserName(decoded.name);
        }
    }, [navigate]);

    return <h1>Hello, User</h1>;
}

export default Home;
