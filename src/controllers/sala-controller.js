var crypto = require('crypto');
var helpers = require('../helpers/request-helper');
var storage = require('../storage');

class SalaController {
    constructor() {
        this.callbacksUsuarios = [];
    }

    async registarUsuario (req, res, param, data) {
        try {
            if (!data) {
                return helpers.validationError(res, 'Informe Nickname e Sala para entrar.');
            }

            data = JSON.parse(data);

            if (!data.nickname || !data.sala) {
                return helpers.validationError(res, 'Informe Nickname e Sala para entrar.');
            }

            let { nickname, sala } = data;

            let salas = storage.salas.filter(i => { return i.id == sala; });

            if (!salas || salas.length == 0) {
                return helpers.validationError(res, 'Sala nao encontrada.');
            }

            let usuario = salas[0].usuarios.filter(i => { return i.nickname == nickname; });

            if (usuario && usuario.length > 0) {
                return helpers.validationError(res, 'Nickname informado ja em uso nesta sala.');
            }

            let id = crypto.randomBytes(16).toString("hex");

            salas[0].usuarios.push({
                id: id,
                nickname: nickname
            });

            this.callbackUsuarios(sala);

            helpers.success(res, id);
        } catch (error) {
            console.log(error);
            helpers.error(res, error);
        }
    }

    async listarSalas (req, res) {
        let salas = storage.salas.map(i => { return { id: i.id, nome: i.nome } });

        return helpers.success(res, salas);
    }

    async listarUsuarios (req, res, param) {
        let idSala = param[0];
        let usuarios = this.listarUsuariosPorSala(idSala);

        return helpers.success(res, usuarios);
    }

    async listarUsuariosPolling (req, res, param) {
        let idSala = param[0];
        let sala = storage.salas.filter(i => { return i.id == idSala; });

        if (!sala || sala.length == 0) {
            return helpers.validationError(res, 'Sala nao encontrada.');
        }

        if (!this.callbacksUsuarios[idSala]) {
            this.callbacksUsuarios[idSala] = [];
        }

        this.callbacksUsuarios[idSala].push({
            callBack: (usuarios) => {
                return helpers.success(res, usuarios);
            }
        });
    }

    async trocarSala (req, res, param, data) {
        try {
            if (!data) {
                return helpers.validationError(res, 'Informe sala destino e id do usuario para trocar de sala.');
            }

            data = JSON.parse(data);

            if (!data.sala_destino || !data.id_usuario) {
                return helpers.validationError(res, 'Informe sala destino e id do usuario para trocar de sala.');
            }

            let idSala = param[0];
            let { id_usuario, sala_destino } = data;

            let salaOrigem = storage.salas.filter(i => { return i.id == idSala; });

            if (!salaOrigem || salaOrigem.length == 0) {
                return helpers.validationError(res, 'Sala origem nao encontrada.');
            }

            let salaDestino = storage.salas.filter(i => { return i.id == sala_destino; });

            if (!salaDestino || salaDestino.length == 0) {
                return helpers.validationError(res, 'Sala destino nao encontrada.');
            }

            let usuario = salaOrigem[0].usuarios.filter(i => { return i.id == id_usuario });

            if (!usuario || usuario.length == 0) {
                return helpers.validationError(res, 'Usuario nao encontrado na sala origem.');
            }

            let usuarioExiste = salaDestino[0].usuarios.filter(i => { return i.nickname == usuario[0].nickname });

            if (usuarioExiste && usuarioExiste.length > 0) {
                usuario[0].nickname = usuario[0].nickname + (new Date()).getTime();
            }

            this.sairSala(id_usuario);

            salaDestino[0].usuarios.push(usuario[0]);

            this.callbackUsuarios(sala_destino);

            return helpers.success(res, true);
        } catch (error) {
            console.log(error);
            helpers.error(res, error);
        }
    }

    async criarSala (req, res, param, data) {
        try {
            if (!data) {
                return helpers.validationError(res, 'Informe o nome da sala a ser criada.');
            }

            data = JSON.parse(data);

            if (!data.sala) {
                return helpers.validationError(res, 'Informe o nome da sala a ser criada.');
            }

            let salaExiste = storage.salas.filter(i => { return i.nome.toLowerCase() == data.sala.toLowerCase(); });

            if (salaExiste && salaExiste.length > 0) {
                return helpers.validationError(res, 'Sala ja existe.');
            }

            let id = data.sala.replace(/[^0-9a-zA-Z]/g, '').toLowerCase();

            storage.salas.push({
                id: id,
                nome: data.sala,
                usuarios: [],
                mensagens: []
            });

            return helpers.success(res, id);
        } catch (error) {
            console.log(error);
            helpers.error(res, error);
        }
    }

    async sair (req, res, param) {
        let idUsuario = param[0];
        
        this.sairSala(idUsuario);

        helpers.success(res, true);
    }

    sairSala (idUsuario) {
        storage.salas.forEach(sala => {
            sala.usuarios = sala.usuarios.filter(i => { return i.id != idUsuario });

            this.callbackUsuarios(sala.id);
        });

        return;
    }

    listarUsuariosPorSala (idSala) {
        let sala = storage.salas.filter(i => { return i.id == idSala; });

        if (!sala || sala.length == 0) {
            return helpers.validationError(res, 'Sala nao encontrada.');
        }

        return sala[0].usuarios.map(i => { return i.nickname; });
    }

    callbackUsuarios (idSala) {
        if (this.callbacksUsuarios[idSala]) {
            while (this.callbacksUsuarios[idSala].length > 0) {
                let usuarios = this.listarUsuariosPorSala(idSala);

                this.callbacksUsuarios[idSala].shift().callBack(usuarios);
            }
        }
    }
}

module.exports = new SalaController();
