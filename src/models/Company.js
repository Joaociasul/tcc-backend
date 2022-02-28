const mongoose = require('mongoose')
const { pages, options, paginateOptions } = require('../services/paginate')
const mongoosePaginate = require('mongoose-paginate-v2');
const { PaginationParameters } = require('mongoose-paginate-v2');

const CompanySchema = new mongoose.Schema({
    corporateName: {
        type: String,
        required: true
    },
    cnpj: {
        type: String,
        required: true
    },
    fantasyName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        number: {
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
    },
    settings: {
        type: Object
    },
    descricao: String
})

CompanySchema.plugin(mongoosePaginate)
const CompanyModel = mongoose.model('Company', CompanySchema)

class Company {
    static createCompany = (data) => {
        return new Promise((resolve, reject) => {
            try {
                const create = CompanyModel.create(data);
                resolve(create);
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
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    static update(_id, data) {
        return new Promise((resolve, reject) => {
            try {
                const update = CompanyModel.findByIdAndUpdate(_id, data, {
                    new: true
                }).exec();
                resolve(update);
            } catch (error) {
                reject(error);
            }
        })
    }
    static paginate(req) {       
        return new Promise( (resolve, reject) => {
            try {
                const {filter, options} = paginateOptions(req)
                const data = CompanyModel.paginate(filter, options)
                resolve(data)
            } catch (error) {
                reject(error)
            }
        })   
    }
}
module.exports = Company