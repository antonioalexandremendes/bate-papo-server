var controller = require('../../controllers/cliente-controller');

describe('Module cliente-controller', () => {
  describe('Method carregarCliente', () => {
    it('should send a valid response', () => {
      let res = {
        end: () => {
          expect(true).toBe(true);
        },
        write: (html) => {
          expect(typeof html).toBe('object');
        },
        writeHeader: (status, header) => {
          expect(status).toBe(200);
          expect(header).toStrictEqual({ "Content-Type": "text/html" });
        }
      };

      controller.carregarCliente({}, res)
    });
  });
});
