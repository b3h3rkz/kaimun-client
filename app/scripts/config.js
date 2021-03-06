// config

var app =  
angular.module('app')
  .config(
    [        '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($controllerProvider,   $compileProvider,   $filterProvider,   $provide) {
        
        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive  = $compileProvider.directive;
        app.filter     = $filterProvider.register;
        app.factory    = $provide.factory;
        app.service    = $provide.service;
        app.constant   = $provide.constant;
        app.value      = $provide.value;
    }
  ])
  
  .config(['$raveProvider', function ($raveProvider) {
    $raveProvider.config({
        key: "FLWPUBK-3d15ffa5c7ec93883c651c0f441bc2d0-X",
        isProduction: false
    })
  }])

    .config(function(IdleProvider, KeepaliveProvider) {
        // configure Idle settings
        IdleProvider.idle(900); // in seconds
        IdleProvider.timeout(20); // in seconds
        // KeepaliveProvider.interval(2); // in seconds
    })

  .config(['$translateProvider', function($translateProvider){
    // Register a loader for the static files
    // So, the module will search missing translation tables under the specified urls.
    // Those urls are [prefix][langKey][suffix].
    $translateProvider.useStaticFilesLoader({
      prefix: 'i18n/',
      suffix: '.js'
    });
    // Tell the module what language to use by default
    $translateProvider.preferredLanguage('en');
    // Tell the module to store the language in the local storage
    $translateProvider.useLocalStorage();
  }]);

