
sendMs();

function sendMs() {
	console.log("popup.js > run.js");
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	 	chrome.tabs.sendMessage(tabs[0].id, {greeting:"hello" }, function(response) {
	 		try{
	 			document.getElementById("url").innerHTML = response.farewell;
	 		}catch(e){
	 			alert("vui lòng đời web load....");
	 		}
	   		console.log("this is send message");
			chrome.runtime.sendMessage({
				'action': 'submit the form',
				'url': window.location.href,
				'selectedText': 'HIHI THIS IS EXTENSION SUSSESSFULL',
				'tabCurrent' : document.getElementById("url").innerHTML
			});
	 	});
	});
}
