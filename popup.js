var download = function(format){
  chrome.history.search({
    'text': '', 
    'maxResults': 100000, 
    'startTime': 0
  }, function(res){
    window.res = res;
    var text, filename;
    if(format==="csv"){
      filename = "history.csv";
      var keys = Object.keys(res[0]);
      append(keys.join(","));
      var row;
      var i;
      for(i=0; i<res.length; i++){
        row = "";
        for(var j=0; j<keys.length; j++){
          row += JSON.stringify(res[i][keys[j]]);
          if(j !== keys.length-1) row += ",";
        }
        append("\n" + row);
      }
    }else{
      var json = [];
      for(var i=0; i<res.length; i++){
        json.push(res[i]);
      }
    }
    console.log(json);
  });
}

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log("First installation : 200 OK");
        download('json');
    }else if(details.reason == "update"){
      download('json');
        var thisVersion = chrome.runtime.getManifest().version;
        //console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});