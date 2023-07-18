
document.addEventListener('DOMContentLoaded', function() {
  var pdfFileInput = document.getElementById('pdfFileInput');
  var convertButton = document.getElementById('convertButton');
  var fileName = document.getElementById('fileNameInput');


  pdfFileInput.addEventListener('change', function() {
    var file = pdfFileInput.files[0];
    fileName.value = file.name.split('.')[0] + '.txt';
  });

  convertButton.addEventListener('click', function() {
    var file = pdfFileInput.files[0];
    if (file) {
      var fileReader = new FileReader();
      fileReader.onload = function() {
        var pdfData = new Uint8Array(fileReader.result);

        chrome.runtime.getBackgroundPage(function(backgroundPage) {
          backgroundPage.convertPDFToText(pdfData, fileName.value);
        });
      };
      fileReader.readAsArrayBuffer(file);
    }
  });
});
