var controller = require('../../controllers/sala-controller');

describe('Module sala-controller', () => {
  let nickname;
  let id_usuario;
  let id_sala;

  beforeAll(async () => {
    let res = { end: (data) => { id_sala = JSON.parse(data); }, setHeader: (header, value) => {} };
    await controller.criarSala({}, res, null, JSON.stringify({ sala: 'TESTE' + (new Date()).getTime() }));

    res.end = (data) => { id_usuario = JSON.parse(data); };
    nickname = 'TESTE' + (new Date()).getTime();
    await controller.registarUsuario({}, res, null, JSON.stringify({ nickname: nickname, sala: id_sala }));
  });

  afterAll(async () => {
    await controller.sairSala(id_usuario);
  });

  describe('Method registarUsuario', () => {
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

      controller.registarUsuario({}, res);
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

      controller.registarUsuario({}, res, null, '{}');
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

      controller.registarUsuario({}, res, null, JSON.stringify({ nickname: 'TESTE' + (new Date()).getTime(), sala: '-' + (new Date()).getTime() }));
    });

    it('should validate nickname in use', () => {
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

      controller.registarUsuario({}, res, null, JSON.stringify({ nickname: nickname, sala: id_sala }));
    });

    it('should send a valid response', () => {
      let id;
      let res = {
        end: (data) => {
          expect(typeof data).toBe('string');
          id = JSON.parse(data);
        },
        setHeader: (header, value) => {
          expect(header).toBe('Content-Type');
          expect(value).toBe('application/json');
        }
      };

      controller.registarUsuario({}, res, null, JSON.stringify({ nickname: 'TESTE' + (new Date()).getTime(), sala: id_sala }));
      controller.sairSala(id);
    });
  });

  describe('Method listarSalas', () => {
    it('should send a valid response', () => {
      let res = {
        end: (data) => {
          let obj = JSON.parse(data);
          let ret = obj.filter(i => { return i.id == id_sala; });
          expect(ret.length).toBe(1);
        },
        setHeader: (header, value) => {
          expect(header).toBe('Content-Type');
          expect(value).toBe('application/json');
        }
      };

      controller.listarSalas({}, res);
    });
  });

  describe('Method listarUsuarios', () => {
    it('should send a valid response', () => {
      let res = {
        end: (data) => {
          let obj = JSON.parse(data);
          let ret = obj.filter(i => { return i == nickname; });
          expect(ret.length).toBe(1);
        },
        setHeader: (header, value) => {
          expect(header).toBe('Content-Type');
          expect(value).toBe('application/json');
        }
      };

      controller.listarUsuarios({}, res, [id_sala]);
    });
  });

  describe('Method criarSala', () => {
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

      controller.criarSala({}, res);
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

      controller.criarSala({}, res, null, '{}');
    });

    it('should validate sala exists', () => {
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

      controller.criarSala({}, res, null, JSON.stringify({ sala: id_sala }));
    });

    it('should send a valid response', () => {
      let sala = 'TESTE' + (new Date()).getTime();
      let res = {
        end: (data) => {
          let obj = JSON.parse(data);
          expect(obj).toBe(sala.toLowerCase());
        },
        setHeader: (header, value) => {
          expect(header).toBe('Content-Type');
          expect(value).toBe('application/json');
        }
      };

      controller.criarSala({}, res, null, JSON.stringify({ sala: sala }));
    });
  });

  describe('Method trocarSala', () => {
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

      controller.trocarSala({}, res);
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

      controller.trocarSala({}, res, null, '{}');
    });

    it('should validate sala origem exists', () => {
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

      controller.trocarSala({}, res, ['TESTE' + (new Date()).getTime()], JSON.stringify({ sala_destino: id_sala, id_usuario, id_usuario }));
    });

    it('should validate sala destino exists', () => {
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
  
      controller.trocarSala({}, res, [id_sala], JSON.stringify({ sala_destino: 'TESTE' + (new Date()).getTime(), id_usuario, id_usuario }));
    });

    it('should send a valid response', async () => {
      let sala_destino;
      let res = { end: (data) => { sala_destino = JSON.parse(data); }, setHeader: (header, value) => {} };
      await controller.criarSala({}, res, null, JSON.stringify({ sala: 'TESTE' + (new Date()).getTime() }));

      let sala = 'TESTE' + (new Date()).getTime();
      res = {
        end: (data) => {
          let obj = JSON.parse(data);
          expect(obj).toBe(true);
        },
        setHeader: (header, value) => {
          expect(header).toBe('Content-Type');
          expect(value).toBe('application/json');
        }
      };

      controller.trocarSala({}, res, [id_sala], JSON.stringify({ sala_destino: sala_destino, id_usuario, id_usuario }));
    });
  });

  describe('Method sair', () => {
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

      controller.sair({}, res, [id_usuario]);
    });
  });
});
