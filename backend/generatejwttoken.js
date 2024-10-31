// Import the jsonwebtoken library
const jwt = require('jsonwebtoken');

// Function to generate a JWT token
function generateToken(user) {
    // Define a secret key (replace this with a more secure, environment-specific key)
    const secretKey = '123';

    // Set the payload with user information (e.g., user ID or username)
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
    };

    // Generate the token
    const token = jwt.sign(payload, secretKey, { expiresIn: '1000h' });

    return token;
}

// Example usage
const user = {
    id: '12345',
    username: 'vineeth',
    role: 'admin'
};

const token = generateToken(user);
console.log('Generated Token:', token);
