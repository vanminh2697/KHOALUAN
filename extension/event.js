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
		console.log(message.tabCurrent);
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
		function getLink(){
			var url = message.tabCurrent;
			var string = regexURL(url);
			//console.log(string);
			return "/"+string[3] + text + string[5];
		}
		//console.log(getLink());
		function regexURL(url){
			return url.split(new RegExp('/'));
		}
		var className = "a-last";
		var urlCurrent = host + getLink();
		
		function getData(urlE){
			//while(className == "a-last"){

				//var url = host + urlE;
				
				setInterval(function(){
				    urlCurrent = host + urlE;
				    console.log(urlCurrent);

				}, 3000);
				//console.log(url);
				//console.time();
				
				//console.log("here");
				var http = new XMLHttpRequest();
				http.open('GET', urlCurrent, true);
				http.send();
				http.onreadystatechange = function() {
				    if (this.readyState == 4 && this.status == 200) {
				     //console.timeEnd();
				      var output = this.response;
				      var parser = new DOMParser();
				      var html = parser.parseFromString(output, "text/html");
				      //var elements = html.querySelectorAll('div#cm_cr-pagination_bar');//.getAttribute("href");
				      urlE = html.querySelectorAll('li.a-last')[0].lastChild.getAttribute("href");
				      //a-disabled a-last

				      className = html.querySelectorAll('li.a-last')[0].className;
				      console.log(urlE);
				      //var elements = html.querySelectorAll('span.a-size-base.review-text');
				      //for(i = 0; i < elements.length; i++){
				      	//console.log(elements[i].innerText);
				      //}
				    }
				};
				
				//console.log("here");
			//}
		}
		getData(getLink());
	}
});
var context = "selection";
var title = "Share with Cliptext!";
var comments = "";
var host = "https://www.amazon.com";
var text = "/product-reviews/";
var text_1 = "/ref=cm_cr_arp_d_paging_btm_";
var text_2 = "?ie=UTF8&reviewerType=all_reviews&pageNumber=";
console.log("this is addListener");
// var id = chrome.contextMenus.create({"title": title, "contexts": [context], "onclick": onItemClick});