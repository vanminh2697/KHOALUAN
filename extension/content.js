
sendMs();
function sendMs() {
	document.getElementById('btnshow').style.visibility='hidden'
	document.getElementById('btn_hidden').style.visibility='hidden'
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
				document.getElementById("imf").innerHTML = "Please waiting..." ;
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
			document.getElementById("imf").innerHTML = "PROCESSING" ;
		}
	});
}
var tableShow = ""
var tableHidden =""
var listAspect =["LAPTOP","DISPLAY","KEYBOARD","MOUSE","CPU","FAN COOLING","PORTS","POWER SUPPLY","OPTICAL DRIVES","GRAPHICS","HARD DISK","MULTIMEDIA DEVICES","SOFTWARE","OS","WARRANTY","SUPPORT","PRICE"]

function isListAspect(name){
	console.log(name)
	for (var i = 0;i<listAspect.length; i++){
		console.log(listAspect[i])
		if(name.localeCompare(listAspect[i]) === 0) {
			console.log(listAspect[i] + " + " + name)
			return true 
		}
	}
	return false
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
				text = "<dt>"+server+"</dt>";
			}
			else{
				var result = JSON.parse(server);
				console.log(result)
				var e = document.getElementById("inputGroupSelect01");
				var lang = e.options[e.selectedIndex].value;
				console.log(lang)
				for(var i = 0;i<result.length; i++){
					x = isListAspect(result[i].aspect)
					if(x === true){
						console.log("lang " + arrLang[lang][result[i].aspect])
						tableShow +="<tr><td " + "class='lang'" +"key ='"+ result[i].aspect+"'>"+arrLang[lang][result[i].aspect]+"<td>"+result[i].POS+"%<td>"+result[i].NEG+"%</td><td>"+result[i].NEU+"%</td><td>"+result[i].Total+"</td></tr>";
					}
					else {
						tableHidden +="<tr><td>"+result[i].aspect+"<td>"+result[i].POS+"%<td>"+result[i].NEG+"%</td><td>"+result[i].NEU+"%</td><td>"+result[i].Total+"</td></tr>";
					}
				}
			}
			document.getElementById('btnshow').style.visibility='visible';
			document.getElementById("show").innerHTML = tableShow ;
			document.getElementById("loader").style.display = "none";
			document.getElementById("imf").innerHTML = "" ;
		}
	});
}
document.getElementById("btnshow").onclick = function(){
	document.getElementById('btnshow').style.visibility='hidden';
	document.getElementById('btn_hidden').style.visibility='visible';
	document.getElementById("show1").innerHTML = tableHidden;
}
document.getElementById("btn_hidden").onclick = function(){
	document.getElementById("show").innerHTML = tableShow ;
	document.getElementById("show1").innerHTML = "" ;
	document.getElementById('btnshow').style.visibility='visible';
	document.getElementById('btn_hidden').style.visibility='hidden';
}
function SortByDePOS(x,y) {
    return y.POS - x.POS; 
}

document.getElementById("de_pos").onclick = function(){
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