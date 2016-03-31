agendaApp.controller('HomeCtrl', function ($scope, Agenda) {

    $scope.username ="";
    $scope.password ="";

    $scope.nonmatchingLogin=false;
    // Placeholders
    $scope.usernameplaceholder = "Enter Username...";
    $scope.passwordplaceholder = "*******";


    $scope.login = function(){
        var callback = function(ok,msg){
            console.log(msg);
            if(ok){
                $scope.nonmatchingLogin=false;
                window.location = "/#calendar";
            }else{
                $scope.nonmatchingLogin=true;
            }
        }
        Agenda.login( $scope.username, $scope.password, callback);

    }
})