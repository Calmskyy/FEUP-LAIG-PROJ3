/**
 * Class that holds all the functions related to the game logic
 * @constructor
 * @param scene blahblah
 */
class Game {
	constructor(scene) {
		this.scene = scene;
	};

	/**
	 * @method apply
	 * Does something
	 */
	apply() {
		return super.apply();
	}

	getPrologRequest(requestString, onSuccess, onError, port)
	{
		var requestPort = port || 8081
		var request = new XMLHttpRequest();
		request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);
		request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
		request.onerror = onError || function(){console.log("Error waiting for response");};
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send();
	}

	makeRequest(request)
	{
		var requestString = request;			
		
		getPrologRequest(requestString, handleReply);
	}

	handleReply(data){
		if(data.target.response != "success" && data.target.response != "goodbye")
			//this.getTurn().update(data.target.response);
		if(data.target.response == "test")
			makeRequest("quit");
	}
};