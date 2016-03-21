var agendaApp = angular.module('agendaPlanner', ['ngRoute','ngResource','angularSpinner','ngCookies', 'ui.bootstrap']);

agendaApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'partials/home.html',
		controller: 'HomeCtrl'
      }).
      when('/calendar', {
        templateUrl: 'partials/calendar.html',
        controller: 'CalendarCtrl'
      }).
      when('/agenda/:id', {
        templateUrl: 'partials/agenda.html',
        controller: 'AgendaCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);
  