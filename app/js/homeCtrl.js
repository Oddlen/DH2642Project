agendaApp.controller('HomeCtrl', function ($scope) {

    $scope.username ="";
    $scope.password ="";
    // Placeholders
    $scope.usernameplaceholder = "Enter Username...";
    $scope.passwordplaceholder = "*******";


    $scope.login = function(){
        //agenda.login(username,password);
    }
})