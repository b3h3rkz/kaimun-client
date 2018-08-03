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

  .service('Modal', function($mdDialog){

    this.showAlert = function(ev) {
      $mdDialog.show(
        $mdDialog.alert()
          .title('This is an alert title')
          .content('You can specify some description text in here.')
          .ariaLabel('Password notification')
          .ok('Got it!')
          .targetEvent(ev)
      );
    };

    this.showAdvanced = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'views/ui/material/dialog.tmpl.html',
        targetEvent: ev,
      })
      .then(function(answer) {
        $scope.alert = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.alert = 'You cancelled the dialog.';
      });
    };
  
  })


  .service('Utill', function() {
    var options = {
      theme: 'sk-cube-grid',
      message: 'We are working...',
      backgroundColor: 'rgb(77, 82, 102)',
      textColor: 'white'
    };

    this.startLoader = function() {
      HoldOn.open(options);
    };

    this.endLoader = function() {
      HoldOn.close();
    };

    this.showConfirm = function(msg, callback) {
      console.log('ShowConfirm not Impletmented');
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

  .service('TransactionAPIRequest', function($http) {
    var baseUrl = 'https://chain.so/api/v2/';

    this.get = function(endpoint) {
      return $http.get(baseUrl + endpoint, { headers: { 'Content-Type': 'text/plain' } });
    };

    this.post = function(endpoint, postData) {
      return $http.post(baseUrl + endpoint, postData, { headers: { 'Content-Type': 'text/plain' } });
    };
  })

  .service('PriceApiRequest', function($http) {
    var baseUrl = 'https://min-api.cryptocompare.com/';

    this.get = function(endpoint) {
      return $http.get(baseUrl + endpoint, { headers: { 'Content-Type': 'text/plain' } });
    };

    this.post = function(endpoint, postData) {
      return $http.post(baseUrl + endpoint, postData, { headers: { 'Content-Type': 'text/plain' } });
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

  .service('dateOfWeek', function(moment) {
    return function(weekNo, year) {
      var d1 = new Date();
      var numOfdaysPastSinceLastMonday = eval(d1.getDay() - 1);
      d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
      var weekNoToday = d1.getWeek();
      var weeksInTheFuture = eval(weekNo - weekNoToday);
      d1.setDate(d1.getDate() + eval(7 * weeksInTheFuture));
      var rangeIsFrom = eval(d1.getMonth() + 1) + '/' + d1.getDate() + '/' + d1.getFullYear();
      d1.setDate(d1.getDate() + 6);
      var rangeIsTo = eval(d1.getMonth() + 1) + '/' + d1.getDate() + '/' + d1.getFullYear();
      // return rangeIsFrom + " to "+rangeIsTo;

      return { start: rangeIsFrom, end: rangeIsTo };
    };
  })

  .directive('fileModel', [
    '$parse',
    function($parse) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;

          element.bind('change', function() {
            scope.$apply(function() {
              modelSetter(scope, element[0].files[0]);
            });
          });
        }
      };
    }
  ])

  .filter('age', function() {
    return function(dateString) {
      var today = new Date();
      var birthDate = new Date(dateString);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };
  })

  .filter('ago', function() {
    return function(date) {
      return moment(date).fromNow();
    };
  });
