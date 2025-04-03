const jwt = require("jsonwebtoken");


 const verifyToken = (token, secretkey)=>{
    return jwt.verify(token ,secretkey)
 }
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({sucess: false, message: 'User is not authenticate' });
    }
    const token = authHeader.split(' ')[1];

    const playload = verifyToken(token, 'JWT_SeCRET');
    req.user = playload;

    next();

}

module.exports = { authenticate };