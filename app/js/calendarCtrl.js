agendaApp.controller('CalendarCtrl', function ($scope, $sce, Agenda) {

	var myDataRef = new Firebase('https://dh2642.firebaseIO.com/'),
		eventRef = myDataRef.child("events"),
		agendaArray = [],
		date = new Date(),
		weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		datestring,
		dd,
		mm,
		yyyy;
	date.setFullYear(2016, 4, 30); //inita dagen att vara 1:a juni
	myfunc();


	var user = Agenda.getUser();
	if (user === "") {
		console.log("inte inloggad");
		//window.location="/";
		//return;
	}

	function compare(a, b) {
		if (a.start < b.start)
			return -1;
		else if (a.start > b.start)
			return 1;
		else
			return 0;
	}

	var callback = function (ok, msg, value) {
		console.log(value);
		var schedule = value;
		/*
		schedule.sort(compare);
		if schedule.date == $scope.day1
		for each meeting in day
			$scope.dayschedule1 += $sce.trustAsHtml("<div class='calday' id='daysched_NÅGOTSMARTID'> <p align='left'><b>" + schedule[0].start + "</b></p><p align='center'>" + schedule[0].name + "</p><p align='right'><b>" + schedule[0].end + "</b></p></div>");
		*/
	};

	function myfunc() {
		abc = Agenda.getExampleData();
		console.log(abc.agenda[0].start);
		console.log(abc.agenda[1].start);
		abc.agenda.sort(compare);
		abc.agenda.reverse();
		console.log(abc.agenda[0].start);
		console.log(abc.agenda[1].start);

	}


	/*
	 * @param int 1 for shifting 5 days forward and -5 to shift 1 days backward
	 * @param wday which day of the visible calendar that the function handles
	 */
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

	//init calendar week
	$scope.day1 = loaddates(0, 1);
	$scope.day2 = loaddates(1, 2);
	$scope.day3 = loaddates(1, 3);
	$scope.day4 = loaddates(1, 4);
	$scope.day5 = loaddates(1, 5);

});