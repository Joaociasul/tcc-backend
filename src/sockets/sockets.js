const io = require('../../index')
module.exports = {
    sendMessageToClient :(channel, message) => {
        io.emit(channel, message);
    }
} 
