const jwt = require('jsonwebtoken');

let verifyToken = (req, res, next) => {
    

    try {
        const token = req.headers.authorization.split(' ')[1];
        

        if (!token) {
            return res.status(401).send('Access denied. No token provided.');
        }
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
        req.user = decoded;
        next();
    } catch (ex) {
        return res.status(400).send('Invalid token.');
    }
};
let verifyTokenAndAdminAuth = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.body.id || req.user.roleId === 'R1') {
            next();
        } else {
            return res.status(403).json("You're not allowed to delete other");
        }
    });
};
let checkTokenAdmin = (req,res,next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        console.log('check token nn', req.headers.authorization);

        if (!token) {
            return res.status(401).send('Access denied. No token provided.');
        }
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
        if(decoded && decoded.roleId === 'R1'){
            next();
        }else {
            return res.status(403).json("You're not admin");
        }
    }catch(e){

    }
}
module.exports = {
    verifyToken,
    verifyTokenAndAdminAuth,
    checkTokenAdmin,
};
