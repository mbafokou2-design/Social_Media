const jwt = require('jsonwebtoken')
const HttpError = require('../models/errorModel')

const authMiddleware = async (req, res, next) => {
    const Authorization = req.headers.Authorization || req.headers.authorization;

    console.log('Auth header received:', Authorization); // Debug log

    if(Authorization && Authorization.startsWith("Bearer ")){
        const token = Authorization.split(' ')[1]
        console.log('Token extracted:', token); // Debug log

        jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
            if (err) {
                console.log('JWT verification error:', err.message); // Debug log
                return next(new HttpError("Unauthorized . Invalid token", 403));
            }
            console.log('JWT verified successfully:', info); // Debug log
            req.user = info;
            next();
        });
    } else {
        console.log('No valid Authorization header found'); // Debug log
        return next(new HttpError("Unauthorized . No token provided", 401));
    }
};


module.exports = authMiddleware;