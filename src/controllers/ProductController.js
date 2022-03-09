const Product = require("../models/Product")
const Libxml = require('node-libxml');
const xml2js = require('xml2js');
const User = require("../models/User");
const { send } = require("express/lib/response");
const parser = new xml2js.Parser({ attrkey: "ATTR" });
module.exports = {
    createAcion: async (req, res) => {
        await Product.createProduct(req.body)
            .then(resp => res.status(201).send(resp))
            .catch(e => res.status(400).send({
                error: e.message
            }))
    },
    index: async (req, res) => {
        if (req.params._id) {
            return await Product.getById(req.params._id)
                .then(resp => res.status(200).send(resp))
                .catch(e => res.status(400).send({
                    error: e.message
                }))
        }
        await Product.getData(req.query)
            .then(resp => res.status(200).send(resp))
            .catch(e => res.status(400).send({
                error: e.message
            }))
    },
    updateAction: async (req, res) => {
        await Product.update(req.params._id, req.body)
            .then(resp => res.status(201).send(resp))
            .catch(e => res.status(400).send({error: e.message}))
    },
    paginate: async (req, res) => {
        await Product.paginate(req)
        .then(resp => res.status(200).send(resp))
        .catch(e => res.status(400).send({
            error: e.message
        }))
    },

    importXml: async (req, res) => {
        const user = await User.getById(req.user.user)
        let xmls = [];

        if(!req?.files?.xmls) {
            return res.status(400).send({error: {validator:{field: "xmls", type: "required", message:"files_not_found"}}})
        }
        if( req.files?.xmls instanceof Object) {
            xmls.push(req.files.xmls)
        }else if(req.files?.xmls instanceof Array) {
            xmls = req.files.xmls[0]
        }else {
            return res.status(400).send({error: {validator:{field: "xmls", type: "required", message:"files_not_found"}}})
        }
        let count = 0
        let traveled = 0
        if(xmls[0] instanceof Array){
            xmls = xmls[0]
        }
        for (const xml of xmls) {
            traveled ++
            if(xml.mimetype !== 'application/xml' && xml.mimetype !== 'text/xml'){
                continue
            }
            try {
                const products = [];
                const product = await Product.getData({xml_name: xml.name})
                if(product.length){
                    continue
                }
                const string = xml.data.toString()
                parser.parseString(string, (err, result) => {
                    if(err){
                        return res.status(400).send({error: err})
                    }
                    const user_id = user._id
                    const xml_name = xml.name
                    const company = user.company
                    const corporate = result?.nfeProc?.NFe[0]?.infNFe[0]?.emit[0]
                    const purchase_date = result?.nfeProc?.NFe[0].infNFe[0].ide[0].dhEmi[0]
                    const supplier_company = {
                        cnpj: corporate?.CNPJ[0],
                        corporate_name: corporate?.xNome[0],
                        fantasy_name: corporate?.xFant[0],
                        city: corporate?.enderEmit[0]?.xMun[0],
                        street: corporate?.enderEmit[0]?.xLgr[0],
                        number: corporate?.enderEmit[0]?.nro[0],
                        uf: corporate?.enderEmit[0]?.UF[0],
                        postal_code: corporate?.enderEmit[0]?.CEP[0],
                        country: corporate?.enderEmit[0]?.xPais[0],
                        district: corporate?.enderEmit[0]?.xBairro[0],
                        complement: corporate?.enderEmit[0]?.xCpl?corporate?.enderEmit[0]?.xCpl[0]:null,
                        phone_number: corporate?.enderEmit[0]?.fone[0]
                    }
                    for (const product of  result?.nfeProc?.NFe[0]?.infNFe[0]?.det) {
                        const item = product?.prod[0]
                        if(! item.xProd){
                            continue
                        }
                        const body = {
                            name: item?.xProd[0],
                            user_id,
                            xml_name, 
                            company,
                            ean_cod: (item?.cEAN ? item?.cEAN[0] : null) ,
                            cod: (item?.cProd ? item?.cProd[0] : null),
                            ncm: (item?.NCM ? item?.NCM[0] : null),
                            cest: (item?.CEST ? item?.CEST[0] : null),
                            unit_of_measure: item?.uCom ? item?.uCom[0] : null,
                            quantity: Number(item?.qCom ? item?.qCom[0] : null),
                            unitary_value: Number(item?.vUnCom ? item?.vUnCom[0]: 0),
                            total_amount: Number(item?.vProd ? item?.vProd[0] : null),
                            supplier_company,
                            purchase_date
                        }
                        products.push(body)
                    }
                })
                count ++
                await Product.insertMany(products).catch(e => res.status(400).send({error: e.message}))
            } catch (error) {
                console.log(error)
               return res.status(400).send({error: error.message})
           }
        }
        return res.status(200).send({message: "success", imported_files: count, traveled})
    }
}