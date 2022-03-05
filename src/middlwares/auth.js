
const jwt = require('jsonwebtoken')
const validateToken = (req, socket = false) => {
    const authHeader = !socket ? (req.headers?.authorization) : req.handshake.headers?.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) throw 401
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) throw 403
        req.user = user
    })
}
module.exports = {
    setToken :(user) => {
        return jwt.sign({ user:user }, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
    },
    auth : async(req, res, next) => {
        try {
            validateToken(req)
            next()
        } catch (error) {
            res.sendStatus(error)
        }
    },
    authSocket: (socket, next) => {
        try {
            validateToken(socket, true)      
            next();      
        } catch (error) {
            next(new Error(error));
        }
    }
    
} 