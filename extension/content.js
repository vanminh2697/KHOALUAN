
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
			document.getElementById("click").onclick = function(){
				var x = send()
			};
	 	});
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
			var result = [
				{
					aspect: "Keys",
					positive: "50%",
					negative: "10%",
					neutral: "40",
				},
				{
					aspect: "Pin",
					positive: "10%",
					negative: "10%",
					neutral: "100%",
				}
			]
			text = "<tr> <th>Aspect</th> <th>Postive</th> <th>Negative</th> <th>Neutral</th> </tr>"
			for(var i = 0;i<result.length; i++){
				text += "<tr> <td>"+ result[i].aspect+ "<td>" +result[i].positive +" <td>"+ result[i].negative+ "</td> <td>"+ result[i].neutral +"</td> </tr>" ;
			}
			// var k = message.data 
			document.getElementById("result").innerHTML = text;
		}
		// console.log(k)
	});
	console.log(text)
	return text
}
