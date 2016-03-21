agendaApp.controller('ScheduleCtrl', function ($scope) {

function handleDragStart(e) {
	this.style.opacity = '0.4'; 

	dragSrcEl = this;

	e.dataTransfer.effectAllowed = 'move';
  	e.dataTransfer.setData('text/html', this.innerHTML);
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

function handleDragEnter(e) {
  this.classList.add('over');
}

function handleDragLeave(e) {
  this.classList.remove('over');  
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

var delay=500;
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
  		col.addEventListener('dragenter', handleDragEnter, false);
  		col.addEventListener('dragover', handleDragOver, false);
  		col.addEventListener('dragleave', handleDragLeave, false);
	});
}, delay); 







})