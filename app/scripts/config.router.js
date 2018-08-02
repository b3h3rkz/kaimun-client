'use strict';

/**
 * @ngdoc function
 * @name app.config:uiRouter
 * @description
 * # Config
 * Config for the router
 */
angular
  .module('app')
  .run([
    '$rootScope',
    '$state',
    '$stateParams',
    'UserService',
    '$http',
    '$location',
    '$window',
    'Idle',
    'Utill',
    function($rootScope, $state, $stateParams, UserService, $http, $location, $window, Idle, Utill) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      Idle.watch();

      $rootScope.currentUserToken = UserService.getCurrentUserToken();
      $rootScope.currentUser = UserService.getCurrentUser();
      if ($rootScope.currentUserToken) {
        // $http.defaults.headers.common['Authorization'] = 'JWT' + ' ' + UserService.getCurrentUserToken();
      } else {
      }

      $rootScope.$on('$stateChangeStart', function(event, toState) {
        $rootScope.currentUserToken = UserService.getCurrentUserToken();
        $rootScope.currentUser = UserService.getCurrentUser();

        if (toState.data && toState.data.requiredLogin && toState.data.phoneVerified || 
          toState.data && toState.data.requiredLogin && toState.data.phoneVerified && toState.data.verifiedAccount
        ) {
        }


        if (toState.data && toState.data.requiredLogin) {
          if (!$rootScope.currentUserToken) {
            event.preventDefault();
            // $window.location.href = '/';
            $state.go('access.signin');
          }
        } else {
          if ($rootScope.currentUserToken) {
            if (toState.name === 'access.signin' || toState.name === 'access.signup') {
              event.preventDefault();
              $state.go('app.dashboard');
            }
          }
        }
      });
    }
  ])

  .factory('ApiInterceptor', function($localStorage, $injector, $rootScope, envService) {
    return {
      request: function(config) {
        if ($rootScope.currentUserToken) {
          var UserService = $injector.get('UserService');
          if (config.url.indexOf(envService.read().apiUrl) > -1) {
            config.headers['Authorization'] = 'JWT' + ' ' + UserService.getCurrentUserToken();
          }
        }
        return config;
      },
      response: function(response) {
        return response;
      }
    };
  })

  .config(function($httpProvider) {
    $httpProvider.interceptors.push('ApiInterceptor');
  })

  .config([
    '$stateProvider',
    '$urlRouterProvider',
    'MODULE_CONFIG',
    function($stateProvider, $urlRouterProvider, MODULE_CONFIG) {
      $urlRouterProvider.otherwise('/app/dashboard');
      $stateProvider
        .state('app', {
          abstract: true,
          url: '/app',
          data: { phoneVerified: true },
          views: {
            '': {
              templateUrl: 'views/layout.html'
            },
            aside: {
              templateUrl: 'views/aside.html'
            },
            content: {
              templateUrl: 'views/content.html'
            }
          }
        })
        .state('app.dashboard', {
          url: '/dashboard',
          templateUrl: 'models/dashboard/dashboard.html',
          data: { title: 'Kaimun', folded: true, requiredLogin: true, reload: true},
          controller: 'DashCtrl',
          resolve: load(['scripts/controllers/chart.js', 'scripts/controllers/vectormap.js'])
        })

        .state('access', {
          url: '/access',
          template: '<div class="indigo bg-big"><div ui-view class="fade-in-down smooth"></div></div>'
        })

        .state('access.signin', {
          url: '/signin/',
          templateUrl: 'models/auth/signin.html',
          controller: 'LoginCtrl'
        })

        .state('access.signup', {
          url: '/signup',
          templateUrl: 'models/auth/signup.html',
          controller: 'RegistrationCtrl'
        })

        .state('access.go-to-confirm', {
          url: '/email-confirmation',
          templateUrl: 'models/auth/go-to-confirm.html',
          controller: 'RegistrationCtrl'
        })

        .state('access.forgot-password', {
          url: '/forgot-password',
          templateUrl: 'models/auth/forgot-password.html',
          controller: 'ForgotCtrl'
        })

        .state('access.confirm-password-reset', {
          url: '/password-reset/confirm/{userId}/{token}/',
          templateUrl: 'models/auth/confirm-password-reset.html',
          controller: 'ResetCtrl'
        })

        .state('access.email-verification', {
          url: '/verify-email/{key}',
          templateUrl: 'models/auth/email-confirmed.html',
          controller: 'EmailVerificationCtrl'
        })

        .state('app.profile', {
          url: '/account',
          templateUrl: 'models/account/account.html',
          controller: 'UserCtrl',
          data: { title: 'My Profile', requiredLogin: true }
        })


  

      function load(srcs, callback) {
        return {
          deps: [
            '$ocLazyLoad',
            '$q',
            function($ocLazyLoad, $q) {
              var deferred = $q.defer();
              var promise = false;
              srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
              if (!promise) {
                promise = deferred.promise;
              }
              angular.forEach(srcs, function(src) {
                promise = promise.then(function() {
                  angular.forEach(MODULE_CONFIG, function(module) {
                    if (module.name == src) {
                      if (!module.module) {
                        name = module.files;
                      } else {
                        name = module.name;
                      }
                    } else {
                      name = src;
                    }
                  });
                  return $ocLazyLoad.load(name);
                });
              });
              deferred.resolve();
              return callback
                ? promise.then(function() {
                    return callback();
                  })
                : promise;
            }
          ]
        };
      }
    }
  ])

  .config(function(envServiceProvider) {
    envServiceProvider.config({
      domains: {
        development: ['localhost'],
        production: ['https://api.kaimun.com/api/v1/']
      },
      vars: {
        development: {
          // apiUrl: 'https://api.kaimun.com/api/v1/',
          apiUrl: 'http://localhost:8000/api/v1/',
        },
        production: {
          apiUrl: 'https://api.kaimun.com/api/v1/',

        },
        defaults: {
          apiUrl: 'https://api.kaimun.com/api/v1/'
        }
      }
    });
    envServiceProvider.check();
  });
