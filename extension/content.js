
sendMs()
function sendMs(){
	console.log("this is send message")
	chrome.runtime.sendMessage({
		'action': 'submit the form',
		'url': window.location.href,
		'selectedText': 'HIHI THIS IS EXTENSION SUSSESSFULL'
	});
}
