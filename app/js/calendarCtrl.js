agendaApp.controller('CalendarCtrl', function ($scope, Agenda) {

	var myDataRef = new Firebase('https://dh2642.firebaseIO.com/');
	var eventRef = myDataRef.child("events");
	var agendaArray = [];
	var date = new Date();
	date.setFullYear(2016, 3, 1); //inita dagen att vara 1:a april
	var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var datestring;

	myFunction();
	var user = Agenda.getUser();
	if (user === "") {
		console.log("inte inloggad");
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



	function loaddates(int) {


		var today = date;
		today.setDate(date.getDate() + int);
		var dd = today.getDate();
		var mm = today.getMonth() + 1; //January is 0!
		var yyyy = today.getFullYear();

		if (dd < 10) {
			dd = '0' + dd
		}

		if (mm < 10) {
			mm = '0' + mm
		}

		datestring = dd + '/' + mm + '/' + yyyy;
		datestring = weekday[today.getDay()] + " - " + datestring;
		return datestring;
	}

	$scope.day1 = loaddates(0); //set to 4 for shifting 5 days forward and -5 to shift 5 days backward
	$scope.day2 = loaddates(1);
	$scope.day3 = loaddates(1);
	$scope.day4 = loaddates(1);
	$scope.day5 = loaddates(1);


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