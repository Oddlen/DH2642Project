agendaApp.controller('CalendarCtrl', function ($scope, Agenda) {

var user = Agenda.getUser();
if(user===""){
 //window.location="/";
 //return;
}

	$scope.prevday = function () {
		console.log("ladda föregående dag");
	};

	$scope.prevweek = function () {
		console.log("ladda föregående 5 dagar");
	};

	$scope.nextday = function () {
		console.log("ladda kommande dag");
	};

	$scope.nextweek = function () {
		console.log("ladda kommande 5 dagar");
	};
});