agendaApp.controller('RegisterCtrl', function ($scope,$location,Agenda) {

    $scope.loading = false;
    $scope.spinnerOptions = {radius:10, width:5, length: 16};

    $scope.username ="";
    $scope.password ="";
    $scope.confirmpassword ="";
    $scope.nonmatchingPasswords = false;
    $scope.usernameTaken = false;

    $scope.getUsernameTaken = function(){
        return $scope.usernameTaken;
    }


    $scope.register = function(){
        $scope.loading = true;
        if($scope.password === $scope.confirmpassword){
            $scope.nonmatchingPasswords = false;
            var testFunc = function (ok, msg) {
                $scope.loading = false;
                console.log(msg);
                if(ok){
                    $scope.$apply(function() {
                        $scope.usernameTaken = false;
                    });
                    window.location="/#calendar";
                }else{
                    $scope.$apply(function() {
                        $scope.usernameTaken = true;
                    });
                }
            }
            Agenda.createUser($scope.username,$scope.password,testFunc);
        }else{
            $scope.loading = false;
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
