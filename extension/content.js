
sendMs();
function sendMs() {
	console.log("popup.js > run.js");
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	 	chrome.tabs.sendMessage(tabs[0].id, {greeting:"hello" }, function(response) {
	 		try{
	 			document.getElementById("url").innerHTML = response.farewell;
	 		}catch(e){
	 			alert("vui lòng đợi web load....");
	 		}
	   		console.log("this is send message");
			getName();
			document.getElementById("click").onclick = function(){
				document.getElementById("loader").style.display = "block";
				document.getElementById("imf").innerHTML = "getting data............" ;
				var x = send()
			};
			getT();
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
function getT(){
	chrome.runtime.onMessage.addListener(function(message){
		if (message.action == 'hehe'){
			document.getElementById("imf").innerHTML = "processing............" ;
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
			console.log(message.action)
			console.log(server)
			if(server == "Can not find reviews from Web page"){
				text = "<dt>" + server+"</dt>";
			}
			else{			
				var result = JSON.parse(server);
				result.sort(SortByDePOS);
				// document.getElementById("tong").innerHTML =  "Tong sô khia canh "+  result.length
				text = "<tr> <th>Aspect</th> <th>Postive</th> <th>Negative</th> <th>Neutral</th> </tr>"
				for(var i = 0;i<result.length; i++){
					text += "<tr> <td>"+ "laptop#"  + result[i].aspect+ "<td>" +result[i].POS +"%<td>"+ result[i].NEG+ "%</td> <td>"+ result[i].NEU +"%</td> </tr>" ;
				}
			}
			document.getElementById("result").innerHTML = text ;
			document.getElementById("loader").style.display = "none";
			document.getElementById("imf").innerHTML = "" ;
		}
	});
}
function SortByDePOS(x,y) {
    return y.POS - x.POS; 
}

document.getElementById("de_pos").onclick = function(){
//function funcDePos(){
	var table = document.getElementById("result");
	var i, j, rows;
	rows = table.rows;
	for(i = 1; i < rows.length - 1; i++){
		for(j = i + 1; j < rows.length; j++){
			x = rows[i].getElementsByTagName("TD")[1];
			y = rows[j].getElementsByTagName("TD")[1];
			if (Number(x.innerHTML.substring(0,x.innerHTML.length-1)) > Number(y.innerHTML.substring(0,y.innerHTML.length-1))){
				rows[i].parentNode.insertBefore(rows[j],rows[i]);
			}
		}
	}

}
document.getElementById("de_neu").onclick = function(){
//function funcDeNeu(){
	var table = document.getElementById("result");
	var i, j, rows;
	rows = table.rows;
	for(i = 1; i < rows.length - 1; i++){
		for(j = i + 1; j < rows.length; j++){
			x = rows[i].getElementsByTagName("TD")[3];
			y = rows[j].getElementsByTagName("TD")[3];
			if (Number(x.innerHTML.substring(0,x.innerHTML.length-1)) > Number(y.innerHTML.substring(0,y.innerHTML.length-1))){
	        	rows[i].parentNode.insertBefore(rows[j],rows[i]);
	      	}
		}
	}
}
//function funcDeNeg(){
document.getElementById("de_neg").onclick = function(){
	var table = document.getElementById("result");
	var i, j, rows;
	rows = table.rows;
	for(i = 1; i < rows.length - 1; i++){
		for(j = i + 1; j < rows.length; j++){
			x = rows[i].getElementsByTagName("TD")[2];
			y = rows[j].getElementsByTagName("TD")[2];
			if (Number(x.innerHTML.substring(0,x.innerHTML.length-1)) > Number(y.innerHTML.substring(0,y.innerHTML.length-1))){
	        	rows[i].parentNode.insertBefore(rows[j],rows[i]);
	      	}
		}
	}
}
//function funcInPos(){
document.getElementById("in_pos").onclick = function(){
	var table = document.getElementById("result");
	var i, j, rows;
	rows = table.rows;
	for(i = 1; i < rows.length - 1; i++){
		for(j = i + 1; j < rows.length; j++){
			x = rows[i].getElementsByTagName("TD")[1];
			y = rows[j].getElementsByTagName("TD")[1];
			if (Number(x.innerHTML.substring(0,x.innerHTML.length-1)) < Number(y.innerHTML.substring(0,y.innerHTML.length-1))){
	        	rows[i].parentNode.insertBefore(rows[j],rows[i]);
	      	}
		}
	}
}
//function funcInNeu(){
document.getElementById("in_neu").onclick = function(){
	var table = document.getElementById("result");
	var i, j, rows;
	rows = table.rows;
	for(i = 1; i < rows.length - 1; i++){
		for(j = i + 1; j < rows.length; j++){
			x = rows[i].getElementsByTagName("TD")[3];
			y = rows[j].getElementsByTagName("TD")[3];
			if (Number(x.innerHTML.substring(0,x.innerHTML.length-1)) < Number(y.innerHTML.substring(0,y.innerHTML.length-1))){
	        	rows[i].parentNode.insertBefore(rows[j],rows[i]);
	      	}
		}
	}
}
//function funcInNeg(){
document.getElementById("in_neg").onclick = function(){
	var table = document.getElementById("result");
	var i, j, rows;
	rows = table.rows;
	for(i = 1; i < rows.length - 1; i++){
		for(j = i + 1; j < rows.length; j++){
			x = rows[i].getElementsByTagName("TD")[2];
			y = rows[j].getElementsByTagName("TD")[2];
			if (Number(x.innerHTML.substring(0,x.innerHTML.length-1)) < Number(y.innerHTML.substring(0,y.innerHTML.length-1))){
	        	rows[i].parentNode.insertBefore(rows[j],rows[i]);
	      	}
		}
	}
}
//function Search(){
document.getElementById("input").onkeyup = function(){
	var input, filter, table, rows, name, i, txtValue;
	input = document.getElementById("input");
	filter = input.value.toUpperCase();
	table = document.getElementById("result");
	rows = table.rows;
	for (i = 0; i < rows.length; i++) {
	    name = rows[i].getElementsByTagName("td")[0];
	    if (name) {
	      	txtValue = name.textContent || name.innerText;
	      	if (txtValue.toUpperCase().indexOf(filter) > -1) {
	        	rows[i].style.display = "";
	      	} else {
	        	rows[i].style.display = "none";
	      	}
	    }       
	}
}