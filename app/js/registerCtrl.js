/**
 * Controller which controlls the flow for registering
 */
agendaApp.controller('RegisterCtrl', function ($scope,$location,Agenda) {

    // Spinner properties
    $scope.loading = false;
    $scope.spinnerOptions = {radius:10, width:5, length: 16};

    // Initialize all fields
    $scope.username ="";
    $scope.password ="";
    $scope.confirmpassword ="";
    $scope.nonmatchingPasswords = false;
    $scope.usernameTaken = false;

    /**
     *Function that returns true if the chosen username is taken
     */
    $scope.getUsernameTaken = function(){
        return $scope.usernameTaken;
    }

    /**
     * Function specifying actions to take when pressing the register button
     */
    $scope.register = function(){
        // The loading wheel shall spin
        $scope.loading = true;
        if($scope.password === $scope.confirmpassword){
            $scope.nonmatchingPasswords = false;
            /**
             * The callback function when registering
             */
            var callback = function (ok, msg) {
                // Stop the loading wheel
                $scope.loading = false;
                //console.log(msg);
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
            Agenda.createUser($scope.username,$scope.password,callback);
        }else{
            // Stop the loading wheel
            $scope.loading = false;
            $scope.nonmatchingPasswords = true;
        }
    }

    /**
     * Function telling if the register button should be disabled or not. It is not disabled if all fields are filled
     */
    $scope.registerButtonDisabled = function(){
        if($scope.username!=="" &&  $scope.password!=="" && $scope.confirmpassword!=="" ){
            return false;
        }else{
            return true;
        }
    }
});
