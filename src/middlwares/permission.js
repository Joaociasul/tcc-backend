const User = require("../models/User")

module.exports = {
    checkRoot: async (req, res, next) => {
        await User.getById(req.user.user)
            .then(({roles}) => {
                if(!roles.find(role => role.name === 'root')) {
                    return res.sendStatus(403)
                } 
                next()
            }).catch(e => {
                console.log(e)
                return res.sendStatus(403)
            })
    },
    checkAdmin: async (req, res, next)  => {
        await User.getById(req.user.user)
        .then(({roles}) => {
            if(!roles.find(role => ['root', 'administrator'].indexOf(role.name) > -1)) {
                return res.sendStatus(403)
            } 
            next()
        }).catch(e => {
            console.log(e)
            return res.sendStatus(403)
        })
    }
}