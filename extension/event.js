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
			//console.log(url)
			return url.split(new RegExp('/'));
		}
		var className = "a-last";
		
		function getHTML(url){
			return new Promise(function(resolve , reject){
				//console.log(url);
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
	     async function getImageAndName(urlE){
			const url = host + urlE;
    		console.log(url);
    		const output = await getHTML(url);
    		var parser = new DOMParser();
		    var html = parser.parseFromString(output, "text/html");
		    //console.log(html);
		    var name = html.querySelectorAll('h1.a-size-large.a-text-ellipsis')[0].outerText;
		    //var elements = html.getElementsByClassName('a-size-large');
		    //var elements = html.getElementById('main-video-container');
		    chrome.runtime.sendMessage({
				'action': 'haha',
				'data' : name
			})

		}
		getImageAndName(getLink());
	    async function getData(urlE){
	    	if(urlE != null){
	    		
		    	while(className == 'a-last'){
		    		const url = host + urlE;
		    		console.log(url);
		    		const output = await getHTML(url);
		    		var parser = new DOMParser();
				    var html = parser.parseFromString(output, "text/html");
				    //console.log(html);
				    var elements = html.querySelectorAll('span.a-size-base.review-text');
					for(i = 0; i < elements.length; i++){
					    //console.log(elements[i].innerText);
					    comments += elements[i].innerText +"\n";
					}
					if(html.querySelectorAll('li.a-last').length == 0) break;
				    className = html.querySelectorAll('li.a-last')[0].className;
				    if(className == 'a-disabled a-last') break;
				    urlE = html.querySelectorAll('li.a-last')[0].lastChild.getAttribute("href");
				}
				console.log(comments);
				// console.log("complete");
				return comments;
			}else{
				console.log("không tìm thấy sản phẩm");
			}
		}
		function getData2(){
			return new Promise(function (resolve, reject){
				resolve(getData(getLink()).catch(e => reject(e)));
			});
		}
		async function upload(){
			comments = await getData2();
			var req = new XMLHttpRequest();
			req.open('POST', 'http://localhost:5000/', false);
			req.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
			req.send("data=" + comments);
			var text = req.responseText
			console.log(text)
			comments = ""
			chrome.runtime.sendMessage({
				'action': 'hihi',
				'data' : text
			})

		}
		upload()
	}
});
var context = "selection";
var title = "Share with Cliptext!";
var comments = "";
var host = "https://www.amazon.com";
var text = "/product-reviews/";
