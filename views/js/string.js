	function createString() {
		var hash;
		var firstWord = randomWord();
		var secondWord = randomWord();
		var number = Math.floor(Math.random()*999)+1;

		hash = firstWord + number + secondWord;
		return hash.toString();
	} 

	function randomWord(){
		var words = ["Apple", "Apricot", "Avocado", "Banana", "Blackberry", "Blueberry", "Cherry", "Grapefruit", "Lemon", "Lime",
		"Coconut","Kiwi","Peach","Pear","Pineapple","Melon","Watermelon","Raspberry","Strawberry","Hanger",
		"Grape","Plum","London","Dublin","Moscow","Berlin","Madrid","Paris","Stockholm","Vienna",
		"Chair","Texas","California","Nevada","Florida","Montana","Bravo","Delta","Echo","Hotel",
		"Tango","Whiskey","Foxtrot","Golf","Zulu","Yankee","Magnet","Button","Watch","Red",
		"White","Green","Black","Yellow","Grey","Blue","Pink","Purple","Diary","Bottle",
		"Water","Fire","Wind","Sweet","Sugar","Stamp","Brush","Small","Medium","Large",
		"Brown","Piano","Guitar","Canvas","Carrot","Mouse","Dog","Cat","Squirrel","Truck",
		"Rabbit","Toothbrush","Chalk","Puddle","Elephant","Giraffe","Frog","Falcon","Eagle","Parrot",
		"Shark","Tiger","Butterfly","Turtle","Snake","Fish","Whale","Walrus","Kangaroo","Wolverine"];
		return words[(Math.floor(Math.random()*100)+0)];
	}