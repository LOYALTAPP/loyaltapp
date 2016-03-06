// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
     
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  if(ionic.Platform.isAndroid()){
    $ionicConfigProvider.scrolling.jsScrolling(false);
  }
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.cardhome', {
      url: '/cardhome',
      abstract: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/cardhome.html'
        }
      }
  })
  .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
          controller: 'ProfileCtrl'
        }
      }
  })
  .state('app.search', {
      url: '/partners',
      views: {
        'menuContent': {
          templateUrl: 'templates/partners.html',
          controller: 'PartnersCtrl'
        }
      }
  })
  .state("app.partnerDetails",{
    url: '/partners/partnerDetails/:partnerId',
    views: {
      'menuContent':{
        templateUrl : "templates/partnerDetails.html",
        controller : 'PartnerDetailsCtrl'
      }
    }
  })
  .state('app.cardhome.card',{
    url: '/card',
    views: {
      'tab-dash':{
        templateUrl: 'templates/card.html',
        controller: 'CardCtrl'
      }
    }
  })
  .state("app.cardhome.transactions",{
    url: '/transactions',
    views:{
      'tab-trans':{
        templateUrl: 'templates/transactions.html',
        controller: 'TransactionsCtrl'
      }
    }
  })
  .state('app.cardhome.transaction', {
    url: '/transaction/:transactionId',
    views: {
      'tab-trans': {
        templateUrl: 'templates/transaction.html',
        controller: 'TransactionCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});