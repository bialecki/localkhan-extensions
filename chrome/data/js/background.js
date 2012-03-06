var updateSettings = function (settings) {
  localStorage['settings'] = JSON.stringify(settings);

  updateBrowserActionIcon();

};

var getSettings = function () {
  var settings = localStorage.settings;
  
  if (settings) {
    return JSON.parse(settings);
  } else {
    return {
      active: false,
      videoUrl: ''
    };
  }
};

var updateBrowserActionIcon = function () {
  var settings = getSettings(),
      url = chrome.extension.getURL(settings.active ? 'data/images/pencil-on.png' : 'data/images/pencil-off.png');

  chrome.browserAction.setIcon({ path: url });
};

var findVideoUrl = function (data, callback) {
  
  var request = new XMLHttpRequest(),
      settings = getSettings();

  request.open('GET', settings.videoUrl + '/find/video?path=' + data.path, true);
  request.onreadystatechange = function (oEvent) {
    if (request.readyState === 4) {
      if (request.status === 200) {
        callback(settings.videoUrl + JSON.parse(request.responseText).data.url);
      } else {
        console.log('Error', request.status, request.statusText);
        callback();
      }
    }
  };
  request.send(null);
  
};

updateBrowserActionIcon();

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {

  var settings = getSettings();

  if (sender.tab && request.path) {

    if (settings.active && settings.videoUrl) {
      findVideoUrl(request, function (url) {
        sendResponse({ url: url });
      });
    } else  {
      sendResponse({});
    }

  }

});