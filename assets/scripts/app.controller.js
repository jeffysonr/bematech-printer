'use strict';

// Desce scroll até o fim do elemento .debugger
let goToBottom = () => {
  let debuggerEl = document.querySelector('.debugger');
  debuggerEl.scrollTop = debuggerEl.scrollHeight;
};

let controller = ($scope, $filter, $timeout, $window) => {

  // Conecta com o socket do electron
  $scope.socket = io('http://localhost:7333');

  $scope.debug = {
    messages: []
  };

  // Ouve recebimento de mensagens do socket
  let onMessage = (data) => {
    $timeout(() => {
      $scope.debug.messages.push({
        time: $filter('date')(data.time, 'HH:mm:ss'),
        content: data.description,
        type: data.type
      });

      goToBottom();
    });
  };

  $scope.socket.on('connect', () => {
    $scope.socket.on('print:error', onMessage);
    $scope.socket.on('print:message', onMessage);
  });
};

angular.module('app', []).controller('appController', controller);