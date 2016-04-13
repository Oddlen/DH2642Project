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


agendaApp.directive('dynamic', function ($compile) {
    return {
      restrict: 'A',
      replace: true,
      link: function (scope, ele, attrs) {
        scope.$watch(attrs.dynamic, function(html) {
          ele.html(html);
          $compile(ele.contents())(scope);
        });
      }
    };
  })