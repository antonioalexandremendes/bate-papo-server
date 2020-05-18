var controller = require('../../controllers/mensagem-controller');
var salaController = require('../../controllers/sala-controller');

describe('Module mensagem-controller', () => {
  let id_usuario;
  let id_sala;

  beforeAll(async () => {
    let res = { end: (data) => { id_sala = JSON.parse(data); }, setHeader: (header, value) => {} };
    await salaController.criarSala({}, res, null, JSON.stringify({ sala: 'TESTE' + (new Date()).getTime() }));

    res.end = (data) => { id_usuario = JSON.parse(data); };
    await salaController.registarUsuario({}, res, null, JSON.stringify({ nickname: 'TESTE' + (new Date()).getTime(), sala: id_sala }));
  });

  afterAll(async () => {
    await salaController.sairSala(id_usuario);
  });

  describe('Method registrarMensagem', () => {
    it('should validate null params', () => {
      let res = {
        end: (data) => {
          let obj = JSON.parse(data);
          expect(obj.status).toBe('fail');
        },
        setHeader: (header, value) => {
          expect(header).toBe('Content-Type');
          expect(value).toBe('application/json');
        }
      };

      controller.registrarMensagem({}, res);
    });

    it('should validate invalid params', () => {
      let res = {
        end: (data) => {
          let obj = JSON.parse(data);
          expect(obj.status).toBe('fail');
        },
        setHeader: (header, value) => {
          expect(header).toBe('Content-Type');
          expect(value).toBe('application/json');
        }
      };

      controller.registrarMensagem({}, res, null, '{}');
    });

    it('should validate invalid sala', () => {
      let res = {
        end: (data) => {
          let obj = JSON.parse(data);
          expect(obj.status).toBe('fail');
        },
        setHeader: (header, value) => {
          expect(header).toBe('Content-Type');
          expect(value).toBe('application/json');
        }
      };

      controller.registrarMensagem({}, res, null, JSON.stringify({ id_usuario: id_usuario, id_sala: '-' + (new Date()).getTime(), mensagem: "TESTE" }));
    });

    it('should validate invalid user', () => {
      let res = {
        end: (data) => {
          let obj = JSON.parse(data);
          expect(obj.status).toBe('fail');
        },
        setHeader: (header, value) => {
          expect(header).toBe('Content-Type');
          expect(value).toBe('application/json');
        }
      };

      controller.registrarMensagem({}, res, null, JSON.stringify({ id_usuario: '-' + (new Date()).getTime(), id_sala: id_sala, mensagem: "TESTE" }));
    });

    it('should send a valid response', () => {
      let res = {
        end: (data) => {
          let obj = JSON.parse(data);
          expect(obj).toBe(true);
        },
        setHeader: (header, value) => {
          expect(header).toBe('Content-Type');
          expect(value).toBe('application/json');
        }
      };

      controller.registrarMensagem({}, res, null, JSON.stringify({ id_usuario: id_usuario, id_sala: id_sala, mensagem: "TESTE" }));
    });
  });

  describe('Method listarMensagensPorSala', () => {
    it('should validate null params', () => {
      let res = {
        end: (data) => {
          let obj = JSON.parse(data);
          expect(obj.status).toBe('fail');
        },
        setHeader: (header, value) => {
          expect(header).toBe('Content-Type');
          expect(value).toBe('application/json');
        }
      };

      controller.listarMensagensPorSala({}, res);
    });

    it('should validate invalid sala', () => {
      let res = {
        end: (data) => {
          let obj = JSON.parse(data);
          expect(obj.status).toBe('fail');
        },
        setHeader: (header, value) => {
          expect(header).toBe('Content-Type');
          expect(value).toBe('application/json');
        }
      };

      controller.listarMensagensPorSala({}, res, ['-' + (new Date()).getTime()]);
    });

    it('should send a valid response', () => {
      let res = {
        end: (data) => {},
        setHeader: (header, value) => {
          expect(header).toBe('Content-Type');
          expect(value).toBe('application/json');
        }
      };

      controller.registrarMensagem({}, res, null, JSON.stringify({ id_usuario: id_usuario, id_sala: id_sala, mensagem: "TESTE" }));

      res.end = (data) => {
        let obj = JSON.parse(data);
        expect(typeof obj).toBe('object');
        expect(obj[obj.length - 1].mensagem).toBe('TESTE');
      };

      controller.listarMensagensPorSala({}, res, [id_sala]);
    });
  });

  describe('Method pollingMensagensPorSala', () => {
    it('should validate null params', () => {
      let res = {
        end: (data) => {
          let obj = JSON.parse(data);
          expect(obj.status).toBe('fail');
        },
        setHeader: (header, value) => {
          expect(header).toBe('Content-Type');
          expect(value).toBe('application/json');
        }
      };

      controller.pollingMensagensPorSala({}, res);
    });

    it('should validate invalid sala', () => {
      let res = {
        end: (data) => {
          let obj = JSON.parse(data);
          expect(obj.status).toBe('fail');
        },
        setHeader: (header, value) => {
          expect(header).toBe('Content-Type');
          expect(value).toBe('application/json');
        }
      };

      controller.pollingMensagensPorSala({}, res, ['-' + (new Date()).getTime()]);
    });

    it('should send a valid response', () => {
      let res = {
        end: (data) => {},
        setHeader: (header, value) => {
          expect(header).toBe('Content-Type');
          expect(value).toBe('application/json');
        }
      };

      controller.pollingMensagensPorSala({}, res, [id_sala]);
    });
  });
});
