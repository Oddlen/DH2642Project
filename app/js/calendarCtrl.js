agendaApp.controller('CalendarCtrl', function ($scope, Agenda) {

	var myDataRef = new Firebase('https://dh2642.firebaseIO.com/');
	var eventRef = myDataRef.child("events");
	var agendaArray = [];

	myFunction();
	var user = Agenda.getUser();
	if (user === "") {
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

	/*<div class="col-md-2">
		<div class="panel panel-default" id="day1">
			<div class="panel-heading">{{date}}</div>
			<div class="panel-body">Panel Content</div>
		</div>
	</div>*/
	function myFunction() {

		eventRef.child("d01m04y2016").child("eventName1_Mark").child("agenda").on("value",
			function (snapshot) {
				console.log(snapshot.val());
			},
			function (errorObject) {
				console.log("The read failed: " + errorObject.code);
			});

	}

});