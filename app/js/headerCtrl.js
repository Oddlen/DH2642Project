agendaApp.controller('HeaderCtrl', function ($scope, Agenda) {

	$scope.user = Agenda.usernameRef;
	$scope.loadHome = function () {
		window.location = "#/home";
	};

	$scope.previouspage = function () {
		console.log("back to previous page");
	};

	$scope.logout = function () {
		console.log("logging out user somehow");
	};

});