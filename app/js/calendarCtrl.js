agendaApp.controller('CalendarCtrl', function ($scope, $sce, Agenda) {

	var myDataRef = new Firebase('https://dh2642.firebaseIO.com/'),
		eventRef = myDataRef.child("events"),
		agendaArray = [],
		date = new Date(),
		weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		datestring, dd, mm, yyyy;
	date.setFullYear(2016, 4, 30); //inita dagen att vara 1:a juni



	var user = Agenda.getUser();
	if (user === "") {
		console.log("inte inloggad");
		//window.location="/";
		//return;
	};



	var callback = function (ok, msg, value) {
		console.log(value);
		var schedule = value;
	};



	function loaddates(int, wday) {


		var today = date;
		today.setDate(date.getDate() + int);
		Agenda.getDay(date, callback);
		dd = today.getDate();
		mm = today.getMonth(); //January is 0!
		yyyy = today.getFullYear();

		if (dd < 10) {
			dd = '0' + dd;
		}

		if (mm < 10) {
			mm = mm + 1;
			mm = '0' + mm;
		}

		datestring = dd + '/' + mm + '/' + yyyy;
		datestring = weekday[today.getDay()] + " - " + datestring;


		//console.log("day " + Agenda.getExampleData().day + " -> " + dd + " && " + Agenda.getExampleData().month + " -> " + mm + " && " + Agenda.getExampleData().year + " -> " + yyyy);
		if (Agenda.getExampleData().day == dd && Agenda.getExampleData().month == mm && Agenda.getExampleData().year == yyyy) {
			console.log("bingo: " + wday);
			console.log(Agenda.getExampleData());
			switch (wday) {
			case 1:
				$scope.dayschedule1 = $sce.trustAsHtml("<div class='calday' id='daysched1'> <p align='left'><b>" + Agenda.getExampleData().start + "</b></p><p align='center'>" + Agenda.getExampleData().name + "</p><p align='right'><b>" + Agenda.getExampleData().end + "</b></p></div>");
				$scope.dayschedule2 = $scope.dayschedule3 = $scope.dayschedule4 = $scope.dayschedule5 = "";
				break;
			case 2:
				$scope.dayschedule2 = $sce.trustAsHtml("<div class='calday' id='daysched2'> <p align='left'><b>" + Agenda.getExampleData().start + "</b></p><p align='center'>" + Agenda.getExampleData().name + "</p><p align='right'><b>" + Agenda.getExampleData().end + "</b></p></div>");
				$scope.dayschedule1 = $scope.dayschedule3 = $scope.dayschedule4 = $scope.dayschedule5 = "";
				break;
			case 3:
				$scope.dayschedule3 = $sce.trustAsHtml("<div class='calday' id='daysched3'> <p align='left'><b>" + Agenda.getExampleData().start + "</b></p><p align='center'>" + Agenda.getExampleData().name + "</p><p align='right'><b>" + Agenda.getExampleData().end + "</b></p></div>");
				$scope.dayschedule2 = $scope.dayschedule1 = $scope.dayschedule4 = $scope.dayschedule5 = "";
				break;
			case 4:
				$scope.dayschedule4 = $sce.trustAsHtml("<div class='calday' id='daysched4'> <p align='left'><b>" + Agenda.getExampleData().start + "</b></p><p align='center'>" + Agenda.getExampleData().name + "</p><p align='right'><b>" + Agenda.getExampleData().end + "</b></p></div>");
				$scope.dayschedule2 = $scope.dayschedule3 = $scope.dayschedule1 = $scope.dayschedule5 = "";
				break;
			case 5:
				$scope.dayschedule5 = $sce.trustAsHtml("<div class='calday' id='daysched5'> <p align='left'><b>" + Agenda.getExampleData().start + "</b></p><p align='center'>" + Agenda.getExampleData().name + "</p><p align='right'><b>" + Agenda.getExampleData().end + "</b></p></div>");
				$scope.dayschedule2 = $scope.dayschedule3 = $scope.dayschedule4 = $scope.dayschedule1 = "";
				break;
			}

		}
		dd = "";
		mm = "";
		yyyy = "";
		return datestring;
	}

	function resetday() {
		$scope.dayschedule1 = "";
		$scope.dayschedule2 = "";
		$scope.dayschedule3 = "";
		$scope.dayschedule4 = "";
		$scope.dayschedule5 = "";
	}

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