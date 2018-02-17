console.log("Log started. Backgroun page running");
var website = {};
var storage = function(){
  website.BlockedList = {
    "facebook.com"  : "Facebook",
    "youtube.com" : "Youtube",
    "twitter.com" : "Twitter",
    "instagram.com" : "Instagram" 
  };
  if(!website.BlockedList){
    chrome.storage.sync.set(website.BlockedList,function(){
      message("BlockedList is set");
    })
  }
}
storage();

website.redirect = {
  "redirect.html" : "Access controlled!"
}

redirect_img_no = 0;
whereYouLeftOff = '';

chrome.tabs.onUpdated.addListener(function(tabId, changedInfo, tab){
  for(site in website.BlockedList){
    if(tab.url.match(site) && (points[tab.url.match(r)[1]] < 0 )){
      chrome.tabs.update(tab.Id, {"url" : Object.keys(website.redirect)[0]},function(){});
      redirect_img_no = sitemap.get(tab.url.match(r)[1]);
    }
  }
  findUrl();
})
chrome.tabs.onActivated.addListener(function (activeInfo){
  findUrl();
});
chrome.tabs.onCreated.addListener(function(tab){
  for(site in website.BlockedList){
    if(tab.url.match(site)){
      chrome.tabs.update(tab.Id, {"url" : Object.keys(website.redirect)[0]},function(){});
    }
  }
})

function updateVal(){
  chrome.runtime.sendMessage(null,{"data":"update"});
}

activeUrl = null;
oldDate = Date.now();
curDate = null;
oldUrl = 'idle';
isFocused = true;
var r = /:\/\/(.[^/]+)/;
sites = ['www.youtube.com', 'www.facebook.com', 'www.instagram.com', 'twitter.com'];
totalData = {};
hourData = {};
findInitialHour = new Date();
hourData.hour = findInitialHour.getHours();
database = {};
points = {};
addPoints = 100000;

sitemap = new Map();
sites.forEach(function(website,i){
  sitemap.set(website, i);
  totalData[website] = {'time' : 0, 'clicks' : 0, 'scroll' : 0};
  hourData[website] = {'time' : 0, 'clicks' : 0, 'scroll' : 0};
  points[website] = addPoints;
});

function syncGet(){
  chrome.storage.local.get(['totalData','hourData','database', 'points'], function(item){
    //console.log(item);
    totalItem = item['totalData'];
    hourItem = item['hourData'];
    databaseItem = item['database'];
    pointsItem = item['points'];
    if(typeof totalItem[sites[0]] != 'undefined'){
      totalData = totalItem;
      console.log(totalData);
    }
    else{
      console.log('Error : Failed to total data');
    }
    if(typeof hourItem[sites[0]] != 'undefined'){
      hourData = hourItem;
    }
    else{
      console.log('Error : Failed to load hourData');
    }
    if(typeof databaseItem != 'undefined'){
      database = databaseItem;
    }
    else{
      console.log('Error : Failed to load database');
    }
    if(typeof pointsItem != 'undefined'){
      points = pointsItem;
    }
    else{
      console.log('Error : Failed to load Points');
    }
  });
}

syncGet();


function hourCheck(){
  date = new Date();
  fl = date.toJSON()
  //Note : Time stamp instructions
  //format for database index is year-month-day-hour
  //year is subtracted by 1900 hence 2018 -> 118
  //month is zero based indexing
  database[date.getYear().toString()+'-'+date.getMonth()+'-'+date.getDate()+'-'+date.getHours()] = JSON.parse(JSON.stringify(hourData));
  chrome.storage.local.set({'database':database},function (){
    console.log('database uploaded 200 OK');
   });
  if(hourData.hour != date.getHours()){
    hourData = {};
    hourData.hour = date.getHours();
    sites.forEach(function(website,i){
      sitemap.set(website, i);
      hourData[website] = {'time' : 0, 'clicks' : 0, 'scroll' : 0};
      points[website] += addPoints;
    });
  }
}

// use this to extract from database
function getFromDatabase(hour, day, month, year){
  date = new Date();
  if(hour == null)
    hour = date.getHours();
  if(day == null)
    day = date.getDate();
  if(month == null)
    month = date.getMonth();
  else
    month = month -1;
  if(year == null)
    year = date.getYear();
  else
    year = year -1900;
  return database[year.toString()+'-'+month+'-'+day+'-'+hour];
}

function getGraphData(){
  var grData = new Array(24);
  for(i=0;i<24;++i){
    grData[i] = [i, 0, 0, 0, 0];
  }
  for(hour in database){
    hour = database[hour]; 
    for(i=0;i<4;++i){
      grData[hour.hour][i+1] += hour[sites[i]].time;
    }
  }
  return grData;
}

function findUrl(){
  chrome.tabs.query({'currentWindow':true, 'active': true}, function(tabs) {
      if(tabs.length == 0 || !isFocused){
        activeUrl = 'idle';
      }
      else{
        activeUrl = tabs[0].url.match(r)[1]; 
      }
      curDate = Date.now();
      if(sitemap.has(activeUrl)){
        totalData[activeUrl].time += curDate - oldDate;
        hourData[activeUrl].time += curDate - oldDate;
        points[activeUrl] -= curDate - oldDate;
      }
      else if(tabs[0].url.match('http')){
        whereYouLeftOff = tabs[0].url;
      }
      oldDate = curDate;
      updateVal();
  });
  date = new Date();
  chrome.storage.local.set({'hourData':hourData, 'totalData':totalData, 'points': points},function (){
    console.log('File uploadd 200 OK');
  });
}

chrome.runtime.onMessage.addListener(function(message, sender){
  console.log('Message received 200 OK');
  givenUrl = sender.url.match(r)[1];
  if(sitemap.has(givenUrl)){
    if(message.data == 'click'){
      totalData[givenUrl].clicks += 1;
      hourData[givenUrl].clicks += 1;
    }
    else if(message.data == 'scroll'){
      totalData[givenUrl].scroll += 1;
      hourData[givenUrl].scroll += 1;
    }
  }
})

function checkBrowserFocus(){
    chrome.windows.getCurrent(function(browser){
      isFocused = browser.focused;
    })
}

setInterval(findUrl,5000);
setInterval(checkBrowserFocus,3000);
setInterval(hourCheck,100000);