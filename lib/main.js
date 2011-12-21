var widgets = require('widget');
var data = require('self').data;
var xhr = require('xhr');
var panels = require('panel');
var pageMod = require('page-mod');
var simpleStorage = require('simple-storage');

var json = require('json');

if (!simpleStorage.storage.videoUrl) {
  simpleStorage.storage.videoUrl = '';
}

if (!simpleStorage.storage.swapVideosIsOn) {
  simpleStorage.storage.swapVideosIsOn = false;
}

exports.main = function() {

  pageMod.PageMod({

    include: '*.khanacademy.org',
    contentScriptWhen: 'end',
    contentScriptFile: [
      data.url('jquery-1.4.2.min.js'),
      data.url('swap-videos.js')
    ],

    onAttach: function(worker) {

      console.log(simpleStorage.storage.videoUrl, simpleStorage.storage.swapVideosIsOn);
      if (simpleStorage.storage.videoUrl && simpleStorage.storage.swapVideosIsOn) {

        worker.port.on('find-video', function (data) {

          var request = new xhr.XMLHttpRequest();
          console.log(simpleStorage.storage.videoUrl + '/find/video?path=' + data.path);

          request.open('GET', simpleStorage.storage.videoUrl + '/find/video?path=' + data.path, true);
          request.onreadystatechange = function (oEvent) {
            if (request.readyState === 4) {
              if (request.status === 200) {
                worker.postMessage(simpleStorage.storage.videoUrl + json.parse(request.responseText).data.url);
              } else {
                console.log('Error', request.status, request.statusText);
              }
            }
          };
          request.send(null);

        });
      }
    }
  });

  var settingsPanel = panels.Panel({
    width: 420,
    height: 200,
    contentURL: data.url('settings/settings-panel.html'),
    contentScriptFile: [
      data.url('jquery-1.4.2.min.js'),
      data.url('settings/settings-panel.js')
    ],
    contentScriptWhen: 'ready',
    onShow: function() {
      this.postMessage({
        active: simpleStorage.storage.swapVideosIsOn,
        videoUrl: simpleStorage.storage.videoUrl
      });
    }
  });
  
  settingsPanel.port.on('settings-change', function (settings) {

    simpleStorage.storage.videoUrl = settings.videoUrl;
    simpleStorage.storage.swapVideosIsOn = settings.active;

    widget.contentURL = settings.active ?
      data.url('widget/pencil-on.png') : data.url('widget/pencil-off.png');
  });

  var widget = widgets.Widget({
    id: 'toggle-switch',
    label: 'Local Khan Academy settings',
    contentURL: data.url('widget/pencil-off.png'),
    contentScriptWhen: 'ready',
    contentScriptFile: data.url('widget/widget.js'),
    panel: settingsPanel
  });

}