(function() {

  var index = document.currentScript.getAttribute('data-index'); //Grabs from the attribute created, data-index, created within the results-table, table. 
  var email = document.currentScript.getAttribute('data-email'); //Grabs from the attribute created, data-email, created within the results-table, table. 
  var storageAccount = "testwebdbphotos"; //Create variable testwebphotos, to parameterize Azure blob URL Directory
  var containerName = "pics"; //Create variable containerName, to parameterize Azure blob image folder Directory.

  //Combine both string parameters to form the imgURL, in addition to the email grabbed (split into username), to index all the following images. 
  var img_url = 'https://'+ storageAccount + '.blob.core.windows.net/' + containerName + '/' + email.split("@")[0] + '.jpg'; 

  //For security measures, Azure link is provided. 
  var connector = "?";  //Parametrize to contacenate with sas URL
  var sas = "si=OneWeek&spr=https&sv=2022-11-02&sr=c&sig=69q43gwrC7dDO48JccVxeQrhqy%2Bd8%2FJlCNl6Ob2nMxI%3D"; //Parameterize sas URL
  var img_url = img_url + connector + sas; //Combine previous img_rul to connect with connector and sas. 


  var img = document.getElementById('img' + index); //Refers to the img object within the table, and index accordlingly. 
  img.addEventListener('error', function() {  //If the image does not exist or creates an error, a default image is shown.
    img.src = '/static/images/CSUDHdefault.jpg'; //The default image path. 
  });

  img.src = img_url; //If there are no errors, the image source (img.src) uses the img_url to display the image. 
})();
