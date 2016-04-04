var agendaApp = angular.module('agendaPlanner', ['ngRoute','ngResource','ngSanitize','angularSpinner','ngCookies', 'ui.bootstrap', 'dndLists']);

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
      when('/agenda', {
        templateUrl: 'partials/agenda.html',
        controller: 'AgendaCtrl'
      }).
    when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'RegisterCtrl'
    }).
      otherwise({
        redirectTo: '/home'
      });
  }]);
