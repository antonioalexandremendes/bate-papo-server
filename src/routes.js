var salaController = require('./controllers/sala-controller');
var mensagemController = require('./controllers/mensagem-controller');
var clienteController = require('./controllers/cliente-controller');

module.exports = [{
    method: 'POST',
    path: '/sala/registar-usuario',
    handler: salaController.registarUsuario.bind(salaController)
},{
    method: 'GET',
    path: '/sala',
    handler: salaController.listarSalas.bind(salaController)
},{
    method: 'GET',
    path: /\/sala\/([^/]+)\/listar-usuarios/,
    handler: salaController.listarUsuarios.bind(salaController)
},{
    method: 'GET',
    path: /\/sala\/([^/]+)\/polling-listar-usuarios/,
    handler: salaController.listarUsuariosPolling.bind(salaController)
},{
    method: 'GET',
    path: /\/sala\/sair\/([^/]+)/,
    handler: salaController.sair.bind(salaController)
},{
    method: 'POST',
    path: /\/sala\/([^/]+)\/trocar/,
    handler: salaController.trocarSala.bind(salaController)
},{
    method: 'POST',
    path: '/sala',
    handler: salaController.criarSala.bind(salaController)
},{
    method: 'POST',
    path: '/mensagem',
    handler: mensagemController.registrarMensagem.bind(mensagemController)
},{
    method: 'GET',
    path: /\/mensagem\/listar-por-sala\/([^/]+)\/([^/]+)/,
    handler: mensagemController.listarMensagensPorSala.bind(mensagemController)
},{
    method: 'GET',
    path: /\/mensagem\/polling\/([^/]+)\/([^/]+)/,
    handler: mensagemController.pollingMensagensPorSala.bind(mensagemController)
},{
    method: 'GET',
    path: '/bate-papo',
    handler: clienteController.carregarCliente.bind(clienteController)
}];
