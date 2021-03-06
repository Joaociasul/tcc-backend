
    const express = require('express');
    const app = express();
    const cors = require('cors')
    app.use(cors({origin:'*',methods: ["*"]}))
    require('dotenv').config()
    const http = require('http');
    const bodyParser = require('body-parser')
    const fileupload = require("express-fileupload");
    app.use(fileupload());
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    const mongoose = require('mongoose')
    mongoose.connect(process.env.MONGO_STRING)
    .then(() => {
        app.emit('bdOk')
    })
    .catch(e => console.log(e))
    const server = http.createServer(app);
    const io = require("socket.io")(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        }
    });
    
    module.exports = io

    const router = require('./src/routes/router');
    app.use(router)
    const { authSocket } = require('./src/middlwares/auth');
    io.use(authSocket)

    app.get('/', (req, res) => {
        res.send({ping:true})
    });
    app.on('bdOk', () => {
        const port = process.env.APP_PORT | 3000
        server.listen(port, () => {
            console.log('Server on port:' + port);
        });
    })
    


