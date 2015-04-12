
function getBitStatus(page) {


  var x = new XMLHttpRequest();
  x.open('GET', "https://severn.me/projects/extension/lookup.php?page=" + page);
  x.responseType = 'json';
  x.onload = function() {
	
	var accepts = false;
  
	var response = x.response;
	for(var i=0; i<response.length; i++)
		if(response[i].txt.substring(0, 4) == "BTC:")
			accepts = true;
	
	var new_icon_path = (accepts) ? "accept_true.png" : "accept_false.png";
	chrome.browserAction.setIcon({path: new_icon_path});	
  };
  x.onerror = function() {
	renderStatus('Connection error :(');
  };
  x.send();
}

setInterval(function() {
	chrome.tabs.getSelected(null, function(tab) {
		getBitStatus(new URL(tab.url).hostname);
	});
}, 1000);