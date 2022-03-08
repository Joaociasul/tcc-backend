const mongoose = require('mongoose')
const {
    paginateOptions
} = require('../services/paginate')
const mongoosePaginate = require('mongoose-paginate-v2');
const {
    mongooseValidator
} = require('../services/utils');
const CompanySchema = new mongoose.Schema({
    corporate_name: {
        type: String,
        required: true
    },
    cnpj: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    fantasy_name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    address: {
        number: {
            type: String,
            required: true
        },
        postal_code: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        complement: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        uf: {
            type: String,
            required: true
        },
    },
    settings: {
        type: Object
    },
    description: String
})

CompanySchema.plugin(mongoosePaginate)
const CompanyModel = mongoose.model('Company', CompanySchema)

class Company {
    static createCompany = (data) => {
        return new Promise((resolve, reject) => {
            try {
                new CompanyModel(data).save((err, company) => {
                    mongooseValidator(err).
                    then(() => {
                            let resp = {
                                ...company
                            }
                            resolve(resp._doc)
                        })
                        .catch(e => reject(e))
                });
            } catch (error) {
                throw reject(error);
            }
        })
    }
    static getData = (filters) => {
        return new Promise((resolve, reject) => {
            try {
                const data = CompanyModel.find(filters);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    static filterData(filter) {
        return new Promise((resolve, reject) => {
            try {
                const data = CompanyModel.find(filter);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    static getById(_id) {
        return new Promise((resolve, reject) => {
            try {
                const data = CompanyModel.findById(_id);
                if (!data) {
                    throw new Error('Company not found!');
                }
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    static update(_id, data) {
        return new Promise((resolve, reject) => {
            try {
                CompanyModel.updateOne({
                    _id
                }, data, {
                    runValidators: true,
                }, (err) => {
                    mongooseValidator(err)
                        .then(data => resolve(data))
                        .catch(e => reject(e))
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
                const data = CompanyModel.paginate(filter, options)
                resolve(data)
            } catch (error) {
                reject(error)
            }
        })
    }
    static delete(req) {
        return new Promise((resolve, reject) => {
            CompanyModel.deleteOne({
                _id: req.params._id
            }).exec((err, data) => {
                if (err) {
                    return reject(err)
                }
                resolve(data)
            })
        })
    }
}
module.exports = Company