var helpers = require('../helpers/request-helper');
var storage = require('../storage');

class MensagemController {
    constructor() {
        this.callbacks = [];
    }

    async registrarMensagem (req, res, param, data) {
        try {
            if (!data) {
                return helpers.validationError(res, 'Informe Id da Sala, Id do Usuario e Mensagem para postar.');
            }

            data = JSON.parse(data);

            if (!data.id_usuario || !data.id_sala || !data.mensagem) {
                return helpers.validationError(res, 'Informe Id da Sala, Id do Usuario e Mensagem para postar.');
            }

            let { id_usuario, id_sala, mensagem, tipo, nickname_destino } = data;

            let salas = storage.salas.filter(i => { return i.id == id_sala; });

            if (!salas || salas.length == 0) {
                return helpers.validationError(res, 'Sala nao encontrada.');
            }

            let usuario = salas[0].usuarios.filter(i => { return i.id == id_usuario; });

            if (!usuario || usuario.length == 0) {
                return helpers.validationError(res, 'Usuario nao encontrado na sala.');
            }

            if (!tipo || !['public', 'private'].includes(tipo)) {
                tipo = 'public';
            }

            let registro = {
                autor: usuario[0].nickname,
                tipo: tipo,
                mensagem: mensagem,
                criada_em: new Date
            };

            if (nickname_destino) {
                let destinatario = salas[0].usuarios.filter(i => { return i.nickname == nickname_destino; });

                if (destinatario && destinatario.length > 0) {
                    registro.destinatario = destinatario[0];
                }
            }

            salas[0].mensagens.push(registro);

            if (this.callbacks[id_sala]) {
                while (this.callbacks[id_sala].length > 0) {
                    this.callbacks[id_sala].shift().callBack([registro]);
                }
            }

            helpers.success(res, true);
        } catch (error) {
            console.log(error);
            helpers.error(res, error);
        }
    }

    async listarMensagensPorSala (req, res, param) {
        let idSala = param[0];
        let idUsuario = param[1];

        let sala = storage.salas.filter(i => { return i.id == idSala; });

        if (!sala || sala.length == 0) {
            return helpers.validationError(res, 'Sala nao encontrada.');
        }

        let mensagens = sala[0].mensagens.filter(i => { return i.tipo == 'public'; });
        mensagens = mensagens.concat(sala[0].mensagens.filter(i => { return i.tipo == 'private' && i.destinatario && i.destinatario.id == idUsuario; }));

        return helpers.success(res, mensagens);
    }

    async pollingMensagensPorSala (req, res, param) {
        let idSala = param[0];
        let idUsuario = param[1];

        let sala = storage.salas.filter(i => { return i.id == idSala; });

        if (!sala || sala.length == 0) {
            return helpers.validationError(res, 'Sala nao encontrada.');
        }

        if (!this.callbacks[idSala]) {
            this.callbacks[idSala] = [];
        }

        this.callbacks[idSala].push({
            callBack: (mensagens) => {
                let retorno = mensagens.filter(i => { return i.tipo == 'public'; });
                retorno = retorno.concat(mensagens.filter(i => { return i.tipo == 'private' && i.destinatario && i.destinatario.id == idUsuario; }));

                return helpers.success(res, retorno);
            }
        });
    }
}

module.exports = new MensagemController();
