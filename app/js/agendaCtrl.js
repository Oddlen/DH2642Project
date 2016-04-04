agendaApp.controller('AgendaCtrl', function ($scope, $timeout, Agenda) {

    // For testing, for Mark
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

    var exampleAgendaObject3 = {
        name:"name3",
        start:"10:36",
        end:"10:38",
        length:"0h2m",
        category:"Other",
        description:"This is the other" // Observe this field is required
    };


    var exampleAgendaObject4 = {
        name:"name3",
        start:"10:38",
        end:"10:40",
        length:"0h2m",
        category:"Other",
        description:"This is the other" // Observe this field is required
    };

    var exampleAgendaObject5 = {
        name:"name3",
        start:"10:40",
        end:"10:42",
        length:"0h2m",
        category:"Other",
        description:"This is the other" // Observe this field is required
    };

    var exampleAgendaObject6 = {
        name:"name3",
        start:"10:42",
        end:"10:44",
        length:"0h2m",
        category:"Other",
        description:"This is the other" // Observe this field is required
    };

    //$scope.modules = [exampleAgendaObject1, exampleAgendaObject2, exampleAgendaObject3,exampleAgendaObject4, exampleAgendaObject5, exampleAgendaObject6];




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

    $scope.recalculateSchedule = function(){
        console.log("calc");
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
        }

        if($scope.modules.length>0){
            schedule.end = $scope.modules[$scope.modules.length-1].end;
            $scope.endTime = $scope.modules[$scope.modules.length-1].end;
        }else{
            schedule.end = $scope.displayTime;
            $scope.endTime = $scope.displayTime;
        }
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
        schedule.length = "0h0m";
        schedule.owner=user;
        schedule.year =  $scope.date.getFullYear().toString();
        schedule.month = ( $scope.date.getMonth()+1).toString();
        schedule.month =  schedule.month[1]?schedule.month:"0"+schedule.month[0];
        schedule.day  =  $scope.date.getDate().toString();
        schedule.day  =  schedule.day[1]?schedule.day:"0"+schedule.day[0];

        schedule.name = "";
        schedule.invited=[];
        schedule.agenda = [];
        //schedule.agenda = [exampleAgendaObject1, exampleAgendaObject2, exampleAgendaObject3];
    }

    $scope.modules = schedule.agenda;
    $scope.endTime = schedule.end;

    var owner = false;
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
    $scope.changeActiveModule = function(module){
        if($scope.activeModule === module){
            $scope.editing = !$scope.editing;
        }else if($scope.activeModule==={}){
            $scope.editing = !$scope.editing;
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
        console.log("watch");
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
        var min = $scope.duration % 60;
        var h = 0;
        var lengthMin = $scope.duration;
        while(lengthMin>=60){
            lengthMin = lengthMin-60;
            h++;
        }
        $scope.activeModule.duration=(h<10 ? '0' :'') + h +"h"+(min<10 ? '0' :'') + min+"m";
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

       $scope.creatingModule = false;

    /*
        Clears all information, which then will make it possible to create a new module
     */
    $scope.createAgendaModule = function(){
        if($scope.creatingModule === true){
            return;
        }

        $scope.creatingModule = true;
        $scope.editing = true;
        $scope.category = $scope.types[0];
        $scope.duration = "";
        $scope.entertitle = "";
        $scope.description = "";
        $scope.activeModule = {};
        $scope.activeModule.name = "Pending..";
        if($scope.modules.length>0){
            $scope.activeModule.start = $scope.modules[$scope.modules.length-1].end;
            $scope.activeModule.end = $scope.modules[$scope.modules.length-1].end;
        }else{
            $scope.activeModule.start = $scope.displayTime;
            $scope.activeModule.end = $scope.displayTime;
        }
        $scope.activeModule.length = "0h0m";
        $scope.activeModule.category = $scope.types[0].label;
        $scope.activeModule.description = "";
        $scope.modules.push($scope.activeModule);
    }

    $scope.cancelChanges = function(){
        $scope.editing = false;
        $scope.creatingModule = false;

        $scope.removeTempModule()
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
        if( $scope.entertitle !== "" &&  $scope.duration !== 0 &&  $scope.category !== "" &&  $scope.description !== ""){
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

    $scope.addModule = function(){
        $scope.creatingModule = false;
        var agenda = schedule.agenda;
        var agendaObject = {};
        agendaObject.name=$scope.entertitle;
        agendaObject.start="";
        agendaObject.end="";
        var lengthMin = $scope.duration;
        var min = lengthMin % 60;
        var h = 0;
        while(lengthMin>=60){
            lengthMin = lengthMin-60;
                h++;
        }

        agendaObject.length=(h<10 ? '0' :'') + h +"h"+(min<10 ? '0' :'') + min+"m";
        agendaObject.category=$scope.category.label;
        agendaObject.description=$scope.description;
        agenda.push(agendaObject);
        $scope.modules.push(agendaObject);
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
        console.log("removeModule");
        var agenda = schedule.agenda;
        for(var i = 0; i < agenda.length; i++){
            var tempMod = agenda[i];

            if(tempMod.start === module.start && tempMod.end === module.end && tempMod.name===module.name){
                console.log("Removed");
                agenda.splice(i,1);
                $scope.modules.splice(i,1);
                break;
            }
        }
        schedule.agenda = agenda;
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


        schedule.length = h+"h"+min+"m";
        schedule.owner=user;
        schedule.year =  $scope.date.getFullYear().toString();
        schedule.month = ( $scope.date.getMonth()+1).toString();
        schedule.month =  schedule.month[1]?schedule.month:"0"+schedule.month[0];
        schedule.day  =  $scope.date.getDate().toString();
        schedule.day  =  schedule.day[1]?schedule.day:"0"+schedule.day[0];
        schedule.name = $scope.meetingname;
        schedule.invited=$scope.participants;

        console.log(schedule);

        Agenda.setEvent(schedule, callbk)
    };



})