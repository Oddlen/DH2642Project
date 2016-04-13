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
	//date.setTime(date.getTime() - (24 * 60 * 60 * 1000));

	var obj =[];
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
		//console.log("msg: " + msg);
		//console.log(value);
		var schedule = value;

		//schedule.sort(compare);
		if (schedule[0].date === d1) {

			//for each meeting in day

			$scope.dayschedule1 = $sce.trustAsHtml("<div dynamic='daysched1' class='calday' id='daysched1' ng-click='xyz()'> <p align='left'><b>" + schedule[0].start + "</b></p><p align='center'>" + schedule[0].name + "</p><p align='right'><b>" + schedule[0].end + "</b></p></div>");
			obj[0] = schedule;
		} else {
			if(schedule[0].date === d2) {
				$scope.dayschedule2 = $sce.trustAsHtml("<div dynamic='daysched2' class='calday' id='daysched2' ng-click='toAgenda(true, 1, 0)'> <p align='left'><b>" + schedule[0].start + "</b></p><p align='center'>" + schedule[0].name + "</p><p align='right'><b>" + schedule[0].end + "</b></p></div>");
				obj[1] = schedule;
			} else {
				if(schedule[0].date === d3) {
					$scope.dayschedule3 = $sce.trustAsHtml("<div dynamic='daysched3' class='calday' id='daysched3' ng-click='toAgenda(true, 2, 0)'> <p align='left'><b>" + schedule[0].start + "</b></p><p align='center'>" + schedule[0].name + "</p><p align='right'><b>" + schedule[0].end + "</b></p></div>");
					obj[2] = schedule;
				} else {
					if(schedule[0].date === d4) {
						$scope.dayschedule4 = $sce.trustAsHtml("<div dynamic='daysched4' class='calday' id='daysched4' ng-click='toAgenda(true, 3, 0)'> <p align='left'><b>" + schedule[0].start + "</b></p><p align='center'>" + schedule[0].name + "</p><p align='right'><b>" + schedule[0].end + "</b></p></div>");
						obj[3] = schedule;
					} else {
						if(schedule[0].date === d5) {
							$scope.dayschedule5 = $sce.trustAsHtml("<div dynamic='daysched5' class='calday' id='daysched5' ng-click='toAgenda(true, 4, 0)'> <p align='left'><b>" + schedule[0].start + "</b></p><p align='center'>" + schedule[0].name + "</p><p align='right'><b>" + schedule[0].end + "</b></p></div>");
							obj[4] = schedule;
						} 
					}
				}
			}
		}
		$scope.$apply();
	};

	function xyz () {
		console.log("xyz");
	}


	function setDatestring(today, wday, datestring) {
		var wd = weekday[today.getDay()] + " - " + datestring;

		switch (wday) {
		case 1:
			d1 = datestring;
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

		return wd;

	}

	/*
	 * @param int 1 for shifting 5 days forward and -5 to shift 1 days backward
	 * @param wday which day of the visible calendar that the function handles
	 */
	function loaddates(int, wday) {


		var today = date;
		today.setDate(date.getDate() + int);
		//console.log(today);
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
		
		var wd = setDatestring(today, wday, datestring);
		console.log(datestring);

		dd = "";
		mm = "";
		yyyy = "";
		Agenda.getDay(today, callback);

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