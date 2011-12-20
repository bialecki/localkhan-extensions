$(function () {
  
  var pathName = location.pathname;

  self.port.emit('find-video', {
    path: pathName
  });

  // Get response and set the video.
  self.on('message', function onMessage(url) {
    
    $('.youtube-video')
      .find('object').replaceWith(function () {
        return $('<video width="800" height="480" controls="controls" />')
          .append($('<source type="video/ogg" />').attr('src', url));
    });

  });

});