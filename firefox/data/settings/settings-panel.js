self.on('message', function onMessage(settings) {

  $('form input[name="active"]').attr('checked', settings.active);
  $('form input[name="videoUrl"]').val(settings.videoUrl);

});

$('form').submit(function (e) {
  e.preventDefault();
  
  var isChecked = $('form input[name="active"]').is(':checked'),
      videoUrl = $('form input[name="videoUrl"]').val();
  console.log(isChecked, videoUrl);
  self.port.emit('settings-change', {
    active: isChecked,
    videoUrl: videoUrl
  });
  
});