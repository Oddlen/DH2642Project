/**
 * A service which holds objects transfered between calendar and agenda
 */
agendaApp.factory('MeetingAgenda', function () {

    // Initialize
    ms = this;
    ms.meeting = {};
    ms.existingMeeting = true;
    ms.meeting = {};

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
        console.log(newmeeting);
        var date = newmeeting.date.split("/");
        var meetingobj = {};
        meetingobj.day = date[0];
        meetingobj.month = date[1];
        meetingobj.year = date[2];
        meetingobj.name = newmeeting.name;
        meetingobj.owner =newmeeting.ownerName;
        meetingobj.start = newmeeting.start;
        meetingobj.end = newmeeting.end;
        meetingobj.length = newmeeting.length;
        meetingobj.invited = [];
        meetingobj.agenda = [];
        Object.keys(newmeeting.agenda).forEach(function(key) {
            var val = newmeeting.agenda[key];
            console.log(key);
            console.log(val);
            meetingobj.agenda.push(val);
        });
        Object.keys(newmeeting.invitedNames).forEach(function(key) {
            meetingobj.invited.push(key);
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
