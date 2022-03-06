const express = require('express');
const CompanyController = require('../controllers/CompanyController');
const ProductController = require('../controllers/ProductController');
const RuleController = require('../controllers/RoleController');
const UserController = require('../controllers/UserController');
const {
    auth
} = require('../middlwares/auth');
const { checkRoot } = require('../middlwares/permission');
const { sendMessageToClient } = require('../sockets/sockets');
const app = express();

const urlCompany = '/company'
app.post(urlCompany, auth, checkRoot,  CompanyController.createAcion)
app.get(urlCompany + '/getById/:_id?', auth, checkRoot,CompanyController.index) //to filter, use req.query
app.put(urlCompany + '/:_id', auth, checkRoot,CompanyController.updateAction)
app.get(urlCompany + '/paginate', auth,checkRoot, CompanyController.paginate)

const urlUser = '/user'
app.post(urlUser, auth,  UserController.createAcion)
app.post(urlUser + '/login', UserController.login)
app.get(urlUser + '/getById/:_id?', auth, UserController.index) //to filter, use req.query
app.put(urlUser + '/:_id', auth, UserController.updateAction)
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

module.exports = app;