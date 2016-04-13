/**
 * Controller handling all interaction in the agenda view, including adding/changing/removing modules.
 * Also handles the flow depending on if the logged in user is the owner or not.
 */
agendaApp.controller('AgendaCtrl', function ($scope, $timeout,$location, Agenda, MeetingAgenda) {

    // Old values
    $scope.oldname = "";
    $scope.oldday="";
    $scope.oldmonth="";
    $scope.oldyear="";


    // The properties for the spinner
    $scope.loading = false;
    $scope.spinnerOptions = {radius:10, width:5, length: 16};

    // Get the logged in user
    var user = Agenda.getUser();
    if(user===""){
        // The user was not logged in, send to homepage
        // $location.url('/home');
        //return;
    }

    // Initial the schedule variable, which holds the whole meeting schedule
    var schedule = {};

    // Get the existing meeting in the meetingagenda
    var existingMeeting = MeetingAgenda.getExistingMeeting();

    // Initialize
    var tempstarttime = null;
    var hoursAndMins = null;

    /**
     * Function specifying what actions to take when drag-and-dropping the module with index index
     */
    $scope.onMove = function(index){
        $scope.modules.splice(index, 1);
        // Recalculate the start, end times
        $scope.recalculateSchedule();
    }

    /**
     * Given hour and minute and a totalLength in minute, calculate the new time and format. hour,minute + totalLength => new time
     */
    $scope.formattedTime = function(hour, minute, totalLength){
        var min = totalLength % 60;
        var h = 0;
        var lengthMin = totalLength;
        while(lengthMin>=60){
            lengthMin = lengthMin-60;
            h++;
        }
        var mins = minute+min;
        if(mins>=60){
            h++;
            mins = mins-60;
        }
        var hours =hour+h;
        var formatTime = (hours<10 ? '0' :'') + hours +":"+(mins<10 ? '0' :'') + mins;
        return formatTime;
    }

    /**
     * Recalculates the whole schedule for the drag-and-drop list of modules
     */
    $scope.recalculateSchedule = function(){

        // Initial values
        var scheduleStart = schedule.start;
        var timeStart = scheduleStart.split(":");
        var hour = +timeStart[0];
        var minute = +timeStart[1];
        var totalLength = 0;

        // Loop through all modules and calculate their new times
        for(var i = 0; i < $scope.modules.length; i++){
            $scope.modules[i].start = $scope.formattedTime(hour,minute,totalLength);
            var modulehoursAndMins = $scope.modules[i].length.split("h");
            var duration = (+modulehoursAndMins[0]*60) + (+(modulehoursAndMins[1].split("m")[0]));

            totalLength += duration;
            $scope.modules[i].end = $scope.formattedTime(hour,minute,totalLength);
            var min = duration % 60;
            var h = 0;
            while(duration>=0){
                duration = duration-60;
                if(duration>=0){
                    h++;
                }
            }
            h = h<10 ? '0'+h : h;
            min = (min<10 ? '0'+min :min);
            $scope.modules[i].length = h+"h"+min+"m";

        }

        if($scope.modules.length>0){
            $scope.endTime = $scope.modules[$scope.modules.length-1].end;

        }else{
            $scope.endTime = $scope.displayTime;

        }
    }
    
    if(existingMeeting){
        // If the meeting was existing, fetch
        schedule = MeetingAgenda.getMeeting();
        tempstarttime = schedule.start;
        hoursAndMins = tempstarttime.split(":");
        $scope.date = new Date(schedule.year, +schedule.month-1, schedule.day, hoursAndMins[0], hoursAndMins[1]);
        $scope.oldname = schedule.name;
        $scope.oldyear = schedule.year;
        $scope.oldmonth = schedule.day;
    }else{
        // This is a new meeting, initialize a meeting(schedule) object
        $scope.date = new Date();
        var hour = $scope.date.getHours(),
            hour = hour<10 ? '0'+hour : hour,
            minutes = ($scope.date.getMinutes()<10 ? '0' :'') + $scope.date.getMinutes();
        schedule.start = hour+':'+minutes;
        schedule.end = hour+':'+minutes;
        schedule.length = "00h00m";
        schedule.owner=user;
        schedule.year =  $scope.date.getFullYear().toString();
        schedule.month = ( $scope.date.getMonth()+1).toString();
        schedule.month =  schedule.month[1]?schedule.month:"0"+schedule.month[0];
        schedule.day  =  $scope.date.getDate().toString();
        schedule.day  =  schedule.day[1]?schedule.day:"0"+schedule.day[0];

        schedule.name = "";
        schedule.invited=[];
        schedule.agenda = [];
    }

    // Copy the agenda do modules
    $scope.modules = schedule.agenda.slice();
    $scope.endTime = schedule.end;

    // Variable telling if the user is the owner of this meeting or not
    var owner = false;

    // This should be if(user===schedule.owner){ when everything works
        if(user===schedule.owner){
            // It is the owner of the meeting
            owner = true;
        }
    // Boolean specifying if the user is in "editing-mode" or not
    $scope.editing = false;

    /**
     * Function to get if the user is the owner of this meeting
     */
    $scope.isOwner = function(){
        return owner;
    }

    /**
     * Function to get if the user is not the owner of this meeting
     */
    $scope.isNotOwner = function(){
        return !owner;
    }


    // Initializing the variable for the current module which is modified/created
    $scope.activeModule = {};

    /**
     * Changes which module is the active one
     */
    $scope.changeActiveModule = function(mod){
        if($scope.creatingModule){
            // The user tries to change module while creating one, this is not allowed
            alert("You have to finish or cancel the creating of the module first!")
            return;
        }

        // Code for comparing if one tried to change module to the same or not
        var module = JSON.parse(JSON.stringify(mod));
        if(JSON.parse(JSON.stringify($scope.activeModule)) === JSON.stringify(module)){
            // It is the same, reverse the detail mode
            $scope.editing = !$scope.editing;
        }else if(Object.keys($scope.activeModule).length === 0 && JSON.stringify($scope.activeModule) === JSON.stringify({})){
            $scope.editing = !$scope.editing;
        }else if($scope.editing===false){
            $scope.editing = true;
        }

        if($scope.editing){
            if(JSON.stringify($scope.activeModule) !== JSON.stringify(module)){
                // If it is a new module, change the activeModule
            $scope.activeModule = module;
                var modulehoursAndMins  = module.length.split("h");
                $scope.duration = (+modulehoursAndMins[0]*60) + (+(modulehoursAndMins[1].split("m")[0]))
                $scope.entertitle = module.name;
                $scope.description = module.description;
                if(!owner){
                    $scope.category = module.category;
                }else{
                    $scope.category = $scope.types[indexOfCategory(module.category)];
                }
            }else{
                // Do nothing
            }
        }else{
            // Do nothing
        }
    }

    /**
     * Function for toggling the editing, detail mode
     */
    $scope.toggleEditing = function(){
        $scope.editing=!$scope.editing;
    }

    /**
     * Tells if the user is in editing,detail mode or not
     */
    $scope.isEditing = function(){
        return $scope.editing;
    }
    /**
     * Tells if the user is not in editing,detail mode or not
     */
    $scope.isNotEditing = function(){
        return !$scope.editing;
    }


    /**
     * Function for handling the datepicker, open
     */
    $scope.open = function() {
        $timeout(function() {
            $scope.opened = true;
        });
    };

    // Display time on appropriate format
    var yyyy =  $scope.date.getFullYear().toString();
    var mm = ( $scope.date.getMonth()+1).toString();
    var dd  =  $scope.date.getDate().toString();
    $scope.displayDate = yyyy +"/"+ (mm[1]?mm:"0"+mm[0]) +"/"+ (dd[1]?dd:"0"+dd[0]);
    $scope.displayTime = '';

    // For access of the variable
    var vm = $scope;

    // Watch the date variable and take appropriate actions on change, like recalculating the schedule
    $scope.$watch('date', function() {
        if($scope.date !== undefined){
            var hour = $scope.date.getHours(),
                hour = hour<10 ? '0'+hour : hour,
                minutes = ($scope.date.getMinutes()<10 ? '0' :'') + $scope.date.getMinutes();
            $scope.displayTime = hour+':'+minutes;
            var yyyy =  $scope.date.getFullYear().toString();
            var mm = ( $scope.date.getMonth()+1).toString();
            var dd  =  $scope.date.getDate().toString();
            $scope.displayDate = yyyy +"/"+ (mm[1]?mm:"0"+mm[0]) +"/"+ (dd[1]?dd:"0"+dd[0]);
            schedule.start =  $scope.displayTime;
            $scope.recalculateSchedule();
        }
    });

    // Watch the duration variable and take appropriate actions on change, like recalculating the schedule
    $scope.$watch('duration',function(){
        if($scope.duration === "" || $scope.duration===undefined){
            return;
        }
        var min = $scope.duration % 60;
        var h = 0;
        var lengthMin = $scope.duration;
        while(lengthMin>=60){
            lengthMin = lengthMin-60;
            h++;
        }
        $scope.activeModule.length=(h<10 ? '0' :'') + h +"h"+(min<10 ? '0' :'') + min+"m";
        for(var i = 0; i < $scope.modules.length; i++){
            if($scope.modules[i].name === $scope.activeModule.name){
                $scope.modules[i] = $scope.activeModule;
                break;
            }
        }
        $scope.recalculateSchedule();
    });



    // The steps for the timepicker, 1 hour and 1 minute at the time
    $scope.hstep = 1;
    $scope.mstep = 1;

    // The timepicker should not user meridan, aka AM and PM
    $scope.ismeridian = false;

    // Initialize the variable for holding the person to be invited
    $scope.inviting ="";

    if(existingMeeting){
        // If the meeting existed, use the existing name for meetingname
        $scope.meetingname =schedule.name;
    }else{
        // Else make it empty
        $scope.meetingname ="";
    }
    // Format for the date
    $scope.format = 'yyyy/MM/dd';

    // The categories used in the application
    $scope.types = Agenda.getCategories();
    console.log($scope.types);
   /*$scope.types = [{
        Label: 'Introduction',
        Color: '#09baeb'
    }, {
        Label: 'Presentation',
        Color: '#e8d956'
    }, {
        Label: 'Discussion',
        Color: '#6fd952'
    }, {
        Label: 'Break',
        Color: '#d69d40'
    }, {
        Label: 'Other',
        Color: '#de9d81'
    }];
*/
    /**
     * Returns the kind of border the module should have
     */
    $scope.getModuleBorder = function(module){
        if(module===$scope.activeModule){
            // If it is the active module, then have dotted border
            return "dotted";
        }else{
            return "none";
        }
    }

    /**
     * Defines the color given a module
     */
    $scope.getColor = function(module){
        if($scope.creatingModule && module.name === "Pending.."){
            // It is the currently creating module
            return 'rgba(221,221,221,1)';
        }
        var category = module.category;
        for(var i = 0; i < $scope.types.length;i++){
            if($scope.types[i].Label===category){
                // Use appropriate color due to the category
                return $scope.types[i].Color
            }
        }
        // If nothing matched, then use this color
        return 'rgba(221,221,221,1)';
    }

    /**
     * Gets the color for the active module
     */
    $scope.getActiveColor = function(){
        if($scope.creatingModule){
            return 'rgba(221,221,221,1)';
        }else{
            return $scope.getColor($scope.activeModule);
        }
    }

    /**
     * Get the index of the types-list of the given category
     */
    function indexOfCategory(category){
        for(var i = 0; i < $scope.types.length; i++){
            if($scope.types[i].Label===category){
                return i;
            }
        }
        return 0;
    }

    if(existingMeeting){
        // If the meeting existed, use the list of already invited people
        $scope.participants = schedule.invited;
    }else{
        // Else defined an empty list
        $scope.participants = [];
    }

    /**
     * Adds a participant to the temporary schedule
     */
    $scope.addParticipant = function(){
        var userAdded = false;
        for(var i = 0; i <  $scope.participants.length; i++){
            if( $scope.participants[i]===$scope.inviting){
                userAdded = true;
                break;
            }
        }
        if($scope.inviting !== "" && !userAdded){
            $scope.participants.push($scope.inviting)
            $scope.inviting =""
        }
        schedule.invited = $scope.participants;
    }

    /**
     * Removes a participant from the temporary schedule
     */
    $scope.removeParticipant = function(participant){
        for(var i = 0; i <  $scope.participants.length; i++){
            if( $scope.participants[i]===participant){
                $scope.participants.splice(i,1);
                break;
            }
        }
        schedule.invited = $scope.participants;
    }

    // Placeholders
    $scope.meetingnameplaceholder = "Enter Meeting Title...";
    $scope.invitingplaceholder = "Enter user to invite...";
    $scope.entertitleplaceholder = "Enter Title...";
    $scope.durationplaceholder = "0";
    $scope.descriptionplaceholder = "Describe the meeting part...";

    // Variable for duration
    $scope.durationmin = 0;

    // A module is initialized to not be created
    $scope.creatingModule = false;

    /**
     * Creates a new agenda module to add to the temporary list
     */
    $scope.createAgendaModule = function(){
        $scope.modules = schedule.agenda.slice();
        $scope.activeModule = {};
        if($scope.creatingModule === true){
            return;
        }

        $scope.creatingModule = true;
        $scope.editing = true;
        $scope.category = $scope.types[0];
        $scope.duration = "";
        $scope.entertitle = "";
        $scope.description = "";
        $scope.activeModule.name = "Pending..";
        if($scope.modules.length>0){
            $scope.activeModule.start = $scope.modules[$scope.modules.length-1].end;
            $scope.activeModule.end = $scope.modules[$scope.modules.length-1].end;
        }else{
            $scope.activeModule.start = $scope.displayTime;
            $scope.activeModule.end = $scope.displayTime;
        }
        $scope.activeModule.length = "00h00m";
        $scope.activeModule.category = $scope.types[0].Label;
        $scope.activeModule.description = "";
        $scope.modules.push($scope.activeModule);

    }

    /**
     * Function for canceling the temporary changes made, and thus bringing the user back to the previous state
     */
    $scope.cancelChanges = function(){
        $scope.editing = false;
        $scope.creatingModule = false;
        $scope.modules = schedule.agenda.slice();
        $scope.recalculateSchedule();

    }


    /**
     * Gets the name of the module
     */
    $scope.getModuleName = function(){
        return $scope.entertitle;
    }

    /**
     * Gets the current module duration
     */
    $scope.getDuration= function(){
        return $scope.duration;
    }
    /**
     * Gets the current modules description
     */
    $scope.getDescription = function(){
        return $scope.description;
    }
    /**
     * Gets the currents modules category
     */
    $scope.getCategory = function(){
        return $scope.category;
    }

    /**
     * Function telling if the edit button should be disabled or not
     */
    $scope.editButtonDisabled = function(){
        if( $scope.entertitle !== "" &&  $scope.duration !== 0 && $scope.duration !== "" &&  $scope.category !== ""){
            // All required fields are filled, make disable=false
            return false;
        }else{
            return true;
        }
    }

    /**
     * Function telling if the confirm agenda button should be disabled or not
     */
    $scope.agendaButtonDisabled = function(){
        var agenda = schedule.agenda;
        if(agenda.length !== 0){
            // As long as the schedule is not empty, let it be non-disabled
            return false;
        }else{
            return true;
        }
    }

    /**
     * Close the detail view
     */
    $scope.closeDetails = function(){
        $scope.editing = false;
    }

    /**
     * Adds a new module to the schedule
     */
    $scope.addModule = function(){
        $scope.activeModule.name = $scope.entertitle;
        $scope.activeModule.category=$scope.category.Label;
        $scope.activeModule.description=$scope.description;
        schedule.agenda = $scope.modules.slice();
        $scope.editing = false;
        $scope.creatingModule = false;
    };

    /**
     * Removes the given module from the agenda and then takes appropriate actions
     */
    $scope.removeModule = function(module) {
        for(var i = 0; i < $scope.modules.length; i++){
            var tempMod = $scope.modules[i];

            if(tempMod === module){
                $scope.modules.splice(i,1);
                break;
            }
        }
        schedule.agenda = $scope.modules.slice();
        $scope.editing = false;
        $scope.creatingModule = false;
        $scope.recalculateSchedule();
    }

    /**
     * Submit the whole schedule agenda to the server to store, this permanently saves the changes in the database if succeeded
     */
    $scope.submitAgenda = function(){

        console.log(schedule.participants);

        // Calculate all fields for submittal
        var hour = $scope.date.getHours(),
            hour = hour<10 ? '0'+hour : hour,
            minutes = ($scope.date.getMinutes()<10 ? '0' :'') + $scope.date.getMinutes();
        schedule.start = hour+':'+minutes;

        var length = 0;
        for(var i = 0; i < schedule.agenda.length; i++){
            var agendalength = schedule.agenda[i].length;
            var modulehoursAndMins = agendalength.split("h");
            length += (+modulehoursAndMins[0]*60) + (+(modulehoursAndMins[1].split("m")[0]));
        }
        var meetinglength = length*60*1000;
        var min = length % 60;
        var h = 0;
        while(length>=0){
            length = length-60;
            if(length>=0){
                h++;
            }
        }
        var endTime = new Date($scope.date.getTime()+meetinglength);
        var endhour = endTime.getHours(),
            endhour = endhour<10 ? '0'+endhour : endhour,
            endmin = (endTime.getMinutes()<10 ? '0' :'') + endTime.getMinutes();
        schedule.end = endhour + ':' + endmin;
        $scope.endTime = schedule.end;

        h = h<10 ? '0'+h : h;
        min = (min<10 ? '0'+min :min);
        schedule.length = h+"h"+min+"m";

        schedule.owner=user;
        schedule.year =  $scope.date.getFullYear().toString();
        schedule.month = ( $scope.date.getMonth()+1).toString();
        schedule.month =  schedule.month[1]?schedule.month:"0"+schedule.month[0];
        schedule.day  =  $scope.date.getDate().toString();
        schedule.day  =  schedule.day[1]?schedule.day:"0"+schedule.day[0];
        schedule.name = $scope.meetingname;
        schedule.invited=$scope.participants;
        schedule.oldname = $scope.oldname;
        schedule.oldyear = $scope.oldyear;
        schedule.oldmonth = $scope.oldmonth;
        schedule.oldday = $scope.oldday;

        /**
         * Defines the callback function
         */
        var callbk = function(ok,msg){
            // Stop the loading wheel
            $scope.loading = false;
            if(ok){
                window.location="/#calendar";
            }else{
                alert(msg);
            }
        }
        console.log(schedule);
        // Start the loading wheel
        $scope.loading = true;

        // Set the event to model
        Agenda.setEvent(schedule, callbk)
    };
})