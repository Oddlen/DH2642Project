agendaApp.controller('RegisterCtrl', function ($scope) {

    $scope.username ="";
    $scope.password ="";
    $scope.confirmpassword ="";
    $scope.register = function(){
        console.log($scope.password);
        if($scope.password != "" && $scope.password === $scope.confirmpassword){
            // agenda.createUser(username,password);
            window.location="/#home";
        }else{
            alert("The passwords do not match");
        }
    }

});
