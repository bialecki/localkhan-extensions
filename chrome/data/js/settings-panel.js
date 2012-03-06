var backgroundPage = chrome.extension.getBackgroundPage();

$(function () {

  var initialSettings = backgroundPage.getSettings();
  
  $('form input[name="active"]').attr('checked', initialSettings.active);
  $('form input[name="videoUrl"]').val(initialSettings.videoUrl);

  $('form').submit(function (e) {
    
    e.preventDefault();

    var isChecked = $('form input[name="active"]').is(':checked'),
        videoUrl = $('form input[name="videoUrl"]').val();

    backgroundPage.updateSettings({
      active: isChecked,
      videoUrl: videoUrl
    });
    
  });

});