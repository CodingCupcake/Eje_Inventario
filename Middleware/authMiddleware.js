const authutils = require('./authUtils');

function authenticate(req, res, next) {
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({error: "Unauthorized"});
    }
    const decodedtoken = authutils.verifyToken(token);
    if(!decodedtoken){
        return res.status(401).json({error: 'Unauthorized'});
    }
    req.user = decodedtoken;
    next();
}

module.exports = authenticate;