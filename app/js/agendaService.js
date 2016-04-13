agendaApp.factory('Agenda', function ($resource, $cookieStore) {
	// Example of function arguments.

	// Should use date objects (converted to an int in ms) instead of start, end and dates (day,month,year).
	// Ex. One can run new Date().getTime() to get the current time in ms from 1970, storing that int is much easier
	// Than having ex. day,month,year.

	var exampleAgendaObject1 = {
		name: "Testar med en lång sträng",
		start: "08:25",
		end: "09:00",
		length: "0h35m",
		category: "Introduction",
		description: "This is the introduction" // Observe this field is required
	};

	var exampleAgendaObject2 = {
		name: "Kort sträng",
		start: "09:00",
		end: "10:36",
		length: "1h36m",
		category: "Other",
		description: "This is the other" // Observe this field is required
	};

	var exampleEventObject = {
		day: "01",
		month: "06",
		year: "2016",
		name: "OnlyLettersAndNumbers",
		date: "01/06/2016",
		owner: "Kalle", // Observe this is needed in the db
		start: "08:25",
		end: "10:36",
		length: "2h11m",
		invited: ['Kalle', 'username2', 'username3'],
		agenda: [exampleAgendaObject1, exampleAgendaObject2]
	};
	// Until Joakim gets data and pass it to agenda
	this.getExampleData = function () {
		return exampleEventObject;
	};

	apiKey = 'c10ef2a43abbd9987c78ae942ecc0843';
	this.Weather = $resource('http://api.openweathermap.org/data/2.5/weather',{APPID:apiKey});
	//'api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&APPID='+apikey;
	console.log(this.Weather);


		// callback function api.
	function exampleCallbackFunction(booleanFalseIfError, stringMessage, JSONData) {
		// body...
	}

	// Cookies should be added to store certains things (like categories, usernameRef etc.) on reload
	dataRef = new Firebase('https://dh2642.firebaseIO.com/');
	useRef = dataRef.child("users");
	eveRef = dataRef.child("events");
	catRef = dataRef.child("categories");
	vm = this;
	waiting = 0;
	dataArray = [];
	vm.usernameRef = $cookieStore.get("LoggedInUsername");
	
	if (vm.usernameRef === null || vm.usernameRef === undefined)
	{
		vm.usernameRef = "";
	}
	vm.auth = dataRef.getAuth();
	vm.categoryList = $cookieStore.get("categoriesCache");
	if (vm.categoryList === null || vm.categoryList === undefined || vm.categoryList == "")
	{
		vm.categoryList = [];
		catRef.on("value", function (snapshot) {
			var categories = snapshot.val();
			for (var key in categories) {
				console.log(categories[key]);
				vm.categoryList.push(categories[key]);
			}
				console.log("All categories fetched");
			},
			function (errorObject) {
				console.log("The read of categories failed: " + errorObject.code);
			}
		);
		$cookieStore.put("categoriesCache", vm.categoryList);
	}

	

	vm.getUser = function () {
		return vm.usernameRef;
	}

	vm.logout = function () {
		dataRef.unauth();
		vm.usernameRef = "";
		$cookieStore.put("LoggedInUsername", "");
		vm.auth = null;
	}

	vm.login = function (username, password, callbackFunction) {
		console.log("Login");
		vm.logout();
		dataRef.authWithPassword({
			email: username + "@mail.com",
			password: password
		}, function (error, authData) {
			if (error) {
				console.log("Login Failed!", error);
				callbackFunction(false, "Login Failed.", null);
			} else {
				console.log("Authenticated successfully.", null);
				vm.usernameRef = username;
				$cookieStore.put("LoggedInUsername", username);
				vm.auth = dataRef.getAuth();
				callbackFunction(true, "Authenticated successfully.", null);
			}
		});
	}

	vm.createUser = function (username, password, callbackFunction) {
		dataRef.createUser({
				email: username + "@mail.com",
				password: password
			},
			function (error, userData) {
				if (error) {
					console.log("Error creating user:", error);
					callbackFunction(false, "Could not create the new user.", null);
				} else {
					console.log("Successfully created user account.");
					createUserStep2(username, password, callbackFunction);

				}
			}
		);
	}

	function createUserStep2(username, password, callbackFunction) {
		var calbck = function (ok, message, data) {
			if (ok) {
				useRef.update({
  					[username]: {
						id: vm.auth.uid,
						days: {
							working: true
						}
					}
				}, function (error) {
					if (error) {
						console.log('Synchronization failed', error);
						callbackFunction(false, "Error when creating user.", null);
					} else {
						callbackFunction(true, "User has been created.", null);
					}
				});
			} else {
				callbackFunction(false, "Error when creating user.", null);
			}
		}
		vm.login(username, password, calbck);
	}

	vm.getUID = function (username, callbackFunction) {
		useRef.child(username).child("id").on("value",
			function (snapshot) {
				console.log(snapshot.val());
				callbackFunction(true, "The UID of " + username, snapshot.val())
			},
			function (errorObject) {
				console.log("The read failed: " + errorObject.code);
				callbackFunction(false, "Could not get the UID of " + username + " " + errorObject.code, null)
			}
		);
	}

	function getDayStep3(ok, data, callbackFunction) {
		if (ok) {
			dataArray.push(data);
		}
		if (waiting == 0) {
			var tempArray = dataArray;
			dataArray = [];
			callbackFunction(true, "ok", tempArray);
		}
	}

	function getDayStep2(day, data, callbackFunction) {
		for (var key in data) {
			waiting++;
			eveRef.child(day).child(key).on("value",
				function (snapshot) {
					waiting--;
					getDayStep3(true, snapshot.val(), callbackFunction);
				},
				function (errorObject) {
					waiting--;
					console.log("The read failed: " + errorObject.code);
					getDayStep3(false, errorObject.code, callbackFunction);
				}
			);
		}
	}



	vm.getDay = function (day, callbackFunction) {
		var dayCode = getDayCode(day);
		//console.log(dayCode);
		useRef.child(vm.usernameRef).child("days").child(dayCode).on("value",
			function (snapshot) {
				getDayStep2(dayCode, snapshot.val(), callbackFunction);
			},
			function (errorObject) {
				console.log("The read failed: " + errorObject.code);
				callbackFunction(false, "No data found for this day", null);
			}
		);
	}

	vm.getEvent = function (day, eventName, ownerName, callbackFunction) {
		console.log("getEvent");
		var dayCode = getDayCode(day);
		eveRef.child(dayCode).child(eventName + "_" + ownerName).on("value",
			function (snapshot) {
				callbackFunction(true, day, snapshot.val());
			},
			function (errorObject) {
				console.log("read for " + dayCode + "->" + eventName + "_" + ownerName + "failed", errorObject.code);
				callbackFunction(false, "data for " + dayCode + "->" + eventName + "_" + ownerName + "could not be accesed", null);
			}
		);
	}

	vm.setEvent = function (eventObject, callbackFunction) {
		console.log("setEvent");

		dayCode = "d" + eventObject.day + "m" + eventObject.month + "y" + eventObject.year;
		nameCode = eventObject.name + "_" + eventObject.owner;
		myid = vm.auth.uid;

		eveRef.child(dayCode).child(nameCode).set({
			ownerid: myid,
			name: eventObject.name,
			date: eventObject.day + "/" + eventObject.month + "/" + eventObject.year,
			start: eventObject.start,
			end: eventObject.end,
			length: eventObject.length,
		});

		for (i = 0; i < eventObject.agenda.length; ++i) {
			eveRef.child(dayCode).child(nameCode).child("agenda").update({
        		[eventObject.agenda[i].name]: {
					start: eventObject.agenda[i].start,
					end: eventObject.agenda[i].end,
					length: eventObject.agenda[i].length,
					description: eventObject.agenda[i].description,
					category: eventObject.agenda[i].category
				}
			});
		}
		eventObject.invited.unshift(vm.usernameRef);
		var d = new Date(eventObject.year, eventObject.month-1, eventObject.day, 0, 0, 0, 0);
		var returnFunction = function (ok, msg, data) {
			if (ok) {
				callbackFunction(ok, "Event has been created");
			} else {
				callbackFunction(false, msg)
			}
		}
		vm.inviteAll(d, eventObject.name, eventObject.invited, returnFunction);
	}

	vm.getCategories = function () {
		return vm.categoryList;
	}

	vm.inviteAll = function (eventDay, eventName, usernameArray, callbackFunction) {
		var nextCall = function (ok, msg, callback) {
			if (ok && usernameArray.length > 1) {
				usernameArray.shift();
				vm.inviteAll(eventDay, eventName, usernameArray, callbackFunction);
			} else {
				callbackFunction(ok, msg, null);
			}
		}
		vm.invite(eventDay, eventName, usernameArray[0], nextCall);
	}

	vm.invite = function (eventDay, eventName, username, callbackFunction) {
		useRef.child(username).child("id").on("value",
			function (snapshot) {
				inviteStep2(eventDay, eventName, username, snapshot.val(), callbackFunction);
			},
			function (errorObject) {
				console.log("The read failed: " + errorObject.code);
				callbackFunction(false, "Could not get the UID of " + username + " " + errorObject.code, null)
			}
		);
	}

	function inviteStep2(eventDay, eventName, username, uid, callbackFunction) {
		var dayCode = getDayCode(eventDay);
		var eventCode = eventName + "_" + vm.usernameRef;

		useRef.child(username).child("days").child(dayCode).update({
  			[eventCode]: true
		});

		eveRef.child(dayCode).child(eventCode).child("invited").update({
  			[uid]: true
		});
		callbackFunction(true, username + " has been added to " + eventName, null);
	}

	vm.removeEvent = function (eventDay, eventName) {
		var dayCode = getDayCode(eventDay);
		var nameCode = eventName + "_" + vm.usernameRef;
		var url = "https://dh2642.firebaseIO.com/events/" + dayCode + "/" + nameCode;
		var deleteRef = new Firebase(url);
		deleteRef.remove();
	}

	vm.getUsername = function (uid) {
		var found = false;
		useRef.on("value",
			function (snapshot) {
				for (var key in snapshot.val()) {
					if (snapshot.val()[key]["id"] == uid) {
						found = true;
						callbackFunction(true, "User found", key);
					}
				}
				if (!found) {
					callbackFunction(false, "User not found", null);
				}
			},
			function (errorObject) {
				callbackFunction(false, errorObject.code, null);
			}
		);
	}

	vm.getAllUsers = function (callbackFunction) {
		useRef.on("value",
			function (snapshot) {
				var usernames = [];
				for (var key in snapshot.val()) {
					usernames.push(key);
				}
				callbackFunction(true, "All users in database", usernames);
			},
			function (errorObject) {
				callbackFunction(false, errorObject.code, null);
			}
		);
	}

	function getDayCode(day) {
		var dd = day.getDate();
		if (dd < 10) {
			dd = "0" + dd;
		}
		var mm = day.getMonth();
		if (mm < 10) {
			mm = "0" + (mm + 1);
		}
		var yy = day.getFullYear();
		var dayCode = "d" + dd + "m" + mm + "y" + yy;
		return dayCode;
	}

	// Angular service needs to return an object that has all the
	// methods created in it. You can consider that this is instead
	// of calling var model = new DinnerModel() we did in the previous labs
	// This is because Angular takes care of creating it when needed.
	return vm;

});