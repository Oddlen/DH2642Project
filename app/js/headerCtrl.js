agendaApp.controller('HeaderCtrl', function ($scope,$location, Agenda) {

	$scope.user = Agenda.getUser();
	$scope.loadHome = function () {
		console.log("load");
		if($scope.user===""){
			$location.url('/home');
		}else{
			$location.url('/agenda');
		}
	};

	$scope.previouspage = function () {
		console.log("back to previous page");
	};

	$scope.logout = function () {
		console.log("logging out user somehow");
		Agenda.logout();
		$location.url('/home');
	};

});