var icon = document.getElementById('top_icon');
var background = chrome.extension.getBackgroundPage();
images = ['youtube', 'facebook', 'instagram', 'twitter'];
icon.src = "./images/"+images[background.redirect_img_no]+".png"

var headding = document.getElementById('comment');
headding.textContent = images[background.redirect_img_no]+" access denied due to low points";
var h = document.getElementById('comment2');
h.textContent =  "Boomeranged site : "+background.whereYouLeftOff.match(background.r)[1];
