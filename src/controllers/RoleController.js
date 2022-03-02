const Role = require("../models/Role")

module.exports = {
    createAction: async (req, res) => {
        await Role.createRole(req.body.name)
            .then(resp => res.status(200).send(resp))
            .catch(e => res.status(400).send({error: e.message}))
    }
}