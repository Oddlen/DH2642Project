/**
 * A service which holds objects transfered between calendar and agenda
 */
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

    // Initialize
    ms = this;
    ms.meeting = {};
    ms.existingMeeting = true;
    ms.meeting = exampleEventObject;

    /**
     * Get the whole meeting
     */
    ms.getMeeting = function(){
        return ms.meeting;
    }

    /**
     * Set the whole meeting
     */
    ms.setMeeting = function(newmeeting){
        var date = newmeeting.date.split("/");
        var meetingobj = {};
        meetingobj.day = date[0];
        meetingobj.month = date[1];
        meetingobj.year = date[2];
        meetingobj.name = newmeeting.name;
        meetingobj.owner =newmeeting.ownername;
        meetingobj.start = newmeeting.start;
        meetingobj.end = newmeeting.end;
        meetingobj.length = newmeeting.length;
        meetingobj.invited = [];
        meetingobj.agenda = [];
        Object.keys(newmeeting.agenda).forEach(function(key) {
            var val = newmeeting.agenda[key];
            meetingobj.agenda.push(val);
        });
        Object.keys(newmeeting.invitedNames).forEach(function(key) {
            var val = newmeeting.invitedNames.agenda[key];
            meetingobj.invited.push(val);
        });

        ms.meeting = meetingobj;
    }

    /**
     * Sets a boolean telling if the setMeeting is an existing meeting or not
     */
    ms.setExistingMeeting = function(bool){
        ms.existingMeeting = bool;
    }

    /**
     * Get the value of the existingMeeting boolean
     */
    ms.getExistingMeeting = function(){
        return ms.existingMeeting;
    }

    // Returns itself, it is a service
    return ms;
});
