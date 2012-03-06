$(function () {
  
  var pathName = location.pathname;

  chrome.extension.sendRequest({ 'path': pathName }, function(response) {
    
    // Only swap out if we got a URL.
    if (response.url) {
      $('.youtube-video')
        .find('object').replaceWith(function () {
          return $('<video width="800" height="480" controls="controls" />')
            .append($('<source type="video/ogg" />').attr('src', response.url));
      });
    }

  });

});