const mongoose = require('mongoose')
const { paginateOptions } = require('../services/paginate')
const mongoosePaginate = require('mongoose-paginate-v2');
const { mongooseValidator } = require('../services/utils');
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true, uppercase: true },
    user_id: { type: mongoose.Schema.Types.ObjectId },
    xml_name: { type: String, uppercase: true },
    company: { type: mongoose.Schema.Types.ObjectId },
    description: { type: String, required: false },
    ean_cod: { type: String, required: false, index: true, uppercase: true },
    cod: { type: String, required: true, index: true, uppercase: true },
    ncm: { type: String, uppercase: true },
    cest: { type: String, uppercase: true },
    unit_of_measure: { type: String, uppercase: true },
    quantity: { type: Number, uppercase: true },
    unitary_value: { type: Number,  },
    total_amount: { type: Number },
    purchase_date: { type: Date },
    created_at: {
        type:Date,
        default: new Date()
    },
    supplier_company: {
        cnpj: { type: String, uppercase: true },
        corporate_name: { type: String, uppercase: true },
        fantasy_name: { type: String },
        city: { type: String, uppercase: true },
        street: { type: String, uppercase: true },
        number: { type: String, uppercase: true },
        uf: { type: String, uppercase: true },
        postal_code: { type: String, uppercase: true },
        country: { type: String, uppercase: true },
        district: { type: String, uppercase: true },
        complement: { type: String, uppercase: true },
        phone_number: { type: String, uppercase: true }
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