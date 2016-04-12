agendaApp.controller('CalendarCtrl', function ($scope, $sce, $location, Agenda, MeetingAgenda) {

	var myDataRef = new Firebase('https://dh2642.firebaseIO.com/'),
		eventRef = myDataRef.child("events"),
		agendaArray = [],
		date = new Date(),
		weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		datestring,
		dd, mm, yyyy,
		d1, d2, d3, d4, d5;
	date.setFullYear(2016, 3, 1); //inita dagen att vara 1:a april
	//date.setTime(date.getTime() - (24 * 60 * 60 * 1000));



	var user = Agenda.getUser();
	if (user === "") {
		$location.url('/home');
		return;
	}


	$scope.toAgenda = function (bool, obj) {
		console.log("ng-clicked!");
		if (bool) {
			MeetingAgenda.setExistingMeeting(true);
			MeetingAgenda.setMeeting(obj);
			$location.url('/agenda');
			console.log("to agenda w/ meeting info");
			return;

		} else {
			MeetingAgenda.setExistingMeeting(false);
			$location.url('/agenda');
			console.log("to agenda w/o meeting info");
			return;
		}

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
		//console.log("msg: " + msg);
		//console.log(value);
		var schedule = value;
		/*console.log("sdate: " + schedule[0].date);
		console.log("dates the same= " + (d1 == schedule[0].date));
		console.log("d1: " + d1);*/

		//schedule.sort(compare);
		if (schedule[0].date == d1) {
			console.log(schedule[0]);
			//for each meeting in day
			var meeting = 1;

			//$scope.dayschedule1 = "<div class='calday' id='daysched1'> <p align='left'><b>" + schedule[0].start + "</b></p><p align='center'>" + schedule[0].name + "</p><p align='right'><b>" + schedule[0].end + "</b></p></div>";
		} else {
			$scope.dayschedule1 = "hej";
		}
	};

	/*
	 * @param int 1 for shifting 5 days forward and -5 to shift 1 days backward
	 * @param wday which day of the visible calendar that the function handles
	 */
	function loaddates(int, wday) {


		var today = date;
		today.setDate(date.getDate() + int);
		//console.log(today);
		Agenda.getDay(today, callback);
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
		var wd = weekday[today.getDay()] + " - " + datestring;


		//console.log("day " + Agenda.getExampleData().day + " -> " + dd + " && " + Agenda.getExampleData().month + " -> " + mm + " && " + Agenda.getExampleData().year + " -> " + yyyy);
		/*if (Agenda.getExampleData().day == dd && Agenda.getExampleData().month == mm && Agenda.getExampleData().year == yyyy) {
			console.log("bingo: " + wday);
			//console.log(Agenda.getExampleData());*/
		switch (wday) {
		case 1:
			d1 = datestring;
			$scope.dayschedule1 = $sce.trustAsHtml("<div class='calday' id='daysched1'> <p align='left'><b>" + Agenda.getExampleData().start + "</b></p><p align='center'>" + Agenda.getExampleData().name + "</p><p align='right'><b>" + Agenda.getExampleData().end + "</b></p></div>");
			break;
		case 2:
			d2 = datestring;

			break;
		case 3:
			d3 = datestring;

			break;
		case 4:
			d4 = datestring;
			break;
		case 5:
			d5 = datestring;
			break;
		}

		//}
		dd = "";
		mm = "";
		yyyy = "";
		return wd;
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