agendaApp.controller('AgendaCtrl', function ($scope, $timeout, Agenda) {

    // For testing
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
    $scope.modules = [exampleAgendaObject1, exampleAgendaObject2];






    var user = Agenda.getUser();
    if(user===""){
        //window.location="/#home";
        //return;
    }

    var existingMeeting = true;
    var schedule = {};
    var tempstarttime = null;
    var hoursAndMins = null;
    if(existingMeeting){
        schedule = Agenda.getExampleData();
        tempstarttime = schedule.start;
        hoursAndMins = tempstarttime.split(":");
        if(hoursAndMins.length !== 2){
            window.location="/#home";
            return;
        }
        $scope.date = new Date(schedule.year, +schedule.month-1, schedule.day, hoursAndMins[0], hoursAndMins[1]);
    }else{
        $scope.date = new Date();
        var hour = $scope.date.getHours(),
            hour = hour<10 ? '0'+hour : hour,
            minutes = ($scope.date.getMinutes()<10 ? '0' :'') + $scope.date.getMinutes();
        schedule.start = hour+':'+minutes;
        schedule.length = "0h0m";
        schedule.owner=user;
        schedule.year =  $scope.date.getFullYear().toString();
        schedule.month = ( $scope.date.getMonth()+1).toString();
        schedule.day  =  $scope.date.getDate().toString();
        schedule.name = "";
        schedule.invited=[];
        schedule.agenda = [];
    }


    var owner = false;
        if(user===schedule.owner){
            owner = true;
        }
    $scope.editing = true;
    $scope.isOwner = function(){
        return owner;
    }
    $scope.isNotOwner = function(){
        return !owner;
    }

    $scope.isEditing = function(){
        return $scope.editing;
    }
    $scope.isNotEditing = function(){
        return !$scope.editing;
    }
    $scope.toggleEditing = function(){
        $scope.editing=!$scope.editing;
    }

    $scope.open = function() {

        $timeout(function() {
            $scope.opened = true;
        });
    };

    var yyyy =  $scope.date.getFullYear().toString();
    var mm = ( $scope.date.getMonth()+1).toString();
    var dd  =  $scope.date.getDate().toString();
    $scope.displayDate = yyyy +"/"+ (mm[1]?mm:"0"+mm[0]) +"/"+ (dd[1]?dd:"0"+dd[0]);
    $scope.displayTime = '';

    $scope.$watch('date', function() {
        if($scope.date !== undefined){
            var hour = $scope.date.getHours(),
                hour = hour<10 ? '0'+hour : hour,
                minutes = ($scope.date.getMinutes()<10 ? '0' :'') + $scope.date.getMinutes();
            $scope.displayTime = hour+':'+minutes
        }
    })

    $scope.hstep = 1;
    $scope.mstep = 1;


    $scope.ismeridian = false;

    $scope.inviting ="";

    if(existingMeeting){
        $scope.meetingname =schedule.name;
    }else{
        $scope.meetingname ="";
    }
    $scope.format = 'yyyy/MM/dd';

    //$scope.types = Agenda.getCategories()
    $scope.types = [{
        label: 'Introduction'
    }, {
        label: 'Other'
    }];

    function indexOfCategory(category){
        for(var i = 0; i < $scope.types.length; i++){
            if($scope.types[i].label===category){
                return i;
            }
        }
        return 0;
    }

    if(existingMeeting){
        $scope.participants = schedule.invited;
    }else{
        $scope.participants = [];
    }
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
    }

    // OBSERVE THE CALL TO THIS FUNCTION, MIGHT HAVE TO CHANGE
    $scope.removeParticipant = function(participant){
        for(var i = 0; i <  $scope.participants.length; i++){
            if( $scope.participants[i]===participant){
                $scope.participants.splice(i,1);
                break;
            }
        }
    }


    $scope.confirmagenda ="Confirm agenda"
    $scope.confirmediting ="Confirm editing"
    $scope.invitedheadline ="Invited"
    $scope.titlestring ="Title:"
    $scope.durationstring ="Duration:"
    $scope.minstring ="min"
    $scope.categorystring ="Category:"
    $scope.descriptionstring ="Description:";
    $scope.datestring ="Date:";
    $scope.startstring ="Start Time:"


    // Placeholders
    $scope.meetingnameplaceholder = "Enter Meeting Title...";
    $scope.invitingplaceholder = "Enter user to invite...";
    $scope.entertitleplaceholder = "Enter Title...";
    $scope.durationplaceholder = "0";
    $scope.descriptionplaceholder = "Describe the meeting part...";

    var existingModule = true;
    var agenda = null;
    if(existingModule){
        var editingmodule = schedule.agenda[0];
        agenda = editingmodule;
        $scope.entertitle = agenda.name;
        var modulelength = agenda.length;
        var modulehoursAndMins = modulelength.split("h");
        $scope.duration = (+modulehoursAndMins[0]*60) + (+(modulehoursAndMins[1].split("m")[0]))
    }else{
        $scope.entertitle = "";
        $scope.duration = 0;
    }
    if(owner){
        if(existingModule){
            $scope.category = $scope.types[indexOfCategory(agenda.category)];
        }else{
            $scope.category = $scope.types[0];
        }
    }else{
        if(existingModule) {
            $scope.category = agenda.category;
        }else{
            $scope.category = $scope.types[0].label;;
        }
    }
    if(existingModule){
        $scope.description = agenda.description;
    }else{
        $scope.description = "";
    }

    $scope.editButtonDisabled = function(){
        if( $scope.entertitle !== "" &&  $scope.duration !== 0 &&  $scope.category !== "" &&  $scope.description !== ""){
            return false;
        }else{
            return true;
        }
    }

    $scope.agendaButtonDisabled = function(){
        var agenda = [];
        if(agenda.length !== 0){
            return false;
        }else{
            return true;
        }
    }

})