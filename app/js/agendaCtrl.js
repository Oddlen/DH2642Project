agendaApp.controller('AgendaCtrl', function ($scope) {

    $scope.types = [{
        value: 'intro',
        label: 'Intro'
    }, {
        value: 'outro',
        label: 'Outro'
    }];

    $scope.confirmagenda ="Confirm agenda"
    $scope.confirmediting ="Confirm editing"
    $scope.invitedheadline ="Invited"
    $scope.titlestring ="Title:"
    $scope.durationstring ="Duration:"
    $scope.categorystring ="Category:"
    $scope.descriptionstring ="Description:"

    $scope.inviting ="Enter user to invite"
    $scope.meetingname ="Enter meeting name"
    $scope.date ="Date"
    $scope.starttime ="Starting Time"
})