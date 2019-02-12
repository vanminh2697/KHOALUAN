// console.log("HIHI")
// onItemclick()
// function onItemclick(){
// 	console.log("HIHI");
//     chrome.tabs.executeScript(null, { file: 'content.js' });
// }

chrome.runtime.onMessage.addListener(function(message){
	console.log("this is addListener");
	if (message.action == 'submit the form'){
		console.log("HIHI");
		//message should contain the selected text and url - ensure that this is the correct message
		// var url = "data:text/html;charset=utf8,";
		
		// function append(key, value){
		// 	var input = document.createElement('textarea');
		// 	input.setAttribute('name', key);
		// 	input.textContent = value;
		// 	form.appendChild(input);
		// }
		
		// var form = document.createElement('form');
		// form.method = 'POST';
		// form.action = 'http://localhost:5000/';
		// form.style.visibility = "hidden";
		// append('url', message.url);
		// append('text', message.selectedText);
		// url = url + encodeURIComponent(form.outerHTML);
		// url = url + encodeURIComponent('<script>document.forms[0].submit();</script>');
		//chrome.tabs.create({url: url, active: true});
	}
});
var context = "selection";
var title = "Share with Cliptext!";
console.log("this is addListener");
// var id = chrome.contextMenus.create({"title": title, "contexts": [context], "onclick": onItemClick});