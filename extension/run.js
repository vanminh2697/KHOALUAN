
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
 if (request.greeting == "hello"){
 	console.log(request.greeting);
  	var tabCurrent = window.location.href;
  	sendResponse({farewell: tabCurrent}); 
 }
});

