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
  console.log("dragged");
  //testFunction();
}

function testFunction() {
    //$scope.ingrName = $sce.trustAsHtml(nameString);
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

              console.log(agendaDivs);
              $scope.listOfEvents = $sce.trustAsHtml(agendaDivs);

              var delay=10000;
              var cols = [];

              setTimeout(function(){
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
              }, delay); 

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
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }


  return false;
}









})