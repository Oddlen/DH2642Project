/**
 * Controlls the flow for the home, login-screen
 */
agendaApp.controller('HomeCtrl', function ($scope,$location, Agenda) {


    // If the user is already logged in, proceed to the calendar
    if(Agenda.getUser()!==""){
        $location.url('/calendar');
        return;
    }

    // Spinning properties
    $scope.loading = false;

    // Initial values
    $scope.username ="";
    $scope.password ="";

    $scope.nonmatchingLogin=false;
    // Placeholders
    $scope.usernameplaceholder = "Enter Username...";
    $scope.passwordplaceholder = "*******";


    /**
     * A function returning a boolean value telling if the login is nonMatching or not
     */
    $scope.getNonmatchingLogin=function(){
        return $scope.nonmatchingLogin;
    }

    /**
     * Function for logging in
     */
    $scope.login = function(){
        // Activate spinner
        $scope.loading = true;
        /**
         * Callback function specifying the actions to take depending on the server(firebase)
         */
        var callback = function(ok,msg){
            // Stop the spinner
            $scope.loading = false;
            console.log(msg);
            if(ok){
                $scope.$apply(function() {
                    $scope.nonmatchingLogin=false;
                });
                window.location="/#calendar";
            }else{
                $scope.$apply(function() {
                    $scope.nonmatchingLogin=true;
                });
            }
        }
        // Login
        Agenda.login( $scope.username, $scope.password, callback);
    }
})