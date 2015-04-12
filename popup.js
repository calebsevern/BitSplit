chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
	// read `newIconPath` from request and read `tab.id` from sender
	chrome.browserAction.setIcon({
		path: request.newIconPath,
		tabId: sender.tab.id
	});
});


function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

function showBitcoin() {
	document.getElementById('accepting-none').style.display = 'none';
	document.getElementById('bitcoin-option').style.display = 'block';
}

function showPayPal(email) {
	$("#paypal-link").attr("href", 'https://www.paypal.com/cgi-bin/webscr?business=' + email + '&cmd=_xclick&currency_code=USD&item_name=Donation+via+BitSplit');
	document.getElementById('accepting-none').style.display = 'none';
	$("#show-paypal").show();
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
			$("#btc-wallet").html(response[i].txt.split("BTC:")[1]);
			showBitcoin();
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

function getPayPalStatus(page) {


  var x = new XMLHttpRequest();
  x.open('GET', "https://severn.me/projects/extension/lookup.php?page=" + page);
  x.responseType = 'json';
  x.onload = function() {
	
	var accepts = false;
  
	var response = x.response;
	for(var i=0; i<response.length; i++) {
		if(response[i].txt.substring(0, 6) == "PAYPAL:") {
			accepts = true;
			showPayPal(response[i].txt.split("PAYPAL:")[1]);
		}
	}
	
	if(accepts)
		chrome.browserAction.setIcon({path: "accept_true.png"});	
  };
  x.onerror = function() {
	renderStatus('Connection error :(');
  };
  x.send();
}


/*document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    // Put the image URL in Google search.
   // renderStatus('This website accepts donations.');

	//getBitStatus("severn.me");	
  });
});*/

chrome.tabs.getSelected(null, function(tab) {
	getBitStatus(new URL(tab.url).hostname);
	getPayPalStatus(new URL(tab.url).hostname);
	
	$("#paypal-link").click(function() {
		chrome.tabs.create({url: $(this).attr('href')});
	});
});


document.getElementById('bitcoin').addEventListener('click', function() {
    document.getElementById('qrcode').style.display = "block";
}, false);

