'use strict';

const io = require('socket.io')(7333);
const Printer = require('./bematech/printer');
let socket = null;
let printers = {};

module.exports = {

  start() {
    io.on('connection', this._onSocketConnection.bind(this));
  },

  // @name print
  // @description Realiza impressão
  // @params {Object} options - Detalhes da impressão, como IP / Porta da impressora, dados de template e layout de impressão
  print(options) {
    socket.emit('print:start');

    this._validatePrint(options).then(() => {

      // Notifica recebimento de impressão
      io.emit('print:message', { description: `Recebendo pedido de impressão`, time: new Date(), type: 'info' });
      io.emit('print:message', { description: `Layout: ${options.layout}`, time: new Date(), type: 'info' });
      io.emit('print:message', { description: `IP: ${options.printer.ip}:${options.printer.port}`, time: new Date(), type: 'info' });

      this._loadPrinter(options).then((printer) => {
        return printer.print(options).then(() => {
          socket.emit('print:end');
          io.emit('print:message', { description: 'Impressão realizada com sucesso', time: new Date(), type: 'success' });
        });
      }, (err) => {
        return io.emit('print:error', { description: err.description, code: err.code, time: new Date(), type: 'error' });
      });

    }, (err) => {
      return io.emit('print:error', { description: err.description, code: err.code, time: new Date(), type: 'error'  });
    });
  },

  // @name _onSocketConnection
  // @description Método de callback de conexão com socket.io
  // @params {Object} _socket - socket io
  _onSocketConnection(_socket) {
    socket = _socket;

    // Envia mensagem informando que socket está conectado
    socket.emit('socket:connected', {});

    socket.on('print', this.print.bind(this));
  },

  // @name _validatePrint
  // @description Verifica se os dados enviados para impressão estão corretos
  // @params {Object} options - Detalhes da impressão, como IP / Porta da impressora, dados de template e layout de impressão
  _validatePrint(options) {
    return new Promise((resolve, reject) => {

      // Verifica se há impressora
      if(!options.printer) {
        return reject({ description: 'Para imprimir deve ser passado um objeto com dados da impressora', code: 100 });
      }

      if(!options.copies) {
        options.copies = 1;
      }

      if(!Number.isInteger(options.copies)) {
        return reject({ description: 'Número de cópias deve ser um número inteiro', code: 104 });
      }

      // Verifica se há IP
      if(!options.printer.ip) {
        return reject({ description: 'Para imprimir deve ser informado o IP da impressora', code: 101 });
      }

      // Verifica se há porta
      if(!options.printer.port) {
        return reject({ description: 'Para imprimir deve ser informado a porta da impressora', code: 102 });
      }

      // Verifica se há layout
      if(!options.layout) {
        return reject({ description: 'Para imprimir deve ser informado um layout de impressão', code: 103 });
      }

      return resolve();
    });
  },

  // @name _loadPrinter
  // @description Carrega impressora
  // @params {Object} options - Detalhes da impressão, como IP / Porta da impressora, dados de template e layout de impressão
  _loadPrinter(options) {
    return new Promise((resolve, reject) => {

      // Impressora já foi carregada pelo sistema
      if(printers[options.printer.ip]) {
        io.emit('print:message', { description: 'Impressora já encontra-se carregada', time: new Date(), type: 'info' });
        return resolve(printers[options.printer.ip]);

      // Impressora ainda não foi carregada
      } else {
        io.emit('print:message', { description: 'Impressora precisa ser carregada...', time: new Date(), type: 'info' });

        // Cria novo socket com impressora
        new Printer({ ip: options.printer.ip, port: 9100 }).then((_printer) => {

          // Adiciona num objeto para facilitar encontrar em um futuro
          printers[options.printer.ip] = _printer;
          io.emit('print:message', { description: 'Criado socket com a impressora', time: new Date(), type: 'info' });

          return resolve(printers[options.printer.ip]);
        }, (err) => {
          return reject(err);
        });
      }
    });
  }
};