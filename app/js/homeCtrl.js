/**
 * Controlls the flow for the home, login-screen
 */
agendaApp.controller('HomeCtrl', function ($scope,$location, Agenda) {

    // Weather
    $scope.lat = null;
    $scope.lon = null;
    $scope.weatherLocation = "";
    $scope.weatherDescription = "";
    $scope.temperature = 0;
    $scope.wheatherLoading = false;
    $scope.spinnerOptions = {radius:10, width:5, length: 16};

    /**
     * Function for fetching position of the user to get weather
     */
    $scope.setPosition = function (position) {
        $scope.lat = position.coords.latitude;
        $scope.lon = position.coords.longitude;
        $scope.wheatherLoading = true;
        Agenda.Weather.get({'lat':$scope.lat,'lon':$scope.lon},function(data){
            if(data.cod=='400'){
                alert("Invalid request or rate limit exceeded.");
                $scope.wheatherLoading = false;
                return;
            }else if(data.cod=='403'){
                alert("Failed authentication request.");
                $scope.wheatherLoading = false;
                return;
            }else if(data.cod=='404'){
                alert("Request URI invalid.");
                $scope.wheatherLoading = false;
                return;
            }
            else if(data.cod=='500'){
                alert("Server error has occurred.");
                $scope.wheatherLoading = false;
                return;
            }else if(data.cod =='503'){
                alert("Service Unavailable");
                $scope.wheatherLoading = false;
                return;
            }
            $scope.weatherLocation = data.name;
            // Use the appropriate picture
            if(data.weather.length > 0){
                $scope.weatherDescription = data.weather[0].description;
                var weatherStatus = data.weather[0].main;
                if($scope.weatherDescription == "clear sky"){
                    $scope.weatherPic = "weatherimages/clear.png";
                }else if($scope.weatherDescription == "few clouds"){
                    $scope.weatherPic = "weatherimages/fewclouds.png";
                }else if($scope.weatherDescription == "scattered clouds"){
                    $scope.weatherPic = "weatherimages/clouds.png";
                }else if($scope.weatherDescription == "broken clouds"){
                    $scope.weatherPic = "weatherimages/brokenclouds.png";
                }else if($scope.weatherDescription == "shower rain"){
                    $scope.weatherPic = "weatherimages/showerrain.png";
                }else if($scope.weatherDescription == "rain"){
                    $scope.weatherPic = "weatherimages/rain.png";
                }else if($scope.weatherDescription == "thunderstorm"){
                    $scope.weatherPic = "weatherimages/thunderstorm.png";
                }else if($scope.weatherDescription == "snow"){
                    $scope.weatherPic = "weatherimages/snow.png";
                } else if($scope.weatherDescription == "mist"){
                    $scope.weatherPic = "weatherimages/mist.png";
                }else{
                    $scope.weatherPic = "weatherimages/mist.png";
                }
            }
            // Make it celcius
            $scope.temperature = Math.round(data.main.temp - 273);
            console.log($scope.temperature);
            $scope.wheatherLoading = false;
        },function(data){
            // Error function
            if(data.cod=='400'){
                alert("Invalid request or rate limit exceeded.");
            }else if(data.cod=='403'){
                alert("Failed authentication request.");
            }else if(data.cod=='404'){
                alert("Request URI invalid.");
            }
            else if(data.cod=='500'){
                alert("Server error has occurred.");
            }else if(data.cod =='503'){
                alert("Service Unavailable");
            }
        });
    }

    // Do the appropriate thing depending on geolocation
    if (navigator.geolocation) {
        var defaultCallback = function(){
            // The user did not allow position, set default to Stockholm long/lat
            var position = {coords:{}};
            position.coords.latitude =  59.3293;
            position.coords.longitude = 18.0686;
            $scope.setPosition(position);
        }
        navigator.geolocation.getCurrentPosition($scope.setPosition, defaultCallback);

    }


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