const mongoose = require('mongoose')
const {
} = require('../services/paginate')
const {
    mongooseValidator
} = require('../services/utils');

const RoleSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
})

const RoleModel = mongoose.model('Role', RoleSchema)
class Role {
    static createRole(name) {
        return new Promise((resolve, reject) => {
            new RoleModel({
                name
            }).save((err, role) => {
                mongooseValidator(err).then(() => resolve(role)).catch(e => reject(e))
            })
        })
    }
    static find(obj) {
        return new Promise((resolve, reject) => {
            try {
                const data = RoleModel.find(obj)
                resolve(data)
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = Role