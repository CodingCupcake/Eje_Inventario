const jwt = require ('jsonwebtoken');

function generateToken(user){
    const payload = { userId: user.id, username: user.username};
    const secretKey = 'key-tasks';
    const options = { expiresIn: '1h'};
    return jwt.sign(payload, secretKey, options);
}

function verifyToken(token) {
    const secretKey = 'key-tasks';
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    }
    catch (error){
        return null;
    }
}

module.exports = {
    generateToken,
    verifyToken
}