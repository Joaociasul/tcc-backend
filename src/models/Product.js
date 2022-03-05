const mongoose = require('mongoose')
const { paginateOptions } = require('../services/paginate')
const mongoosePaginate = require('mongoose-paginate-v2');
const { mongooseValidator } = require('../services/utils');
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    user_id: { type: mongoose.Schema.Types.ObjectId },
    xml_name: { type: String },
    company: { type: mongoose.Schema.Types.ObjectId },
    description: { type: String, required: false },
    ean_cod: { type: String, required: false, index: true },
    cod: { type: String, required: true, index: true },
    ncm: { type: String },
    cest: { type: String },
    unit_of_measure: { type: String },
    quantity: { type: Number },
    unitary_value: { type: Number },
    total_amount: { type: Number },
    purchase_date: { type: Date },
    created_at: {
        type:Date,
        default: new Date()
    },
    supplier_company: {
        cnpj: { type: String },
        corporate_name: { type: String },
        fantasy_name: { type: String },
        city: { type: String },
        street: { type: String },
        number: { type: String },
        uf: { type: String },
        postal_code: { type: String },
        country: { type: String },
        district: { type: String },
        complement: { type: String },
        phone_number: { type: String }
    }
})
ProductSchema.plugin(mongoosePaginate)
const ProductModel = mongoose.model('Product', ProductSchema)
class Product {
    static createProduct = (data) => {
        return new Promise((resolve, reject) => {
            try {
                new ProductModel(data).save((err, Product) => {
                    mongooseValidator(err).
                    then(() => resolve(Product))
                    .catch(e =>reject(e))
                });
            } catch (error) {
                throw reject(error);
            }
        })
    }
    static getData = (filters) => {
        return new Promise((resolve, reject) => {
            try {
                const data = ProductModel.find(filters);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    static filterData(filter) {
        return new Promise((resolve, reject) => {
            try {
                const data = ProductModel.find(filter);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        })
    }
    static getById(_id) {
        return new Promise((resolve, reject) => {
            try {
                const data = ProductModel.findById(_id);
                if(!data) {
                    throw new Error('Product not found!');
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
                const update = ProductModel.findByIdAndUpdate(_id, data, {
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
                const { filter, options } = paginateOptions(req)
                const data = ProductModel.paginate(filter, options)
                resolve(data)
            } catch (error) {
                reject(error)
            }
        })   
    }
    static insertMany(data) {
        return new Promise((resolve, reject) => {
            try {
                ProductModel.insertMany(data)
                resolve(true)
            } catch (error) {
                reject(error)
            }
            
        })
    }
}
module.exports = Product