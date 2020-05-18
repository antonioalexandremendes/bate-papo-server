var request = require('request');
var server = require('../../server');
var salaController = require('../../controllers/sala-controller');

const ENDPOINT = '/sala';
const PORT = 3002;
const HOST = 'localhost';
const URL = `http://${HOST}:${PORT}`;

describe(ENDPOINT, () => {
  let nickname;
  let id_usuario;
  let id_sala;

  beforeAll(() => {
    server.listen(PORT);

    let res = { end: (data) => { id_sala = JSON.parse(data); }, setHeader: (header, value) => {} };
    salaController.criarSala({}, res, null, JSON.stringify({ sala: 'TESTE' + (new Date()).getTime() }));

    res.end = (data) => { id_usuario = JSON.parse(data); };
    nickname = 'TESTE' + (new Date()).getTime();
    salaController.registarUsuario({}, res, null, JSON.stringify({ nickname: nickname, sala: id_sala }));
  });

  afterAll(() => {
    server.close();
  });

  describe('GET /', () => {
    it('should respond with success status', (done) => {
      request.get(`${URL}${ENDPOINT}`, (error, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toBe('application/json');
        done();
      });
    });

    it('should return valid data', (done) => {
      request.get(`${URL}${ENDPOINT}`, (error, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toBe('application/json');

        let ret = JSON.parse(body);
        expect(Array.isArray(ret)).toBe(true);

        ret.every(i => {
          expect(i).toHaveProperty('id');
          expect(i).toHaveProperty('nome');
          return true;
        });

        done();
      });
    });
  });

  describe('POST /registar-usuario', () => {
    it('should validate null params', (done) => {
      request.post({
        uri: `${URL}${ENDPOINT}/registar-usuario`,
        headers: {'content-type' : 'application/x-www-form-urlencoded'}
      }, (error, res, body) => {
        expect(res.statusCode).not.toBe(200);
        expect(res.headers['content-type']).toBe('application/json');

        let ret = JSON.parse(body);
        expect(ret.status).toBe('fail');
        done();
      });
    });

    it('should validate invalid params', (done) => {
      request.post({
        uri: `${URL}${ENDPOINT}/registar-usuario`,
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        body: JSON.stringify({ sala: id_sala })
      }, (error, res, body) => {
        expect(res.statusCode).not.toBe(200);
        expect(res.headers['content-type']).toBe('application/json');

        let ret = JSON.parse(body);
        expect(ret.status).toBe('fail');
        done();
      });
    });

    it('should validate invalid sala', (done) => {
      request.post({
        uri: `${URL}${ENDPOINT}/registar-usuario`,
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        body: JSON.stringify({ nickname: 'TESTE' + (new Date()).getTime(), sala: '-' + (new Date()).getTime() })
      }, (error, res, body) => {
        expect(res.statusCode).not.toBe(200);
        expect(res.headers['content-type']).toBe('application/json');

        let ret = JSON.parse(body);
        expect(ret.status).toBe('fail');
        done();
      });
    });

    it('should validate nickname in use', (done) => {
      request.post({
        uri: `${URL}${ENDPOINT}/registar-usuario`,
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        body: JSON.stringify({ nickname: nickname, sala: id_sala })
      }, (error, res, body) => {
        expect(res.statusCode).not.toBe(200);
        expect(res.headers['content-type']).toBe('application/json');

        let ret = JSON.parse(body);
        expect(ret.status).toBe('fail');
        done();
      });
    });

    it('should respond with success status', (done) => {
      request.post({
          uri: `${URL}${ENDPOINT}/registar-usuario`,
          headers: {'content-type' : 'application/x-www-form-urlencoded'},
          body: JSON.stringify({ nickname: 'TESTE' + (new Date()).getTime(), sala: id_sala })
        }, (error, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(res.headers['content-type']).toBe('application/json');
          done();
        });
    });
  });
});
