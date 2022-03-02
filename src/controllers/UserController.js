const User = require("../models/User")

module.exports = {
    login: async (req, res) => {
        await User.login(req.body)
        .then(resp => res.status(200).send(resp))
        .catch(e => res.status(400).send({error: e.message}))
    },
    createAcion: async (req, res) => {
        await User.createUser(req.body)
            .then(resp => res.status(201).send(resp))
            .catch(e => res.status(400).send({
                error: e.message
            }))
    },
    index: async (req, res) => {
        if (req.params._id) {
            return await User.getById(req.params._id)
                .then(resp => res.status(200).send(resp))
                .catch(e => res.status(400).send({
                    error: e.message
                }))
        }
        await User.getData(req.query)
            .then(resp => res.status(200).send(resp))
            .catch(e => res.status(400).send({
                error: e.message
            }))
    },
    updateAction: async (req, res) => {
        await User.update(req.params._id, req.body)
            .then(resp => res.status(201).send(resp))
            .catch(e => res.status(400).send({error: e.message}))
    },
    updatePassword: async (req, res) => {
        await User.updatePassword(req.params._id, req.body)
            .then(resp => res.status(201).send(resp))
            .catch(e => res.status(400).send({error: e.message}))
    },
    paginate: async (req, res) => {
        await User.paginate(req)
            .then(resp => res.status(200).send(resp))
            .catch(e => res.status(400).send({
                error: e.message
            }))
    },
    refreshToken: async (req, res) => {
        await User.refreshToken(req.body.refresh_token)
            .then(resp => res.status(200).send(resp))
            .catch(e => res.status(400).send({error: e.message}))
    }
}