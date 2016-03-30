agendaApp.controller('RegisterCtrl', function ($scope) {

    $scope.username ="";
    $scope.password ="";
    $scope.confirmpassword ="";
    $scope.passwordTaken = false;
    $scope.nonmatchingPasswords = false;

    $scope.register = function(){
        if($scope.password === $scope.confirmpassword){
            // agenda.createUser(username,password);
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
