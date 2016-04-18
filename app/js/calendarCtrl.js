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


		var htmlString1 = "";
		var htmlString2 = "";
		var htmlString3 = "";
		var htmlString4 = "";
		var htmlString5 = "";

		var schedule = value;

		var count = 0;
		console.log(schedule);
		for(event in schedule) {
			if (schedule[count].date === d1) {

				//for each meeting in day
				if(count < schedule.length) {
					htmlString1 += "<div dynamic='daysched" + (count+1) + "' class='calday' id='divID1'> <p align='left'><b>" + schedule[count].start + "</b></p><p align='center'>" + schedule[count].name + "</p><p align='right'><b>" + schedule[count].end + "</b></p></div>";
					$scope.dayschedule1 = $sce.trustAsHtml(htmlString1);
					

				} else {
					htmlString1 += "<div dynamic='daysched" + (count+1) + "' class='calday'  ng-click='xyz()'> <p align='left'><b>" + schedule[count].start + "</b></p><p align='center'>" + schedule[count].name + "</p><p align='right'><b>" + schedule[count].end + "</b></p></div>";
				}
				obj[0] = schedule;
			}

			if (schedule[count].date === d2) {
				//for each meeting in day
				if(count < schedule.length) {
					htmlString2 += "<div dynamic='daysched" + (count+1) + "' class='calday' ng-click='xyz()'> <p align='left'><b>" + schedule[count].start + "</b></p><p align='center'>" + schedule[count].name + "</p><p align='right'><b>" + schedule[count].end + "</b></p></div>";
					$scope.dayschedule2 = $sce.trustAsHtml(htmlString2);
				} else {
					htmlString2 += "<div dynamic='daysched" + (count+1) + "' class='calday'  ng-click='xyz()'> <p align='left'><b>" + schedule[count].start + "</b></p><p align='center'>" + schedule[count].name + "</p><p align='right'><b>" + schedule[count].end + "</b></p></div>";
				}
				obj[1] = schedule;
			}

			if (schedule[count].date === d3) {

				//for each meeting in day
				if(count < schedule.length) {
					htmlString3 += "<div dynamic='daysched" + (count+1) + "' class='calday' ng-click='xyz()'> <p align='left'><b>" + schedule[count].start + "</b></p><p align='center'>" + schedule[count].name + "</p><p align='right'><b>" + schedule[count].end + "</b></p></div>";
					$scope.dayschedule3 = $sce.trustAsHtml(htmlString3);
				} else {
					htmlString3 += "<div dynamic='daysched" + (count+1) + "' class='calday'  ng-click='xyz()'> <p align='left'><b>" + schedule[count].start + "</b></p><p align='center'>" + schedule[count].name + "</p><p align='right'><b>" + schedule[count].end + "</b></p></div>";
				}
				obj[2] = schedule;
			}

			if (schedule[count].date === d4) {

				//for each meeting in day
				if(count < schedule.length) {
					htmlString4 += "<div dynamic='daysched" + (count+1) + "' class='calday' ng-click='xyz()'> <p align='left'><b>" + schedule[count].start + "</b></p><p align='center'>" + schedule[count].name + "</p><p align='right'><b>" + schedule[count].end + "</b></p></div>";
					$scope.dayschedule4 = $sce.trustAsHtml(htmlString4);
				} else {
					htmlString4 += "<div dynamic='daysched" + (count+1) + "' class='calday'  ng-click='xyz()'> <p align='left'><b>" + schedule[count].start + "</b></p><p align='center'>" + schedule[count].name + "</p><p align='right'><b>" + schedule[count].end + "</b></p></div>";
				}
				obj[3] = schedule;
			}

			if (schedule[count].date === d5) {

				//for each meeting in day
				if(count < schedule.length) {
					htmlString5 += "<div dynamic='daysched" + (count+1) + "' class='calday' ng-click='xyz()'> <p align='left'><b>" + schedule[count].start + "</b></p><p align='center'>" + schedule[count].name + "</p><p align='right'><b>" + schedule[count].end + "</b></p></div>";
					$scope.dayschedule5 = $sce.trustAsHtml(htmlString5);
				} else {
					htmlString5 += "<div dynamic='daysched" + (count+1) + "' class='calday'  ng-click='xyz()'> <p align='left'><b>" + schedule[count].start + "</b></p><p align='center'>" + schedule[count].name + "</p><p align='right'><b>" + schedule[count].end + "</b></p></div>";
				}
				obj[4] = schedule;
			}

			count++;
		} 

			console.log(htmlString1);


		//$scope.$apply();
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
		//console.log(datestring);
		console.log("anrop");
		dd = "";
		mm = "";
		yyyy = "";
		Agenda.getDay(today, callback);

		return wd;
	}


	function resetday() {
		$scope.dayschedule1 = $sce.trustAsHtml("");
		$scope.dayschedule2 = $sce.trustAsHtml("");
		$scope.dayschedule3 = $sce.trustAsHtml("");
		$scope.dayschedule4 = $sce.trustAsHtml("");
		$scope.dayschedule5 = $sce.trustAsHtml("");
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