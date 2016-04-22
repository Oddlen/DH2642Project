agendaApp.controller('CalendarCtrl', function ($scope, $sce, $location, $compile, $filter, Agenda, MeetingAgenda) {

	var myDataRef = new Firebase('https://dh2642.firebaseIO.com/'),
		eventRef = myDataRef.child("events"),
		agendaArray = [],
		date = Agenda.getWorkingDate(),
		weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		datestring,
		dd, mm, yyyy,
		d1, d2, d3, d4, d5,
        schedule,
        w1, w2;

	$scope.testAlert = function () {
		alert('testing');
	};

	var user = Agenda.getUser();
	if (user === "") {
		$location.url('/home');
		return;
	}

    /*
     * Sends user to agenda view after telling agenda that a new meeting should be created
     */
	$scope.toAgenda = function (bool, day, number) {
		if (!bool) {
            MeetingAgenda.setExistingMeeting(false);
			$location.url('/agenda');
			return;
		} else {
			//console.log("Something went wrong when trying to go to the agenda");
            return;
		}

	};

    /*
     * Function that sends a meeting to the agenda view
     * @param day what day the meeting belongs to
     * @param number the meeting that was clicked, 0 for the first meeting
     */
	function toAgenda2(bool, day, number) {
        Agenda.setWorkingDate(date);
		MeetingAgenda.setExistingMeeting(true);
		MeetingAgenda.setMeeting(schedule[day][number]);
		$location.url('/agenda');
		return;


	}

    /*
     * Simple sort function
     */
	function compare(a, b) {
		if (a.start < b.start) {
			return -1;
        } else if (a.start > b.start) {
			return 1;
        } else {
			return 0;
        }
	}

    /*
     * @param ok if the call was successful
     * @param msg message about the returned value
     * @param value the returned value of the call
     */
	var callback = function (ok, msg, value) {
        
        //copy the returned value to save it for later use
		schedule = value;

		var count = 0;
        
        if (ok) {
		  writeToSchedule(value);
        } else {
            $scope.dayschedule1 = "";
            $scope.dayschedule2 = "";
            $scope.dayschedule3 = "";
            $scope.dayschedule4 = "";
            $scope.dayschedule5 = "";
            //console.log("Apply2");
            $scope.$apply();
        }

	};

    /*
     * Takes the returned value of the call and 
     * writes the meetings to the respective day-panel in the calendar view
     * @param value 5 days and meetings in them
     */
	function writeToSchedule(value) {

		var htmlString1 = "";
		var htmlString2 = "";
		var htmlString3 = "";
		var htmlString4 = "";
		var htmlString5 = "";

		//console.log(value);

		var daynr = 0;
		for (day in value) {
			var meetingnr = 0;
			if (typeof value[daynr] !== 'undefined') {
				for (event in value[daynr]) {
					switch (daynr) {

                        case 0:
                            htmlString1 += "<div dynamic='daysched" + (daynr + 1) + "' id='" + daynr + "-" + meetingnr  + "' class='calday' ng-click='xyz(" + daynr + "," + meetingnr + ")'> <p align='left'><b>" + value[daynr][meetingnr].start + "</b></p><p align='center'>" + value[daynr][meetingnr].name + "</p><p align='right'><b>" + value[daynr][meetingnr].end + "</b></p></div>";
                            $scope.dayschedule1 = htmlString1;
                            break;
						case 1:
							htmlString2 += "<div dynamic='daysched" + (daynr + 1) + "' id='" + daynr + "-" + meetingnr  + "' class='calday' ng-click='xyz(" + daynr + "," + meetingnr + ")'> <p align='left'><b>" + value[daynr][meetingnr].start + "</b></p><p align='center'>" + value[daynr][meetingnr].name + "</p><p align='right'><b>" + value[daynr][meetingnr].end + "</b></p></div>";
 							$scope.dayschedule2 = htmlString2;
							break;
						case 2:
                            htmlString3 += "<div dynamic='daysched" + (daynr + 1) + "' id='" + daynr + "-" + meetingnr  + "' class='calday' ng-click='xyz(" + daynr + "," + meetingnr + ")'> <p align='left'><b>" + value[daynr][meetingnr].start + "</b></p><p align='center'>" + value[daynr][meetingnr].name + "</p><p align='right'><b>" + value[daynr][meetingnr].end + "</b></p></div>";
                            $scope.dayschedule3 = htmlString3;
                            break;
						case 3:
                            htmlString4 += "<div dynamic='daysched" + (daynr + 1) + "' id='" + daynr + "-" + meetingnr  + "' class='calday' ng-click='xyz(" + daynr + "," + meetingnr + ")'> <p align='left'><b>" + value[daynr][meetingnr].start + "</b></p><p align='center'>" + value[daynr][meetingnr].name + "</p><p align='right'><b>" + value[daynr][meetingnr].end + "</b></p></div>";
                            $scope.dayschedule4 = htmlString4;
                            break;
						case 4:
                            htmlString5 += "<div dynamic='daysched" + (daynr + 1) + "' id='" + daynr + "-" + meetingnr  + "' class='calday' ng-click='xyz(" + daynr + "," + meetingnr + ")'> <p align='left'><b>" + value[daynr][meetingnr].start + "</b></p><p align='center'>" + value[daynr][meetingnr].name + "</p><p align='right'><b>" + value[daynr][meetingnr].end + "</b></p></div>";
                            $scope.dayschedule5 = htmlString5;
                            break;
					}
					meetingnr++;
				}
				meetingnr = 0;
			}
			daynr++;

		}
		value = [];
		      setTimeout(function () {
                  $scope.$apply();
              }, 200);
	}
    
    /*
     * Callback function that handles the returned values
     * @param ok if the call was successful
     * @param msg message about the returned value
     * @param value the returned value of the call
     */
	var callback = function (ok, msg, value) {
        
        //copy the returned value to save it for later use
		schedule = value;

		var count = 0;
        
        if (ok) {
		  writeToSchedule(value);
        } else {
            $scope.dayschedule1 = "";
            $scope.dayschedule2 = "";
            $scope.dayschedule3 = "";
            $scope.dayschedule4 = "";
            $scope.dayschedule5 = "";
            $scope.$apply();
        }

	};

    /*
     * Function that is called when a meeting is clicked in a day-panel
     * @param daynumber what day-panel that is clicked
     * @param meetingnumber the meeting that was clicked, 0 for the first in the day-panel
     */
    

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
        
        mm = mm + 1;
		if (mm < 10) {
			mm = '0' + mm;
		}

		datestring = dd + '/' + mm + '/' + yyyy;
		dd = "";
		mm = "";
		yyyy = "";
		var wd = weekday[today.getDay()] + " - " + datestring;
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
			w2 = $filter('date')(today, 'ww');
			if(w1 !== w2) {
				$scope.week = w1 + "-" + w2;
			} else {
				$scope.week = w1;
			}

			break;
		case 0:
			d1 = datestring;
			$scope.day1 = wd;
			w1 = $filter('date')(today, 'ww');
			break;
		}



	}

	/*
     * 
	 * @param intx how many days to shift rom current selected date
	 * @param wday which day-panel of the visible calendar that the function handles
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
		Agenda.get5Days(today, callback);
	}

    /*
     * Resets all the day-panels in the calendar view 
     */
	function resetday() {
		$scope.dayschedule1 = "";
		$scope.dayschedule2 = "";
		$scope.dayschedule3 = "";
		$scope.dayschedule4 = "";
		$scope.dayschedule5 = "";
	}
    
     /*
     * Shifts day-panels to show one day previous
    */
	$scope.prevday = function () {
		resetday();
		loaddates(-1);
	};

    /*
     * Shifts day-panels to show five days previous
     */
	$scope.prevweek = function () {
		resetday();
		loaddates(-5);
	};

    /*
     * Shifts day-panels to show the next day
     */
	$scope.nextday = function () {
		resetday();
		loaddates(1);
	};

    /*
     * Shifts day-panels to show the next 5 days
     */
	$scope.nextweek = function () {
		resetday();
		loaddates(5);
	};

	//Init calendar week
	loaddates(0);

});