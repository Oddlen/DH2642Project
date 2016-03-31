agendaApp.controller('AgendaCtrl', function ($scope, $timeout, Agenda) {
    var user = Agenda.getUser();
    if(user===""){
        window.location="/#home";
    }
    var owner = true;
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

    $scope.date = new Date();
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

    $scope.inviting =""
    $scope.meetingname =""
    $scope.format = 'yyyy/MM/dd';
    $scope.date = new Date();
    $scope.starttime;

    $scope.types = [{
        label: 'Intro'
    }, {
        label: 'Outro'
    }];


    $scope.participants = ["Mark Wong", "Joakim Hedlund","Marcus Löf", "Willhelm Magnusson"];
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



    $scope.durationmin = 0;

    // Placeholders
    $scope.meetingnameplaceholder = "Enter Meeting Title...";
    $scope.invitingplaceholder = "Enter user to invite...";
    $scope.entertitleplaceholder = "Enter Title...";
    $scope.durationplaceholder = "0";
    $scope.descriptionplaceholder = "Describe the meeting part...";

    // Real values
    $scope.entertitle = "";
    $scope.duration = 0;
    if(owner){
        $scope.category = $scope.types[0];
    }else{
        $scope.category = "Intro";
    }
    $scope.description = "";

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