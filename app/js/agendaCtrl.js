agendaApp.controller('AgendaCtrl', function ($scope, $timeout, Agenda) {

    $scope.loading = false;
    $scope.spinnerOptions = {radius:10, width:5, length: 16};

    var user = Agenda.getUser();
    if(user===""){
        //window.location="/#home";
        //return;
    }

    var existingMeeting = true;
    var schedule = {};
    var tempstarttime = null;
    var hoursAndMins = null;

    $scope.onMove = function(index){
        $scope.modules.splice(index, 1);
        // Recalculate the start, end times
        $scope.recalculateSchedule();
    }

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

    $scope.recalculateSchedule = function(){
        var scheduleStart = schedule.start;
        var timeStart = scheduleStart.split(":");
        var hour = +timeStart[0];
        var minute = +timeStart[1];
        var totalLength = 0;

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

    $scope.modules = schedule.agenda.slice();
    $scope.endTime = schedule.end;

    var owner = false;

    // This should be if(user===schedule.owner){ when everything works
        if(user!==schedule.owner){
            owner = true;
        }
    $scope.editing = false;
    $scope.isOwner = function(){
        return owner;
    }
    $scope.isNotOwner = function(){
        return !owner;
    }


    $scope.activeModule = {};
    $scope.changeActiveModule = function(mod){
        if($scope.creatingModule){
            alert("You have to finish or cancel the creating of the module first!")
            return;
        }

        var module = JSON.parse(JSON.stringify(mod));
        if($scope.activeModule === module){
            $scope.editing = !$scope.editing;
        }else if(Object.keys($scope.activeModule).length === 0 && JSON.stringify($scope.activeModule) === JSON.stringify({})){
            $scope.editing = !$scope.editing;
        }else if($scope.editing===false){
            $scope.editing = true;
        }

        if($scope.editing){
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

        }
    }

    $scope.toggleEditing = function(){
        $scope.editing=!$scope.editing;
    }

    $scope.isEditing = function(){
        return $scope.editing;
    }
    $scope.isNotEditing = function(){
        return !$scope.editing;
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

    var vm = $scope;
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

    //$scope.types = Agenda.getCategories();
   $scope.types = [{
        Label: 'Introduction',
        Color: '#005de0'
    }, {
        Label: 'Presentation',
        Color: '#d4c32a'
    }, {
        Label: 'Discussion',
        Color: '#6fd952'
    }, {
        Label: 'Break',
        Color: '#e0b955'
    }, {
        Label: 'Other',
        Color: '#9c8581'
    }];

    $scope.getColor = function(module){
        if($scope.creatingModule && module.name === "Pending.."){
            return 'rgba(221,221,221,1)';
        }
        var category = module.category;
        for(var i = 0; i < $scope.types.length;i++){
            if($scope.types[i].Label===category){
                return $scope.types[i].Color
            }
        }
        return 'rgba(221,221,221,1)';
    }

    $scope.getActiveColor = function(){
        if($scope.creatingModule){
            return 'rgba(221,221,221,1)';
        }else{
            return $scope.getColor($scope.activeModule);
        }
    }

    function indexOfCategory(category){
        for(var i = 0; i < $scope.types.length; i++){
            if($scope.types[i].Label===category){
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
        schedule.invited = $scope.participants;
    }

    // OBSERVE THE CALL TO THIS FUNCTION, MIGHT HAVE TO CHANGE
    $scope.removeParticipant = function(participant){
        for(var i = 0; i <  $scope.participants.length; i++){
            if( $scope.participants[i]===participant){
                $scope.participants.splice(i,1);
                break;
            }
        }
        schedule.invited = $scope.participants;
    }


    $scope.confirmagenda ="Confirm agenda"
    $scope.confirmediting ="Confirm editing"
    $scope.cancelediting ="Cancel editing"
    $scope.closedetails ="Close"
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

    $scope.durationmin = 0;

    $scope.creatingModule = false;

    /*
        Clears all information, which then will make it possible to create a new module
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

    $scope.cancelChanges = function(){
        $scope.editing = false;
        $scope.creatingModule = false;
        $scope.modules = schedule.agenda.slice();
        $scope.recalculateSchedule();

    }



    $scope.getModuleName = function(){
        return $scope.entertitle;
    }

    $scope.getDuration= function(){
        return $scope.duration;
    }
    $scope.getDescription = function(){
        return $scope.description;
    }
    $scope.getCategory = function(){
        return $scope.category;
    }

    $scope.editButtonDisabled = function(){
        if( $scope.entertitle !== "" &&  $scope.duration !== 0 && $scope.duration !== "" &&  $scope.category !== ""){
            return false;
        }else{
            return true;
        }
    }

    $scope.agendaButtonDisabled = function(){
        var agenda = schedule.agenda;
        if(agenda.length !== 0){
            return false;
        }else{
            return true;
        }
    }

    $scope.closeDetails = function(){
        $scope.editing = false;
    }

    $scope.addModule = function(){

        $scope.activeModule.name = $scope.entertitle;
        $scope.activeModule.category=$scope.category.Label;
        $scope.activeModule.description=$scope.description;
        schedule.agenda = $scope.modules.slice();
        $scope.editing = false;
        $scope.creatingModule = false;
    };

    $scope.removeTempModule = function(){
        var module = $scope.activeModule;
        for(var i = 0; i < $scope.modules.length; i++){
            var tempMod = $scope.modules[i];

            if(tempMod.name===module.name){
                $scope.modules.splice(i,1);
                break;
            }
        }
    }

    // Removes the given module from the agenda
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

    $scope.submitAgenda = function(){
        var callbk = function(status, msg){
            if(status===false){
                alert("Fail");
            }else{
                alert("Created Event");
            }
        }

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

        var callbk = function(ok,msg){
            $scope.loading = false;
            if(ok){
                window.location="#calendar";
            }else{
                alert(msg);
            }
        }
        console.log(schedule);
        $scope.loading = true;
        Agenda.setEvent(schedule, callbk)
    };



})