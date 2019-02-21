// console.log("HIHI")
// onItemclick()
// function onItemclick(){
// 	console.log("HIHI");
//     chrome.tabs.executeScript(null, { file: 'content.js' });
// }

chrome.runtime.onMessage.addListener(function(message){
	console.log("this is addListener");
	if (message.action == 'submit the form'){
		function getLink(){
			var url = message.tabCurrent;
			if(url == "") return null;
			var string = regexURL(url);
			return "/"+string[3] + text + string[5];
		}
		function regexURL(url){
			//console.log(url);
			return url.split(new RegExp('/'));
		}
		var className = "a-last";
		
		function getHTML(url){
			return new Promise(function(resolve , reject){
				const http = new XMLHttpRequest();
				http.onreadystatechange = function() {
					if (http.readyState === 4) {
				        if (http.status === 200) {
				        	//console.log(http.response);
				          	resolve(http.response)
				        } else {
				        	//console.log(http.status);
				          	reject(http.status)
				        }
				    }
				};
				http.ontimeout = function(){
					reject('timeout');
				}
				http.open('GET', url, true);
				http.send();
			});
		}
	    async function getData(urlE){
	    	if(urlE != null){
		    	while(className == 'a-last'){
		    		const url = host + urlE;
		    		
		    		const output = await getHTML(url);
		    		var parser = new DOMParser();
				    var html = parser.parseFromString(output, "text/html");
				    //console.log(html);
				    var elements = html.querySelectorAll('span.a-size-base.review-text');
					for(i = 0; i < elements.length; i++){
					    //console.log(elements[i].innerText);
					    comments += elements[i].innerText +"\n";
					}
				    className = html.querySelectorAll('li.a-last')[0].className;
				    if(className == 'a-disabled a-last') break;
				    urlE = html.querySelectorAll('li.a-last')[0].lastChild.getAttribute("href");
					
				}
				console.log(comments);
			}else{
				console.log("không tìm thấy sản phẩm");
			}
			
		}
		getData(getLink()).catch(e => console.log(e));
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
		// append('text', comments);
		// url = url + encodeURIComponent(form.outerHTML);
		// url = url + encodeURIComponent('<script>document.forms[0].submit();</script>');
		// chrome.tabs.create({url: url, active: true});
		
	}
});
var context = "selection";
var title = "Share with Cliptext!";
var comments = "";
var host = "https://www.amazon.com";
var text = "/product-reviews/";
// var id = chrome.contextMenus.create({"title": title, "contexts": [context], "onclick": onItemClick});