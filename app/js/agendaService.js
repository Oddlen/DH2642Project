  agendaApp.factory('Agenda',function ($resource, $cookieStore) {

// Example of function arguments.

// Should use date objects (converted to an int in ms) instead of start, end and dates (day,month,year).
// Ex. One can run new Date().getTime() to get the current time in ms from 1970, storing that int is much easier
// Than having ex. day,month,year.

var exampleAgendaObject1 = {
	name:"name1",
	start:"08:25",
	end:"09:00",
	length:"0h35m",
	category:"Introduction"
};

var exampleAgendaObject2 = {
	name:"name2",
	start:"09:00",
	end:"10:36",
	length:"1h36m",
	category:"Other"
};

var exampleEventObject = {
    day:"01",
    month:"06",
    year:"2016",
    name:"OnlyLettersAndNumbers",
    start:"08:25",
    end:"10:36",
    length:"2h11m",
    invited:['username1', 'username2', 'username3'],
    agenda:[exampleAgendaObject1, exampleAgendaObject2]
};

// callback function api.
function exampleCallbackFunction(booleanFalseIfError, stringMessage, JSONData) {
	// body...
}

dataRef = new Firebase('https://dh2642.firebaseIO.com/');
useRef = dataRef.child("users");
eveRef = dataRef.child("events");
catRef = dataRef.child("catagories"); // categories
waiting = 0;
dataArray = [];
this.usernameRef = "";
this.auth = null;

this.createUser = function (username, password, callbackFunction) {
	dataRef.createUser({
  			email: username + "@mail.com",
  			password: password
		}, 
		function(error, userData) {
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
		if (ok){
			useRef.update({
  					[username]: {
  						id: this.auth.uid,
  						days: {
  							working: true
  						}
  					}
  				}, function(error) {
  					if (error) {
    					console.log('Synchronization failed', error);
    					callbackFunction(false, "Error when creating user.", null);
  					} else {
    					this.logout();
  						callbackFunction(true, "User has been created.", null);
  					}
  				}
  			);
		} else {
			callbackFunction(false, "Error when creating user.", null);
		}
	}
  console.log("this.login");
	this.login(username, password, calbck);
}

this.logout =  function(){
	dataRef.unauth();
	this.usernameRef = "";
	this.auth = null;
}

this.login = function (username, password, callbackFunction) {
	console.log("Login");
	this.logout();
  	var vm = this;
	dataRef.authWithPassword({
  			email: username + "@mail.com",
  			password: password
		}, function(error, authData) {
  			if (error) {
    			console.log("Login Failed!", error);
   				callbackFunction(false, "Login Failed.", null);
  			} else {
    			console.log("Authenticated successfully.", null);
    			vm.usernameRef = username;
              console.log(this.usernameRef);
    			vm.auth = dataRef.getAuth();
    			callbackFunction(true, "Authenticated successfully.", null);
  			}
		}
	);
}

this.getUID = function (username, callbackFunction) {
	useRef.child(username).child("id").on("value", 
      		function(snapshot) {
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
	if(ok){
    	dataArray.push(data);
  	}
  	if (waiting == 0)
  	{
    	var tempArray = dataArray;
    	dataArray = [];
    	callbackFunction(true, "ok", tempArray);
  	}
}

function getDayStep2(day, data, callbackFunction) {
	for(var key in data){
		waiting++;
		eveRef.child(day).child(key).on("value",
			function(snapshot) {
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

function getDay(day, callbackFunction) {
	var dd = day.getDate();
	if (dd < 10)
	{
		dd = "0" + dd;
	}
	var mm = day.getMonth();
	if (mm < 10)
	{
		mm = "0" + dd;
	}
	var yy = day.getFullYear();
	var vm = this;
	var dayCode = "d" + dd + "m" + mm + "y" + yy;
	console.log(dayCode);
	useRef.child(vm.usernameRef).child("days").child(dayCode).on("value", 
		function(snapshot) {
			getDayStep2(dayCode, snapshot.val(), callbackFunction);
      	}, 
      	function (errorObject) {
        	console.log("The read failed: " + errorObject.code);
          	callbackFunction(false, "No data found for this day", null);
      	}
  	);
}

function getEvent(day, eventName, callbackFunction) {
	// body...
}

function setEvent(eventObject, callbackFunction) {
	// body...
}

function getCategories(callbackFunction) {
	// body...
}

function invite(username, callbackFunction) {
	// body...
}

  // Angular service needs to return an object that has all the
  // methods created in it. You can consider that this is instead
  // of calling var model = new DinnerModel() we did in the previous labs
  // This is because Angular takes care of creating it when needed.
  return this;

});