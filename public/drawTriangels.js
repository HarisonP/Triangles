function trangleInterface(canvasSelector, userInterface,colorPickerSelector, clearButtonSelector,saveInterface){
	var self = this;

	this.points = [];
	this.canvas = $(canvasSelector);
	this.canvasContext = self.canvas[0].getContext('2d');
	this.fillColor = $(colorPickerSelector).val();
	this.error = false;
	this.clearButton = $(clearButtonSelector);

	if(!self.canvas[0].getContext){
		this.error = true
	}

	if(userInterface){
		self.canvas.click(function(e){
			self.drawATriangleWithClicks(e)
		});
	}

	$(colorPickerSelector).change(function(){
		self.fillColor = $(this).val();
	});

	this.clearButton.click(function(){
		self.clearCanvas();
		saveInterface.clearState();
	});

	this.clearCanvas  = function(){
		self.canvas.attr('width',self.canvas.attr('width'));
	}

	this.getMouseCordinatesInCanvas = function(event){
		var parentOffset = self.canvas.offset();
   		//or $(this).offset(); if you really just want the current element's offset
   		var relX = event.pageX - parentOffset.left;
   		var relY = event.pageY - parentOffset.top;
   		return {x: relX, y: relY};
	};
	this.drawPoint = function(coordinates){
		if(!self.error){
			self.canvasContext.fillStyle = '#000000';
			self.canvasContext.fillRect(coordinates.x,coordinates.y, 4, 4);
		}
	};
	this.drawLine = function(coordinatesA, coordinatesB){
		if(!self.error){
			self.canvasContext.beginPath();
			self.canvasContext.fillStyle = '#000000';

			self.canvasContext.moveTo(coordinatesA.x,coordinatesA.y);
			self.canvasContext.lineTo(coordinatesB.x, coordinatesB.y);

			self.canvasContext.stroke();
			self.canvasContext.closePath();
		}
	};
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
	};
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

			self.drawTriagle(clickCoordinates,self.points[0],self.points[1] , self.fillColor);
			
			self.points.push(clickCoordinates);
			saveInterface.saveTriangle(self.points,self.fillColor);
			
			self.points = [];

		}
	};
};

function stateSaveLoadInterface(uploadButtonSelector, nameFieldSelector, loadMenuSelector, loadStateButtonSelector){
	var state = [],
		self = this;
	function sortSelectMenu(menu){
		var options = menu.find('option');
		
		options.sort(
			function(a, b) {
			    var compA = $(a).text().trim().toUpperCase();
			    var compB = $(b).text().trim().toUpperCase();
			    return compA.localeCompare(compB);
		 	});

		menu.find('option').remove();
		menu.append(options);
	}

	this.uploadButton = $(uploadButtonSelector);
	this.nameField = $(nameFieldSelector);
	this.statesInfo = {};
	this.loadMenu = $(loadMenuSelector);
	this.loadStateButton = $(loadStateButtonSelector);

	this.uploadButton.click(function(){	
		self.uploadState();
	});

	this.loadStateButton.click(function(){
		self.loadState();
	});

	this.saveTriangle = function(coordinates,color){
		var triagnle = {pointA:[], pointB:[],pointC:[], color:''};
		triagnle.pointA = coordinates[0];
		triagnle.pointB = coordinates[1];
		triagnle.pointC = coordinates[2];
		triagnle.color = color;

		state.push(triagnle);
	}
	this.clearState = function(){
		triagnle = {pointA:[], pointB:[],pointC:[]},
		state = [];
	}
	this.uploadState = function(){
		$.post('/saveCanvas',{name:self.nameField.val(),state:JSON.stringify(state)},
			function(response){
				if(response.success){
					$('.ui-dialog-titlebar-close').click();
					var option = '<option value=' + response.newState._id + '>' + 
								  response.newState.title + '</option>';
					
					self.loadMenu.append(option);
					sortSelectMenu(self.loadMenu);
					self.loadMenu.trigger('chosen:updated');
					self.statesInfo[response.newState._id] = response.newState.state;
				}
			}
		);
	}
	this.loadState = function(){
		var id = self.loadMenu.val();
		var loadTriangleInreface = new trangleInterface('#canvas',false,'','','');
		loadTriangleInreface.clearCanvas();
		self.clearState();
		$.each(self.statesInfo[id],function(index){
			
			loadTriangleInreface.drawPoint(this.pointA);
			loadTriangleInreface.drawPoint(this.pointB);
			loadTriangleInreface.drawPoint(this.pointC);

			loadTriangleInreface.drawLine(this.pointA,this.pointB);
			loadTriangleInreface.drawLine(this.pointB,this.pointC);
			loadTriangleInreface.drawLine(this.pointC,this.pointA);

			loadTriangleInreface.drawTriagle(this.pointA,this.pointB, this.pointC,this.color);
			self.saveTriangle([this.pointA,this.pointB,this.pointC],this.color);
		});
		delete loadTriangleInreface;
	}
}




$(document).ready(function(){
	var canvas = $('#canvas');
	//needed for taking real position of the canvas
	$('#canvas').attr('height', $('#canvas').css('height'));
	$('#canvas').attr('width', $('#canvas').css('width'));

	var localStateSaveLoadInterface = new stateSaveLoadInterface('#uploadState', '#canvasName','#selectCanvasForLoading','#loadCanvas');
	var usersTriangleInreface = new trangleInterface('#canvas',true,'#colorPicker','#clearButtons',localStateSaveLoadInterface);
	
	localStateSaveLoadInterface.statesInfo = statesInfo;
});