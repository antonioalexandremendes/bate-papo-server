var fs = require('fs');
var helpers = require('../helpers/request-helper');

class ClienteController {
    constructor() {
        this.html = fs.readFileSync('./src/client/index.html');
    }

    async carregarCliente (req, res) {
        return helpers.html(res, this.html);
    }
}

module.exports = new ClienteController();
