
/**
 * Controlls the weather
 */
agendaApp.controller('WeatherCtrl', function ($scope,$location, Agenda) {
// Weather
    $scope.lat = null;
    $scope.lon = null;
    $scope.weatherLocation = "";
    $scope.weatherDescription = "";
    $scope.temperature = 0;
    $scope.wheatherLoading = false;
    $scope.spinnerOptions = {radius: 10, width: 5, length: 16};

    /**
     * Function for fetching position of the user to get weather
     */
    $scope.setPosition = function (position) {
        $scope.lat = position.coords.latitude;
        $scope.lon = position.coords.longitude;
        $scope.wheatherLoading = true;
        Agenda.Weather.get({'lat': $scope.lat, 'lon': $scope.lon}, function (data) {
            if (data.cod != '200') {
                alert("Weather not available.");
                $scope.wheatherLoading = false;
                return;
            }
            $scope.weatherLocation = data.name;
            var night = false;
            var currtime = new Date();
            if(currtime.getHours()<7 || currtime.getHours()>=20 ){
                night = true;
            }
            // Use the appropriate picture
            if (data.weather.length > 0) {
                $scope.weatherDescription = data.weather[0].description;
                var weatherStatus = data.weather[0].main;
                if ($scope.weatherDescription == "clear sky") {
                    if(night){
                        $scope.weatherPic = "weatherimages/clearnight.png";
                    }else{
                        $scope.weatherPic = "weatherimages/clear.png";
                    }
                } else if ($scope.weatherDescription == "few clouds") {
                    if(night){
                        $scope.weatherPic = "weatherimages/fewcloudsnight.png";
                    }else{
                        $scope.weatherPic = "weatherimages/fewclouds.png";
                    }
                } else if ($scope.weatherDescription == "scattered clouds") {
                    if(night){
                        $scope.weatherPic = "weatherimages/cloudsnight.png";
                    }else{
                        $scope.weatherPic = "weatherimages/clouds.png";
                    }
                } else if ($scope.weatherDescription == "broken clouds") {
                    $scope.weatherPic = "weatherimages/brokenclouds.png";
                } else if ($scope.weatherDescription == "shower rain") {
                    $scope.weatherPic = "weatherimages/showerrain.png";
                } else if ($scope.weatherDescription == "rain") {
                    if(night){
                        $scope.weatherPic = "weatherimages/rainnight.png";
                    }else{
                        $scope.weatherPic = "weatherimages/rain.png";
                    }
                } else if ($scope.weatherDescription == "thunderstorm") {
                    $scope.weatherPic = "weatherimages/thunderstorm.png";
                } else if ($scope.weatherDescription == "snow") {
                    $scope.weatherPic = "weatherimages/snow.png";
                } else if ($scope.weatherDescription == "mist") {
                    $scope.weatherPic = "weatherimages/mist.png";
                } else {
                    $scope.weatherPic = "weatherimages/mist.png";
                }
            }
            // Make it celcius
            $scope.temperature = Math.round(data.main.temp - 273.15);
            console.log($scope.temperature);
            $scope.wheatherLoading = false;
        }, function (data) {
            // Error function
            if (data.cod != '200') {
                alert("Weather not available.");
                $scope.wheatherLoading = false;
                return;
            }
        });
    }

// Do the appropriate thing depending on geolocation
    if (navigator.geolocation) {
        var defaultCallback = function () {
            // The user did not allow position, set default to Stockholm long/lat
            var position = {coords: {}};
            position.coords.latitude = 59.3293;
            position.coords.longitude = 18.0686;
            $scope.setPosition(position);
        }
        navigator.geolocation.getCurrentPosition($scope.setPosition, defaultCallback);

    }
});