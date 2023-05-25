(function() {
  var index = document.currentScript.getAttribute('data-index');
  var email = document.currentScript.getAttribute('data-email');
  var storageAccount = "testwebdbphotos";
  var containerName = "pics";
  var img_url = 'https://'+ storageAccount + '.blob.core.windows.net/' + containerName + '/' + email.split("@")[0] + '.jpg';
  var connector = "?"; 
  var sas = "si=OneWeek&spr=https&sv=2022-11-02&sr=c&sig=69q43gwrC7dDO48JccVxeQrhqy%2Bd8%2FJlCNl6Ob2nMxI%3D";
  var img_url = img_url + connector + sas;


  var img = document.getElementById('img' + index);
  img.addEventListener('error', function() {
    img.src = '/static/images/CSUDHdefault.jpg';
  });

  img.src = img_url;
})();
