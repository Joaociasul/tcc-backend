const { default: axios } = require('axios');
const express = require('express');
const CompanyController = require('../controllers/CompanyController');
const ProductController = require('../controllers/ProductController');
const RuleController = require('../controllers/RoleController');
const UserController = require('../controllers/UserController');
const {
    auth
} = require('../middlwares/auth');
const { checkRoot, checkAdmin } = require('../middlwares/permission');
const { sendMessageToClient } = require('../sockets/sockets');
const app = express();

const urlCompany = '/company'
app.post(urlCompany, auth, checkRoot,  CompanyController.createAcion)
app.get(urlCompany + '/getById/:_id?', auth, checkRoot,CompanyController.index) //to filter, use req.query
app.put(urlCompany + '/:_id', auth, checkRoot,CompanyController.updateAction)
app.get(urlCompany + '/paginate', auth,checkRoot, CompanyController.paginate)
app.delete(urlCompany + '/:_id', auth, checkRoot,CompanyController.delete)

const urlUser = '/user'
app.post(urlUser, auth, checkAdmin, UserController.createAcion)
app.post(urlUser + '/login', UserController.login)
app.get(urlUser + '/getById/:_id?', auth, UserController.index) //to filter, use req.query
app.put(urlUser + '/:_id', auth,checkAdmin, UserController.updateAction)
app.put(urlUser + '/password/:_id', auth, UserController.updatePassword)
app.get(urlUser, auth, UserController.paginate)
app.post(urlUser + '/refresh-token', UserController.refreshToken)

const urlRule = '/rule'
app.post(urlRule, auth, RuleController.createAction)

const urlProduct = '/product'
app.post(urlProduct, auth, ProductController.createAcion)
app.get(urlProduct + '/getById/:_id?', auth, ProductController.index) //to filter, use req.query
app.put(urlProduct + '/:_id', auth, ProductController.updateAction)
app.get(urlProduct + '/paginate', auth, ProductController.paginate)
app.post(urlProduct + '/xml-import', auth, ProductController.importXml )

app.get('/socket/hello', (req, res) => {
    sendMessageToClient('hello', {ping:true})
    res.status(200).send('ok')
})

app.get('/getByCnpj/:cnpj', async (req, res) => {
    await axios.get('https://brasilapi.com.br/api/cnpj/v1/' + req.params.cnpj)
    .then(data => {
        res.status(200).send(data.data)
    }).catch(e => res.status(400).send({error: {message:e.message}}))
})

module.exports = app;