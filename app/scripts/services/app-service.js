'use strict';
angular
  .module('app')
  //Http request setup
  .service('Request', [
    '$http',
    'envService',
    function($http, envService) {
      var baseUrl = envService.read().apiUrl;

      this.get = function(endpoint) {
        return $http.get(baseUrl + endpoint);
      };

      this.post = function(endpoint, postData) {
        return $http.post(baseUrl + endpoint, postData);
      };

      this.put = function(endpoint, postData) {
        return $http.put(baseUrl + endpoint, postData);
      };

      this.delete = function(endpoint) {
        return $http.delete(baseUrl + endpoint);
      };

      // var file = []
      this.uploadFile = function(endpoint, file) {
        var fd = new FormData();
        fd.append('file', file);
        return $http.put(baseUrl + endpoint, fd, {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        });
      };
    }
  ])
  .service('Utill', function() {
    var options = {
      theme: 'sk-cube-grid',
      message: 'Working for you boss...',
      backgroundColor: 'rgb(77, 82, 102)',
      textColor: 'white'
    };

    this.startLoader = function() {
      HoldOn.open(options);
    };

    this.endLoader = function() {
      HoldOn.close();
    };

    this.showSuccess = function(msg) {
      $.toast({
        heading: 'Success',
        text: msg,
        showHideTransition: 'fade',
        position: 'top-right',
        icon: 'success'
      });
    };

    this.showError = function(msg) {
      $.toast({
        heading: 'Error',
        text: msg,
        showHideTransition: 'fade',
        position: 'top-right',
        icon: 'error'
      });
    };
  })

  .factory('broadcastService', function($rootScope) {
    return {
      send: function(msg, data) {
        $rootScope.$broadcast(msg, data);
      }
    };
  })

  //complete user  service
  .factory('UserService', function(Request, $timeout, $http, $localStorage) {
    var factory = {};

    factory.userList = function() {
      return Request.get('/users');
    };
    factory.userProfileUpdate = function(userId, data) {
      return Request.put('/users/' + userId, data);
    };

    factory.userSearch = function(id) {
      return Request.get('/users/' + id);
    };
    factory.saveToken = function(token) {
      $localStorage.jwt = JSON.stringify(token);
    };
    factory.saveCurrentUser = function(data) {
      $localStorage.currentUser = JSON.stringify(data);
    };
    factory.getCurrentUser = function() {
      if ($localStorage.currentUser) {
        return JSON.parse($localStorage.currentUser);
      }
      return null;
    };
    factory.getCurrentUserToken = function() {
      if ($localStorage.jwt) {
        return JSON.parse($localStorage.jwt);
      }
      return null;
    };
    factory.logoutCurrentUser = function() {
      if ($localStorage.$reset()) {
        return true;
      }
      return false;
    };
    return factory;
  })