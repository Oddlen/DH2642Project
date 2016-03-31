agendaApp.controller('RegisterCtrl', function ($scope,Agenda) {

    $scope.username ="";
    $scope.password ="";
    $scope.confirmpassword ="";
    $scope.nonmatchingPasswords = false;
    $scope.usernameTaken = false;


    $scope.register = function(){
        if($scope.password === $scope.confirmpassword){
            $scope.nonmatchingPasswords = false;
            var testFunc = function (ok, msg) {
                console.log(msg);
                if(ok){
                    $scope.usernameTaken = false;
                    window.location="/#calendar";
                }else{
                    $scope.usernameTaken = true;
                }
            }
            Agenda.createUser($scope.username,$scope.password,testFunc);
        }else{
            $scope.nonmatchingPasswords = true;
        }
    }

    $scope.registerButtonDisabled = function(){
        if($scope.username!=="" &&  $scope.password!=="" && $scope.confirmpassword!=="" ){
            return false;
        }else{
            return true;
        }
    }

});
