agendaApp.controller('ScheduleCtrl', function ($scope) {

function handleDragStart(e) {
	this.style.opacity = '0.4';  // this / e.target is the source node.
}

function handleDragEnd(e) {
	this.style.opacity = '1';
}

var delay=500; //1 seconds
var cols = [];

setTimeout(function(){
	cols = document.querySelectorAll('.event');
	console.log(cols);
	[].forEach.call(cols, function(col) {
  		col.addEventListener('dragstart', handleDragStart, false);
		col.addEventListener('dragend', handleDragEnd, false);
	});
}, delay); 





})