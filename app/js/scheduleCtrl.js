agendaApp.controller('ScheduleCtrl', function ($scope) {

    // For testing, for Mark
    var exampleAgendaObject1 = {
        name:"name1",
        start:"08:25",
        end:"09:00",
        length:"0h35m",
        category:"Introduction",
        description:"This is the introduction" // Observe this field is required
    };
    var exampleAgendaObject2 = {
        name:"name2",
        start:"09:00",
        end:"10:36",
        length:"1h36m",
        category:"Other",
        description:"This is the other" // Observe this field is required
    };

    var exampleAgendaObject3 = {
        name:"name3",
        start:"10:36",
        end:"10:38",
        length:"0h2m",
        category:"Other",
        description:"This is the other" // Observe this field is required
    };


    var exampleAgendaObject4 = {
        name:"name3",
        start:"10:38",
        end:"10:40",
        length:"0h2m",
        category:"Other",
        description:"This is the other" // Observe this field is required
    };

    var exampleAgendaObject5 = {
        name:"name3",
        start:"10:40",
        end:"10:42",
        length:"0h2m",
        category:"Other",
        description:"This is the other" // Observe this field is required
    };

    var exampleAgendaObject6 = {
        name:"name3",
        start:"10:42",
        end:"10:44",
        length:"0h2m",
        category:"Other",
        description:"This is the other" // Observe this field is required
    };

    //$scope.modules = [exampleAgendaObject1, exampleAgendaObject2, exampleAgendaObject3,exampleAgendaObject4, exampleAgendaObject5, exampleAgendaObject6];
    $scope.modules = [exampleAgendaObject1, exampleAgendaObject2, exampleAgendaObject3];
    $scope.logEvent = function(message, event) {
        console.log(message, '(triggered by the following', event.type, 'event)');
        console.log(event);
    };


    $scope.dropCallback = function(event, index, item) {
        console.log(index);
        //$scope.logListEvent('dropped at', event, index, external, type);
    };

    $scope.logListEvent = function(action, event, index, external, type) {
        var message = external ? 'External ' : '';
        message += type + ' element is ' + action + ' position ' + index;
        $scope.logEvent(message, event);
    };

    $scope.onMove = function(index){
        $scope.modules.splice(index, 1);
        // Recalculate the start, end times
        var scheduleStart = "08:00";
        var timeStart = scheduleStart.split(":");
        var hour = +timeStart[0];
        var minute = +timeStart[1];
        var totalLength = 0;

        for(var i = 0; i < $scope.modules.length; i++){
            $scope.modules[i].start = $scope.formattedTime(hour,minute,totalLength);
            var modulehoursAndMins = $scope.modules[i].length.split("h");
            var duration = (+modulehoursAndMins[0]*60) + (+(modulehoursAndMins[1].split("m")[0]));

            totalLength += duration;
            $scope.modules[i].end = $scope.formattedTime(hour,minute,totalLength);
        }
    }

    $scope.formattedTime = function(hour, minute, totalLength){
        var min = totalLength % 60;
        var h = 0;
        var lengthMin = totalLength;
        while(lengthMin>=0){
            lengthMin = lengthMin-60;
            if(lengthMin>=0){
                h++;
            }
        }
        var mins = minute+min;
        if(mins>=60){
            h++;
            mins-60;
        }
        var hours =hour+h;
        var formatTime = (hours<10 ? '0' :'') + hours +":"+(mins<10 ? '0' :'') + mins;


        return formatTime;
    }



});



/*agendaApp.controller('ScheduleCtrl', function ($scope,$sce) {

var myDataRef = new Firebase('https://dh2642.firebaseIO.com/');
var eventRef = myDataRef.child("events");
var agendaArray = [];

testFunction();

function handleDragStart(e) {
	this.style.opacity = '0.4'; 

	dragSrcEl = this;

	e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function testFunction() {
    
    eventRef.child("d01m04y2016").child("eventName1_Mark").child("agenda").on("value",
              function(snapshot) {
              agendaArray = snapshot.val();
              console.log(agendaArray.name1);

              var agendaDivs = "";
              agendaDivs += "<div id='empty'></div>";
              agendaDivs += "<div class='event' draggable='true'>";
              agendaDivs += "<div id='event1'><p class='textWhite'>" +agendaArray.name1.start+ "</p><h4><p class='eventText'>" +agendaArray.name1.catagory+ "</p></h4></div></div>";
              
              agendaDivs += "<div class='event' draggable='true'>";
              agendaDivs += "<div id='event2'><p class='textWhite'>" +agendaArray.name2.start+ "</p><h4><p class='eventText'>" +agendaArray.name2.catagory+ "</p></h4></div></div>";

              agendaDivs += "<div id='addEventButton'><button type='button' id='addButton' class='btn-success'>";
              agendaDivs += "<div class='glyphicon glyphicon-plus iconstyle'></div></button></div>";

              console.log(agendaDivs);

              $scope.listOfEvents = $sce.trustAsHtml(agendaDivs);
              $scope.$apply();

              cols = document.querySelectorAll('.event');
              console.log(cols);
              [].forEach.call(cols, function(col) {
                  col.addEventListener('dragstart', handleDragStart, false);
                  col.addEventListener('dragend', handleDragEnd, false);
                  col.addEventListener('drop', handleDrop, false);
                  col.addEventListener('dragend', handleDragEnd, false);
                  col.addEventListener('dragstart', handleDragStart, false);
                  col.addEventListener('dragover', handleDragOver, false);
              });


    });

    


}

function handleDragEnd(e) { 
	this.style.opacity = '1';
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); 
  }

  e.dataTransfer.dropEffect = 'move';  

  return false;
}

function handleDrop(e) {

  if (e.stopPropagation) {
    e.stopPropagation(); 
  }

  if (dragSrcEl != this) {
    console.log(this.innerHTML.substr(73,6));
    dragSrcEl.innerHTML = this.innerHTML;
    //console.log(dragSrcEl);
    this.innerHTML = e.dataTransfer.getData('text/html');
  }
  return false;
}


})*/