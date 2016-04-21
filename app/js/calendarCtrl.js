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

	function toAgenda2 (bool, day, number) {

		MeetingAgenda.setExistingMeeting(true);
		MeetingAgenda.setMeeting(schedule[day][number]);
		$location.url('/agenda');
		console.log("to agenda w/ meeting info");
		return;


	}


	function compare(a, b) {
		if (a.start < b.start)
			return -1;
		else if (a.start > b.start)
			return 1;
		else
			return 0;
	}

	var schedule;

	var callback = function (ok, msg, value) {


		schedule = value;
		console.log(value);

		var count = 0;
		value[0].sort(compare);
		value[1].sort(compare);
		value[2].sort(compare);
		value[3].sort(compare);
		value[4].sort(compare);

		writeToSchedule(value);
		
	};


	function writeToSchedule (value) {

		var htmlString1 = "";
		var htmlString2 = "";
		var htmlString3 = "";
		var htmlString4 = "";
		var htmlString5 = "";

		var daynr = 0;
		for(day in value) {
			var meetingnr = 0;
			if(typeof value[daynr] !== 'undefined' ) {
				for(event in value[daynr]) {
					console.log(value[daynr][meetingnr]);
					switch (daynr) {

						case 0:
							htmlString1 += "<div dynamic='daysched" + (daynr+1) + "' id='" + daynr + "-" + meetingnr  + "' class='calday' ng-click='xyz(" + daynr + "," + meetingnr + ")'> <p align='left'><b>" + value[daynr][meetingnr].start + "</b></p><p align='center'>" + value[daynr][meetingnr].name + "</p><p align='right'><b>" + value[daynr][meetingnr].end + "</b></p></div>";
 							console.log(htmlString1);
 							$scope.dayschedule1 = htmlString1;
 							break;
						case 1:
							htmlString2 += "<div dynamic='daysched" + (daynr+1) + "' id='" + daynr + "-" + meetingnr  + "' class='calday' ng-click='xyz(" + daynr + "," + meetingnr + ")'> <p align='left'><b>" + value[daynr][meetingnr].start + "</b></p><p align='center'>" + value[daynr][meetingnr].name + "</p><p align='right'><b>" + value[daynr][meetingnr].end + "</b></p></div>";
 							console.log(htmlString2);
 							$scope.dayschedule2 = htmlString2;
							break;
						case 2:
							htmlString3 += "<div dynamic='daysched" + (daynr+1) + "' id='" + daynr + "-" + meetingnr  + "' class='calday' ng-click='xyz(" + daynr + "," + meetingnr + ")'> <p align='left'><b>" + value[daynr][meetingnr].start + "</b></p><p align='center'>" + value[daynr][meetingnr].name + "</p><p align='right'><b>" + value[daynr][meetingnr].end + "</b></p></div>";
 							console.log(htmlString3);
 							$scope.dayschedule3 = htmlString3;
							break;
						case 3:
							htmlString4 += "<div dynamic='daysched" + (daynr+1) + "' id='" + daynr + "-" + meetingnr  + "' class='calday' ng-click='xyz(" + daynr + "," + meetingnr + ")'> <p align='left'><b>" + value[daynr][meetingnr].start + "</b></p><p align='center'>" + value[daynr][meetingnr].name + "</p><p align='right'><b>" + value[daynr][meetingnr].end + "</b></p></div>";
 							console.log(htmlString4);
 							$scope.dayschedule4 = htmlString4;
							break;
						case 4:
							htmlString5 += "<div dynamic='daysched" + (daynr+1) + "' id='" + daynr + "-" + meetingnr  + "' class='calday' ng-click='xyz(" + daynr + "," + meetingnr + ")'> <p align='left'><b>" + value[daynr][meetingnr].start + "</b></p><p align='center'>" + value[daynr][meetingnr].name + "</p><p align='right'><b>" + value[daynr][meetingnr].end + "</b></p></div>";
 							console.log(htmlString5);
 							$scope.dayschedule5 = htmlString5;
							break;
					}
					meetingnr++;
				}
				meetingnr = 0;
			}
			daynr++;

		}
		$scope.$apply();
	}


	$scope.xyz = function (daynumber, meetingnumber) {
		toAgenda2(true, daynumber, meetingnumber);
	};


	function setDatestring(tday, wday) {

		var dat = tday;

		var today = new Date(dat.valueOf());

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
		//console.log(datestring);
		dd = "";
		mm = "";
		yyyy = "";
		var wd = weekday[today.getDay()] + " - " + datestring;
		//console.log("weekday: " + today.getDate());
		//console.log(datestring);
		switch (wday) {


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
		case 0:
			d1 = datestring;
			console.log(wd);
			$scope.day1 = wd;
			break;
		}
		//today = "";

	}

	/*
	 * @param int 1 for shifting 5 days forward and -5 to shift 1 days backward
	 * @param wday which day of the visible calendar that the function handles
	 */
	function loaddates(intx) {
		date.setDate(date.getDate() + intx);
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
		console.log(today);
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
		loaddates(-1);
		/*$scope.day2 = loaddates(1, 2);
		$scope.day3 = loaddates(1, 3);
		$scope.day4 = loaddates(1, 4);
		$scope.day5 = loaddates(1, 5);*/

	};

	$scope.prevweek = function () {
		resetday();
		loaddates(-5);
		/*$scope.day2 = loaddates(1, 2);
		$scope.day3 = loaddates(1, 3);
		$scope.day4 = loaddates(1, 4);
		$scope.day5 = loaddates(1, 5);*/
	};

	$scope.nextday = function () {
		resetday();
		loaddates(1);
		/*$scope.day2 = loaddates(1, 2);
		$scope.day3 = loaddates(1, 3);
		$scope.day4 = loaddates(1, 4);
		$scope.day5 = loaddates(1, 5);*/
	};

	$scope.nextweek = function () {
		resetday();
		loaddates(5);
		/*$scope.day2 = loaddates(1, 2);
		$scope.day3 = loaddates(1, 3);
		$scope.day4 = loaddates(1, 4);
		$scope.day5 = loaddates(1, 5);*/
	};

	//init calendar week
	loaddates(0);
	/*$scope.day2 = loaddates(1, 2);
	$scope.day3 = loaddates(1, 3);
	$scope.day4 = loaddates(1, 4);
	$scope.day5 = loaddates(1, 5);*/

});