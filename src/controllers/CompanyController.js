const Company = require("../models/Company")

module.exports = {
    createAcion: async (req, res) => {
        await Company.createCompany(req.body)
            .then(resp => res.status(201).send(resp))
            .catch(e => res.status(400).send({
                error: e.message
            }))
    },
    index: async (req, res) => {
        if (req.params._id) {
            return await Company.getById(req.params._id)
                .then(resp => res.status(200).send(resp))
                .catch(e => res.status(400).send({
                    error: e.message
                }))
        }
        await Company.getData(req.query)
            .then(resp => res.status(200).send(resp))
            .catch(e => res.status(400).send({
                error: e.message
            }))
    },
    updateAction: async (req, res) => {
        await Company.update(req.params._id, req.body)
            .then(resp => res.status(201).send(resp))
            .catch(e => res.status(400).send({
                error: e.message
            }))
    },
    paginate: async (req, res) => {
        await Company.paginate(req)
            .then(resp => res.status(200).send(resp))
            .catch(e => res.status(400).send({
                error: e.message
            }))
    },
    delete: async (req, res) => {
        await Company.delete(req)
            .then(() => res.sendStatus(200))
            .catch(e => {
                res.status(400).send({error: e.message})
            })
    }
}