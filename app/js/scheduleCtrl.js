agendaApp.controller('ScheduleCtrl', function ($scope,$sce) {

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


})