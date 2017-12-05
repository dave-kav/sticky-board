$(document).ready(function() {
	var loadStickies = true;

	$('.stackAll').css({marginTop: '-=150px'});

	function getSessionID() {
		var page = window.location;
	    var array = page.pathname.split('/');
	    var sessionId;
	    sessionId = array[1];
	    return sessionId;
	}

	var sessionID = getSessionID();
	//initialize draggable stickies
	makeDraggable();

	//socket.io connection for 'chat' functionality
	var socket = io("https://sticky-board-app.herokuapp.com:3000/");
	socket.emit("join", sessionID);

	//display sticky info received from server
	function receiveMessages() {
		socket.on('dev broadcast', function(msg){
			addSticky(msg, 'dev')			
		});
		socket.on('auto broadcast', function(msg){
			addSticky(msg, 'auto')		
		});
		socket.on('qa broadcast', function(msg){
			addSticky(msg, 'qa')			
		});

		//display stickies on reload
		// socket.on('sticky load', function(msg){
		// 	if (loadStickies) {
		// 		var types = ['dev', 'auto', 'qa']
		// 		for (var i = 0; i < types.length;i++) {
		// 			var stickies = msg[0][types[i]]
		// 			for (var j = 0; j < stickies.length; j++) {
		// 				addSticky(stickies[j], types[i]);
		// 			}
		// 		}
		// 		//prevent addional loads for other clients
		// 		loadStickies = false;
		// 	}			
		// });
	} 

	//init receive
	receiveMessages();

	//send sticky message to serevr
	$('#button-1').on('click', function(){
		//prevent default submit action
		event.preventDefault();

		//grab text to place in sticky div
		var stickyContent = $('#inlineFormInputName2').val();

		//whether sticky is dev/auto/qa
		var taskType = $('#task_type').val();

		//prevent empty input, clear textbox after sticky addition
		if ($('#inlineFormInputName2').val() == "")
			alert("Sorry, but I can't just add empty stickies all willy nilly you know!")
		else {
			socket.emit(taskType, sessionID + ":" + stickyContent);
			//clear input	
			$('#inlineFormInputName2').val("");	      
		}
	});

	//for deletable stickies
	$('#trash').droppable({
		over: function(event, ui) {
			ui.draggable.remove();
		}
	});

	 //add new sticky with text and color dependant upon user input
	 function addSticky(stickyContent, taskType) {
	 	var divTest = document.getElementById('addon');

 		//determine which new color sticky should
 		var stickySpecs = getStickySpecs(taskType);
 		
 		//add sticky in correct color/column
 		var newDiv = divTest.querySelector(stickySpecs[0]).appendChild(divTest.querySelector(stickySpecs[1]).cloneNode(true));
 		newDiv.innerText = stickyContent;
 		$(newDiv).toggleClass('invisible float-left space');

		//make newly created element draggable
		makeDraggable();
	}

	//helper function to resolve sticky colors & columns
	function getStickySpecs(taskType) {
		switch(taskType) {
			case "dev":  return ["#dev-col", ".stackDEV"];   break;
			case "auto": return ["#auto-col", ".stackAUTO"]; break;
			case "qa": 	 return ["#qa-col", ".stackQA"]; 	 break;
		}
	}

	//enable dragability on stickies
	function makeDraggable() {
		$(".stackDEV").draggable();
		$(".stackAUTO").draggable();
		$(".stackQA").draggable();
	}
});