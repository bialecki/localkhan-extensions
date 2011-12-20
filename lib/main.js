var widgets = require('widget');
var data = require('self').data;
var xhr = require('xhr');
var json = require('json');

var swapVideosIsOn = false;

function toggleSwapVideos() {
  swapVideosIsOn = !swapVideosIsOn;
  return swapVideosIsOn;
}

function canSwapVideos() {
  return swapVideosIsOn;
}

exports.main = function() {
 
  var pageMod = require('page-mod');
  pageMod.PageMod({

    include: '*.khanacademy.org',

    contentScriptWhen: 'end',

    contentScriptFile: [
      data.url('jquery-1.4.2.min.js'),
      data.url('swap-videos.js')
    ],

    onAttach: function(worker) {
      worker.port.on('find-video', function (data) {

        var request = new xhr.XMLHttpRequest();
        request.open('GET', 'http://localhost:8080/find/video?path=' + data.path, true);
        request.onreadystatechange = function (oEvent) {
          if (request.readyState === 4) {
            if (request.status === 200) {
              worker.postMessage('http://localhost:8080' + json.parse(request.responseText).data.url);
            } else {
              console.log("Error", request.statusText);
            }
          }
        };
        request.send(null);

      });
    }
  });
 
  var widget = widgets.Widget({
    id: 'toggle-switch',
    label: 'Local Khan',
    contentURL: data.url('pencil-off.png'),
    contentScriptWhen: 'ready',
    contentScriptFile: data.url('widget.js')
  });
 
  widget.port.on('left-click', function() {
    widget.contentURL = toggleSwapVideos() ?
      data.url('pencil-on.png') : data.url('pencil-off.png');
  });
}