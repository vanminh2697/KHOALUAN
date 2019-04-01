
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
			getName();
			document.getElementById("click").onclick = function(){
				var x = send()
			};
	 	});
	});
}
function getName(){
	chrome.runtime.onMessage.addListener(function(message){
		if (message.action == 'haha'){
			var server = message.data ;
			console.log(server);
			document.getElementById("nameProduct").innerHTML = server ;
		}
	});
}
function send(){
	var x = chrome.runtime.sendMessage({
		'action': 'submit the form',
		'url': window.location.href,
		'selectedText': 'HIHI THIS IS EXTENSION SUSSESSFULL',
		'tabCurrent' : document.getElementById("url").innerHTML
	});
	var text =  chrome.runtime.onMessage.addListener(function(message){
		if (message.action == 'hihi'){
			var server = message.data ;
			console.log(server)
			if(server == "Can not find reviews from Web page"){
				text = "<dt>" + server+"</dt>"
			}
			else {
				var result = JSON.parse(server)
				text = "<tr> <th>Aspect</th> <th>Postive</th> <th>Negative</th> <th>Neutral</th> </tr>"
				for(var i = 0;i<result.length; i++){
					text += "<tr> <td>"+ result[i].aspect+ "<td>" +result[i].POS +" <td>"+ result[i].NEG+ "</td> <td>"+ result[i].NEU +"</td> </tr>" ;
				}
			}
			document.getElementById("result").innerHTML = text ;
		}
	});
}
