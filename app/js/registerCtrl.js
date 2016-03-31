agendaApp.controller('RegisterCtrl', function ($scope,Agenda) {

    $scope.username ="";
    $scope.password ="";
    $scope.confirmpassword ="";
    $scope.passwordTaken = false;
    $scope.nonmatchingPasswords = false;

    $scope.register = function(){
        if($scope.password === $scope.confirmpassword){

            var testFunc = function (ok, msg) {
                console.log(msg);
            }
            Agenda.createUser($scope.username,$scope.password,testFunc);
            window.location="/#calendar";
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
