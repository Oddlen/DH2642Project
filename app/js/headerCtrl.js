agendaApp.controller('HeaderCtrl', function ($scope, Agenda) {

	$scope.user = Agenda.getUser();
	$scope.loadHome = function () {
		if($scope.user===""){
			window.location = "#/home";
		}else{
			window.location = "#/calendar";
		}
	};

	$scope.previouspage = function () {
		console.log("back to previous page");
	};

	$scope.logout = function () {
		console.log("logging out user somehow");
		Agenda.logout();
		window.location = "#/home";
	};

});