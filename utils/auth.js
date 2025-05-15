import jwt from 'jsonwebtoken'; 

// utils/auth.js
export function getUserFromToken(req) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.log('Token not provided');
        return null; 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        return decoded; 
    } catch (err) {
        console.error('Invalid token:', err);
        return null; 
    }
}

