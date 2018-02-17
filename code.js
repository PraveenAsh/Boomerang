var background = chrome.extension.getBackgroundPage();
console.log('Background fetched and running...');
function makeCell(data){
	var th = document.createElement('th');
	th.appendChild(document.createTextNode(data));
	return th;
}

function addRow(){
	tr = document.createElement('tr');
	for(i=0;i<arguments.length;++i){
		tr.appendChild(makeCell(arguments[i]));
	}
	return tr;
}


function updateVal(){
	var table = document.getElementById('info');
	table.innerHTML = '';
	table.appendChild(addRow('Domain', 'time(min)', 'points'));
	background.sitemap.forEach(function(value, key, map){
		table.appendChild(addRow(key, Math.floor(background.totalData[key].time/60000),Math.floor(background.points[key]/1000)));
	});
}
chrome.runtime.onMessage.addListener(function(message,sender){
	if(message.data == 'update')
		updateVal();
});

var b1 = document.getElementById('option1');
var b2 = document.getElementById('option2');
var b3 = document.getElementById('option3');
var op1 = document.getElementById('op1');
var op2 = document.getElementById('op2');
var op3 = document.getElementById('op3');

b1.checked = true;
background.addPoints = 100000;
b1.addEventListener("click", function(){
	b1.checked = true;
	console.log('100 per hour');
	background.addPoints = 100000;
	op1.setAttribute("class","btn btn-primary active");
	op2.setAttribute("class","btn btn-primary");
	op3.setAttribute("class","btn btn-primary");
});

b2.addEventListener("click", function(){
	b2.checked = true;
	console.log('200 per hour');
	background.addPoints = 200000;
	op2.setAttribute("class","btn btn-primary active");
	op1.setAttribute("class","btn btn-primary");
	op3.setAttribute("class","btn btn-primary");
});

b3.addEventListener("click", function(){
	b3.checked = true;
	console.log('500 per hour');
	background.addPoints = 500000;
	op3.setAttribute("class","btn btn-primary active");
	op1.setAttribute("class","btn btn-primary");
	op2.setAttribute("class","btn btn-primary");
});