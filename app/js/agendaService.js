agendaApp.factory('Agenda',function ($resource, $cookieStore) {

  vm = this;
// Example of function arguments.

// Should use date objects (converted to an int in ms) instead of start, end and dates (day,month,year).
// Ex. One can run new Date().getTime() to get the current time in ms from 1970, storing that int is much easier
// Than having ex. day,month,year.

var exampleAgendaObject1 = {
	name:"name1",
	start:"08:25",
	end:"09:00",
	length:"0h35m",
	category:"Introduction",
	description:"This is the introduction" // Observe this field is required
};

var exampleAgendaObject2 = {
	name:"name2",
	start:"09:00",
	end:"10:36",
	length:"1h36m",
	category:"Other",
	description:"This is the other" // Observe this field is required
};

var exampleEventObject = {
    day:"01",
    month:"06",
    year:"2016",
    name:"OnlyLetters AndNumbers",
	owner:"Kalle", // Observe this is needed in the db
    start:"08:25",
    end:"10:36",
    length:"2h11m",
    invited:['username1', 'username2', 'username3'],
    agenda:[exampleAgendaObject1, exampleAgendaObject2]
};
	// Until Joakim gets data and pass it to agenda
	this.getExampleData = function(){
		return exampleEventObject;
	}

// callback function api.
function exampleCallbackFunction(booleanFalseIfError, stringMessage) {
	// body...
}

dataRef = new Firebase('https://dh2642.firebaseIO.com/');
useRef = dataRef.child("users");
eveRef = dataRef.child("events");
catRef = dataRef.child("catagories"); // categories
vm.usernameRef = "";
vm.auth = null;

  vm.getUser = function(){
    return vm.usernameRef;
  }

    vm.logout =  function(){
      dataRef.unauth();
      vm.usernameRef = "";
      vm.auth = null;
    }

    vm.login = function (username, password, callbackFunction) {
      console.log("Login");
      vm.logout();
      dataRef.authWithPassword({
            email: username + "@mail.com",
            password: password
          }, function(error, authData) {
            if (error) {
              console.log("Login Failed!", error);
              callbackFunction(false, "Login Failed.");
            } else {
              console.log("Authenticated successfully.");
              vm.usernameRef = username;
              vm.auth = dataRef.getAuth();
              callbackFunction(true, "Authenticated successfully.");
            }
          }
      );
    }

vm.createUser = function (username, password, callbackFunction) {
	dataRef.createUser({
  			email: username + "@mail.com",
  			password: password
		}, 
		function(error, userData) {
  			if (error) {
    			console.log("Error creating user:", error);
    			callbackFunction(false, "Could not create the new user.");
  			} else {
    			console.log("Successfully created user account.");
    			createUserStep2(username, password, callbackFunction);
    			
  			}
		}
	);
}

function createUserStep2(username, password, callbackFunction) {
	var calbck = function createUserStep3(ok, message) {
		if (ok){
			useRef.update({
  					[username]: {
  						id: vm.auth.uid,
  						days: {
  							working: true
  						}
  					}
  				}, function(error) {
  					if (error) {
    					console.log('Synchronization failed', error);
    					callbackFunction(false, "Error when creating user.");
  					} else {
  						callbackFunction(true, "User has been created.");
  					}
  				}
  			);
		} else {
			callbackFunction(false, "Error when creating user.");
		}
	}
	vm.login(username, password, calbck);
}


function getUID(username, callbackFunction) {
	
}

function getDay(day, month, year, callbackFunction) {
	// body...
}

function getEvent(day, month, year, eventName, callbackFunction) {
	// body...
}

function setEvent(eventObject, callbackFunction) {
	// body...
}

this.getCategories = function(callbackFunction) {
	// body...
}

function invite(username, callbackFunction) {
	// body...
}

  // Angular service needs to return an object that has all the
  // methods created in it. You can consider that this is instead
  // of calling var model = new DinnerModel() we did in the previous labs
  // This is because Angular takes care of creating it when needed.
  return vm;

});