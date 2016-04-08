agendaApp.factory('MeetingAgenda', function () {

    var exampleAgendaObject1 = {
        name: "Testar med en lång sträng",
        start: "08:25",
        end: "09:00",
        length: "0h35m",
        category: "Introduction",
        description: "This is the introduction" // Observe this field is required
    };

    var exampleAgendaObject2 = {
        name: "Kort sträng",
        start: "09:00",
        end: "10:36",
        length: "1h36m",
        category: "Other",
        description: "This is the other" // Observe this field is required
    };

    var exampleEventObject = {
        day: "01",
        month: "06",
        year: "2016",
        name: "OnlyLetters AndNumbers",
        owner: "Kalle", // Observe this is needed in the db
        start: "08:25",
        end: "10:36",
        length: "2h11m",
        invited: ['Kalle', 'username2', 'username3'],
        agenda: [exampleAgendaObject1, exampleAgendaObject2]
    };

    ms = this;
    ms.meeting = {};
    ms.existingMeeting = true;
    ms.meeting = exampleEventObject;

    ms.getMeeting = function(){
        return ms.meeting;
    }

    ms.setMeeting = function(newmeeting){
        ms.meeting = newmeeting;
    }

    ms.setExistingMeeting = function(bool){
        ms.existingMeeting = bool;
    }

    ms.getExistingMeeting = function(){
        return ms.existingMeeting;
    }

    return ms;
});
