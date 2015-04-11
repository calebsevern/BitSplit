chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
	// read `newIconPath` from request and read `tab.id` from sender
	chrome.browserAction.setIcon({
		path: request.newIconPath,
		tabId: sender.tab.id
	});
});


chrome.tabs.getSelected(null, function(tab) {
    var url = new URL(tab.url).hostname;
	getBitStatus(url);
});


function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}



function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}


function getBitStatus(page) {


  var x = new XMLHttpRequest();
  x.open('GET', "https://severn.me/projects/extension/lookup.php?page=" + page);
  x.responseType = 'json';
  x.onload = function() {
	
	var accepts = false;
  
	var response = x.response;
	for(var i=0; i<response.length; i++) {
		if(response[i].txt.substring(0, 4) == "BTC:") {
			accepts = true;
			new QRCode(document.getElementById("qrcode"), response[i].txt.split("BTC:")[1]);
		}
	}
	
	var new_icon_path = (accepts) ? "accept_true.png" : "accept_false.png";
	chrome.browserAction.setIcon({path: new_icon_path});	
  };
  x.onerror = function() {
	renderStatus('Connection error :(');
  };
  x.send();
}


document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    // Put the image URL in Google search.
   // renderStatus('This website accepts donations.');

	//getBitStatus("severn.me");
	
	
  });
});
