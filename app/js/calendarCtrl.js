agendaApp.controller('CalendarCtrl', function ($scope, Agenda) {

	var myDataRef = new Firebase('https://dh2642.firebaseIO.com/');
	var eventRef = myDataRef.child("events");
	var agendaArray = [];
	var date = new Date();
	date.setFullYear(2016, 3, 1); //inita dagen att vara 1:a april
	var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var datestring;


	var user = Agenda.getUser();
	if (user === "") {
		console.log("inte inloggad");
		//window.location="/";
		//return;
	};



	var callback = function (ok, msg, value) {
		console.log("wut: " + value);
	};
	Agenda.getDay(date, callback);


	function loaddates(int, wday) {


		var today = date;
		today.setDate(date.getDate() + int);
		var dd = today.getDate();
		var mm = today.getMonth() + 1; //January is 0!
		var yyyy = today.getFullYear();

		if (dd < 10) {
			dd = '0' + dd;
		}

		if (mm < 10) {
			mm = '0' + mm;
		}

		datestring = dd + '/' + mm + '/' + yyyy;
		datestring = weekday[today.getDay()] + " - " + datestring;

		//console.log("day " + Agenda.getExampleData().day + " -> " + dd + " && " + Agenda.getExampleData().month + " -> " + mm + " && " + Agenda.getExampleData().year + " -> " + yyyy);
		if (Agenda.getExampleData().day == dd && Agenda.getExampleData().month == mm && Agenda.getExampleData().year == yyyy) {
			console.log("bingo: " + wday);
			switch (wday) {
			case 1:
				$scope.dayschedule1 = "dag 1";
				myFunction();
				break;
			case 2:
				$scope.dayschedule2 = "dag 2";
				break;
			case 3:
				$scope.dayschedule3 = "dag 3";
				break;
			case 4:
				$scope.dayschedule4 = "dag 4";
				break;
			case 5:
				$scope.dayschedule5 = "dag 5";
				break;
			}

		}
		return datestring;
	};

	function resetday() {
		$scope.dayschedule1 = "";
		$scope.dayschedule2 = "";
		$scope.dayschedule3 = "";
		$scope.dayschedule4 = "";
		$scope.dayschedule5 = "";
	};

	$scope.day1 = loaddates(0, 1); //set to 1 for shifting 5 days forward and -5 to shift 1 days backward
	$scope.day2 = loaddates(1, 2);
	$scope.day3 = loaddates(1, 3);
	$scope.day4 = loaddates(1, 4);
	$scope.day5 = loaddates(1, 5);

	$scope.prevday = function () {
		resetday();
		$scope.day1 = loaddates(-5, 1);
		$scope.day2 = loaddates(1, 2);
		$scope.day3 = loaddates(1, 3);
		$scope.day4 = loaddates(1, 4);
		$scope.day5 = loaddates(1, 5);
	};

	$scope.prevweek = function () {
		resetday();
		$scope.day1 = loaddates(-9, 1);
		$scope.day2 = loaddates(1, 2);
		$scope.day3 = loaddates(1, 3);
		$scope.day4 = loaddates(1, 4);
		$scope.day5 = loaddates(1, 5);
	};

	$scope.nextday = function () {
		resetday();
		$scope.day1 = loaddates(-3, 1);
		$scope.day2 = loaddates(1, 2);
		$scope.day3 = loaddates(1, 3);
		$scope.day4 = loaddates(1, 4);
		$scope.day5 = loaddates(1, 5);
	};

	$scope.nextweek = function () {
		resetday();
		$scope.day1 = loaddates(1, 1);
		$scope.day2 = loaddates(1, 2);
		$scope.day3 = loaddates(1, 3);
		$scope.day4 = loaddates(1, 4);
		$scope.day5 = loaddates(1, 5);
	};

});