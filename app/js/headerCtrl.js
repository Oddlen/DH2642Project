/**
 * HeaderCtrl controlls all actions that depends on the navbar
 */
agendaApp.controller('HeaderCtrl', function ($scope,$location, Agenda) {

	// Get the logged in user
	$scope.user = Agenda.getUser();

	/**
	 * A function for loading home-page, which depends on if the user is logged in or not
	 */
	$scope.loadHome = function () {
		//console.log("load");
		if($scope.user===""){
			$location.url('/home');
		}else{
			$location.url('/agenda');
		}
	};

	/**
	 * Function for logging out the user
	 */
	$scope.logout = function () {
		Agenda.logout();
		$location.url('/home');
	};

});