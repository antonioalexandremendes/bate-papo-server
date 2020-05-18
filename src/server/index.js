var http = require('http');
var routes = require('../routes');
var router = require('../router');

this.server = http.createServer(async (req, res) => {
    await router(req, res, routes);
});

exports.listen = function () {
    this.server.listen.apply(this.server, arguments);

    console.log('Executando na porta: ' + arguments[0] + ', url: http://localhost:' + arguments[0]);
};

exports.close = function (callback) {
    this.server.close(callback);
};
