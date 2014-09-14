function trangleInterface(canvasSelector,colorPickerSelector){
	var self = this;

	this.points = [];
	this.canvas = $(canvasSelector);
	this.canvasContext = self.canvas[0].getContext('2d');
	this.fillColor = $(colorPickerSelector).val();
	this.error = false;

	if(!self.canvas[0].getContext){
		this.error = true
	}
	console.log($(colorPickerSelector))
	$(colorPickerSelector).change(function(){
		console.log(self.fillColor)
		self.fillColor = $(this).val();
	});

	this.getMouseCordinatesInCanvas = function(event){
		var parentOffset = self.canvas.offset();
   		//or $(this).offset(); if you really just want the current element's offset
   		var relX = event.pageX - parentOffset.left;
   		var relY = event.pageY - parentOffset.top;
   		return { x: relX, y: relY};
	}

	this.drawPoint = function(coordinates){
		if(!self.error){
			self.canvasContext.fillStyle = '#000000';
			self.canvasContext.fillRect(coordinates.x,coordinates.y, 4, 4);
		}
	}
	this.drawLine = function(coordinatesA, coordinatesB){
		if(!self.error){
			self.canvasContext.beginPath();
			self.canvasContext.fillStyle = '#000000';

			self.canvasContext.moveTo(coordinatesA.x,coordinatesA.y);
			self.canvasContext.lineTo(coordinatesB.x, coordinatesB.y);

			self.canvasContext.stroke();
			self.canvasContext.closePath();
		}
	}

	this.drawTriagle = function(coordinatesA, coordinatesB, coordinatesC, fillColor){

		if(!self.error){


			self.canvasContext.beginPath();

    		self.canvasContext.moveTo(coordinatesA.x,coordinatesA.y);
    		self.canvasContext.lineTo(coordinatesB.x,coordinatesB.y);
		    self.canvasContext.lineTo(coordinatesC.x,coordinatesC.y);

		    self.canvasContext.fillStyle = fillColor;
		    self.canvasContext.fill();
		    self.canvasContext.closePath();
		}
	}
	this.drawATriangleWithClicks = function(event){
		var clickCoordinates = self.getMouseCordinatesInCanvas(event),
			numberOfUserClicks = self.points.length;

		if(numberOfUserClicks == 0){
			self.drawPoint(clickCoordinates);
			self.points.push(clickCoordinates);
		}else if(numberOfUserClicks == 1){
			self.drawLine(self.points[0], clickCoordinates);
			self.drawPoint(clickCoordinates);
			self.points.push(clickCoordinates);	
		}else if(numberOfUserClicks == 2){
			self.drawPoint(clickCoordinates);
			self.drawLine(self.points[1],clickCoordinates);
			self.drawLine(clickCoordinates,self.points[0]);

			var selectedColor = $('')
			self.drawTriagle(clickCoordinates,self.points[0],self.points[1] , self.fillColor);
			
			//TODO: save the state of the canvas
			self.points = [];

		}
	}
};




$(document).ready(function(){
	var canvas = $('#canvas');
	//needed for taking real position of the canvas
	$('#canvas').attr('height', $('#canvas').css('height'));
	$('#canvas').attr('width', $('#canvas').css('width'));
	var usersTriangleInreface = new trangleInterface('#canvas','#colorPicker');

	canvas.click(function(e){
		usersTriangleInreface.drawATriangleWithClicks(e);
	});
})