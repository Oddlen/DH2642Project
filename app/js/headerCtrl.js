agendaApp.controller('HeaderCtrl', function ($scope, Agenda) {

	console.log("console");
	$scope.user = Agenda.usernameRef;
	console.log($scope.user);
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