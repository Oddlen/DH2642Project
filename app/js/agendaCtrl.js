agendaApp.controller('AgendaCtrl', function ($scope) {
    var owner = true;
    $scope.isOwner = function(){
        return owner;
    }
    $scope.isNotOwner = function(){
        return !owner;
    }

    $scope.date = new Date();
    $scope.displayDate = "2016-03-22";
    $scope.displayTime = '';

    $scope.$watch('date', function() {
        var hour = $scope.date.getHours(),
            hour = hour<10 ? '0'+hour : hour,
            minutes = ($scope.date.getMinutes()<10 ? '0' :'') + $scope.date.getMinutes();
        $scope.displayTime = hour+':'+minutes
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
    $scope.category = "";
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