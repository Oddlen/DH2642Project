agendaApp.controller('CalendarCtrl', function ($scope, $sce, $location, $compile, Agenda, MeetingAgenda) {

	var myDataRef = new Firebase('https://dh2642.firebaseIO.com/'),
		eventRef = myDataRef.child("events"),
		agendaArray = [],
		date = new Date(),
		weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		datestring,
		dd, mm, yyyy,
		d1, d2, d3, d4, d5;
	date.setFullYear(2016, 3, 1); //inita dagen att vara 1:a april

	var obj = [];
	$scope.trustedHtml = $sce.trustAsHtml('<button ng-click="testAlert()">Submit</button>');

	$scope.testAlert = function () {
		alert('testing');
	};

	var user = Agenda.getUser();
	if (user === "") {
		$location.url('/home');
		return;
	}


	$scope.toAgenda = function (bool, day, number) {
		console.log("ng-clicked!");
		if (bool) {
			MeetingAgenda.setExistingMeeting(true);
			MeetingAgenda.setMeeting(obj[day]);
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

		var htmlString1 = "";
		var htmlString2 = "";
		var htmlString3 = "";
		var htmlString4 = "";
		var htmlString5 = "";

		var schedule = value;

		var count = 0;
		schedule[0].sort(compare);
		schedule[1].sort(compare);
		schedule[2].sort(compare);
		schedule[3].sort(compare);
		schedule[4].sort(compare);
		//console.log(schedule);
	};


	$scope.xyz = function () {
		console.log("xyz");
	};


	function setDatestring(today, wday) {
		today.setDate(date.getDate() + wday);

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
		console.log(datestring);
		dd = "";
		mm = "";
		yyyy = "";
		var wd = weekday[today.getDay()] + " - " + datestring;
		//console.log("weekday: " + today.getDate());
		//console.log(datestring);
		switch (wday) {

		case 0:
			d1 = datestring;
			$scope.day1 = wd;
			break;
		case 1:
			d2 = datestring;
			$scope.day2 = wd;
			break;
		case 2:
			d3 = datestring;
			$scope.day3 = wd;
			break;
		case 3:
			d4 = datestring;
			$scope.day4 = wd;
			break;
		case 4:
			d5 = datestring;
			$scope.day5 = wd;
			break;
		}
		today = "";

	}

	/*
	 * @param int 1 for shifting 5 days forward and -5 to shift 1 days backward
	 * @param wday which day of the visible calendar that the function handles
	 */
	function loaddates(int) {
		date.setDate(date.getDate() + int);
		var dat = date;

		var today = new Date(dat.valueOf());
		var wday = 0;
		today.setDate(today.getDate());

		while (wday < 5) {
			setDatestring(today, wday);
			wday = wday + 1;
		}
		//console.log(wd);


		//Agenda.getDay(today, callback);
		Agenda.get5Days(today, callback);
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
		$scope.day1 = loaddates(-1, 1);
		/*$scope.day2 = loaddates(1, 2);
		$scope.day3 = loaddates(1, 3);
		$scope.day4 = loaddates(1, 4);
		$scope.day5 = loaddates(1, 5);*/

	};

	$scope.prevweek = function () {
		resetday();
		$scope.day1 = loaddates(-5, 1);
		/*$scope.day2 = loaddates(1, 2);
		$scope.day3 = loaddates(1, 3);
		$scope.day4 = loaddates(1, 4);
		$scope.day5 = loaddates(1, 5);*/
	};

	$scope.nextday = function () {
		resetday();
		$scope.day1 = loaddates(1, 1);
		console.log(d1);
		console.log(d5);
		/*$scope.day2 = loaddates(1, 2);
		$scope.day3 = loaddates(1, 3);
		$scope.day4 = loaddates(1, 4);
		$scope.day5 = loaddates(1, 5);*/
	};

	$scope.nextweek = function () {
		resetday();
		$scope.day1 = loaddates(5, 1);
		/*$scope.day2 = loaddates(1, 2);
		$scope.day3 = loaddates(1, 3);
		$scope.day4 = loaddates(1, 4);
		$scope.day5 = loaddates(1, 5);*/
	};

	//init calendar week
	$scope.day1 = loaddates(0, 1);
	/*$scope.day2 = loaddates(1, 2);
	$scope.day3 = loaddates(1, 3);
	$scope.day4 = loaddates(1, 4);
	$scope.day5 = loaddates(1, 5);*/

});