agendaApp.controller('HomeCtrl', function ($scope,$location, Agenda) {

    if(Agenda.getUser()!==""){
        $location.url('/calendar');
        return;
    }

    $scope.loading = false;
    $scope.spinnerOptions = {radius:10, width:5, length: 16};

    $scope.username ="";
    $scope.password ="";

    $scope.nonmatchingLogin=false;
    // Placeholders
    $scope.usernameplaceholder = "Enter Username...";
    $scope.passwordplaceholder = "*******";


    $scope.getNonmatchingLogin=function(){
        return $scope.nonmatchingLogin;
    }
    $scope.login = function(){
        $scope.loading = true;
        var callback = function(ok,msg){
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
        Agenda.login( $scope.username, $scope.password, callback);

    }
})