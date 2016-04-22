var agendaApp = angular.module('agendaPlanner', ['ngRoute','ngResource','ngSanitize','angularSpinner','ngCookies', 'ui.bootstrap', 'dndLists','localytics.directives']);

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

/**
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
  })**/

agendaApp.directive('ngConfirmClick', [
  function(){
    return {
      link: function (scope, element, attr) {
        var msg = attr.ngConfirmClick || "Are you sure?";
        var clickAction = attr.confirmedClick;
        element.bind('click',function (event) {
          if ( window.confirm(msg) ) {
            scope.$eval(clickAction)
          }
        });
      }
    };
  }])

agendaApp.directive('compile', ['$compile', function ($compile) {
    return function(scope, element, attrs) {
      scope.$watch(
        function(scope) {
          // watch the 'compile' expression for changes
          return scope.$eval(attrs.compile);
        },
        function(value) {
          // when the 'compile' expression changes
          // assign it into the current DOM
          element.html(value);

          // compile the new DOM and link it to the current
          // scope.
          // NOTE: we only compile .childNodes so that
          // we don't get into infinite loop compiling ourselves
          $compile(element.contents())(scope);
        }
    );
  };
}]);
