'use strict';

/**
 * @ngdoc overview
 * @name app
 * @description
 * # app
 *
 * Main module of the application.
 */
angular
  .module('app', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngSanitize',
      'ActivityMonitor',
    'ngTouch',
    'ngMaterial',
    'angular-clipboard',
    'ngStorage',
    'ngStore',
    'ui.router',
    'ui.utils',
    'ui.bootstrap',
    'ui.load',
    'ui.jp',
    'pascalprecht.translate',
    'oc.lazyLoad',
    'angular-loading-bar',
    'environment',
      'angularUtils.directives.dirPagination',
      'ngIdle',
      'ravepayment'

  ]);
