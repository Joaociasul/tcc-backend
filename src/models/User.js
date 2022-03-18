const mongoose = require('mongoose')
const {
    paginateOptions
} = require('../services/paginate')
const mongoosePaginate = require('mongoose-paginate-v2');
var crypto = require('crypto');
var bcrypt = require("bcryptjs");
const {
    mongooseValidator
} = require('../services/utils');
const Role = require('./Role');
const res = require('express/lib/response');
const { password } = require('pg/lib/defaults');
const Company = require('./Company');

const { setToken } = require('../middlwares/auth')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email já existe!"]
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }],
    password: {
        type: String,
        required: false,
    },
    refresh_token:{type: mongoose.Schema.Types.String},
    exp_refresh_token: {type: mongoose.Schema.Types.Number},
    phone_number: {type:mongoose.Schema.Types.String }
})

UserSchema.plugin(mongoosePaginate)
const UserModel = mongoose.model('User', UserSchema)
class User {
    static createUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                if(!data.password){
                    reject({message:{validator:{field:'password', type: 'required'}}})
                }
                const company = await Company.getById(data.company)
                const body = {
                    name: data.name,
                    email: data.email,
                    password: bcrypt.hashSync(data.password, 8),
                    company: company?._id ?? null,
                }
                new UserModel(body).save((err, user) => {
                    mongooseValidator(err).then(() => {
                        Role.find({
                            name: { $in: data.roles }
                        }).then(resp => {
                            if(resp) {
                                user.roles = resp.map(role => role._id)
                                user.save(err => {
                                    mongooseValidator(err)
                                    .then(() => resolve(user)).catch(e => reject(e))
                                })
                            }
                        }).catch(e => {
                            return res.status(400).send({error: e. message})
                        })
                    }).catch(e => reject(e))
                });

            } catch (error) {
                throw reject(error);
            }
        })
    }
    static getData = (filters) => {
        return new Promise((resolve, reject) => {
            try {
                const data = UserModel.find(filters);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    static filterData(filter) {
        return new Promise((resolve, reject) => {
            try {
                const data = UserModel.find(filter);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    static getById(_id) {
        return new Promise((resolve, reject) => {
            try {
                const data = UserModel.findById(_id).populate('roles');
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    static update(_id, data) {
        return new Promise((resolve, reject) => {
            try {
                UserModel.findById(_id).exec((err, user) => {
                    if(!user) {
                        const error = {message: {validator: {message:'not_found'}}}
                        return reject(error)
                    }
                    mongooseValidator(err).then(() => {
                        Role.find({
                            name: { $in: data.roles }
                        }).then(resp => {
                            if(resp) {
                                user.roles = resp.map(role => role._id)
                                user.name = data.name
                                user.company = data.company
                                user.save(err => {
                                    mongooseValidator(err)
                                    .then(() => resolve(user)).catch(e => reject(e))
                                })
                            }
                        }).catch(e => {
                            return res.status(400).send({error: e. message})
                        })
                    }).catch(e => reject(e))
                });
            } catch (error) {
                reject(error);
            }
        })
    }
    static paginate(req) {
        return new Promise((resolve, reject) => {
            try {
                const {
                    filter,
                    options
                } = paginateOptions(req)
                options.populate = 'company'
                const data = UserModel.paginate(filter, options)
                resolve(data)
            } catch (error) {
                reject(error)
            }
        })
    }
    static login(body) {
        return new Promise((resolve, reject) => {
            try {
                UserModel.findOne({
                    email: body.email
                }, (err, user) => {
                    const  error =  {message: null}
                    if (err) {
                        throw err
                    }
                    if (!user) {
                        error.message = { validator: {auth: false, message: "Incorrect username or password!"}}
                        return reject(error)
                    }
                    const passValid = bcrypt.compareSync(body.password, user.password)
                    if (!passValid) {
                        error.message = { validator: {auth: false, message: "Incorrect username or password!"}}
                        return reject(error)
                    }
                    user.refresh_token = crypto.randomUUID()
                    const date = new Date()
                    const newDate = date.setDate(date.getDate() + 7)
                    user.exp_refresh_token = (new Date(newDate)).getTime()
                    const response = {...user}
                    user.save()
                    response._doc._exp_token = (new Date()).getTime()  + 1799 * 1000
                    response._doc._token = setToken(user._id)
                    delete response._doc.password
                    resolve(response._doc)
                }).populate('roles').populate('company')
            } catch (error) {
                reject(error)
            }
        })
    }
    static refreshToken(refresh_token) {
        return new Promise( (resolve, reject) => {
            UserModel
            .findOne({refresh_token}).populate('roles').populate('company')
            .exec((err, user) => {
                if(err) {
                    return reject(err)
                }
                if(!user) {
                    const error = {message:{validator:{auth:false, message: "not_found"}}}
                    return reject(error)
                }
                if(user.exp_refresh_token <= (new Date()).getTime()) {
                    const error = {message:{validator:{auth:false, message: "expired"}}}
                    return reject(error)
                }
                user.refresh_token = crypto.randomUUID()
                const date = new Date()
                const newDate = date.setDate(date.getDate() + 7)
                user.exp_refresh_token = (new Date(newDate)).getTime()
                user.save()
                const response = {...user}
                response._doc._exp_token = (new Date()).getTime()  + 1795 * 1000
                response._doc._token = setToken(user._id)
                delete response._doc.password
                resolve(response._doc)
                return resolve(user)
            })
        });
    }
    static updatePassword(_id,data) {
        return new Promise((resolve, reject) => {
            UserModel.findById(_id).exec((err, user) => {
                if(!user) {
                    const error = {message: {validator: {message:'not_found'}}}
                    return reject(error)
                }
                mongooseValidator(err).then(() => {
                    const passValid = bcrypt.compareSync(data.old_password, user.password)
                    if (!passValid) {
                        const error = {message: {validator: {message:'password_old.not_match'}}}
                        return reject(error)
                    }
                    user.password =  bcrypt.hashSync(data.new_password, 8)
                    user.save(err => {
                        mongooseValidator(err)
                        .then(() => resolve(user)).catch(e => reject(e))
                    })
                }).catch(e => reject(e));
            })
        })
    }
}
module.exports = User