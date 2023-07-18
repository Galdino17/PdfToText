function getActiveTab(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var activeTab = tabs[0];
    callback(activeTab);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var pdfFileInput = document.getElementById('pdfFileInput');
  var convertButton = document.getElementById('convertButton');
  var fileName = document.getElementById('fileNameInput');

  getActiveTab(function(tab) {
    if (tab.url.toLowerCase().endsWith('.pdf')) {
      // alert(tab.url)
      // pdfFileInput.value = tab.url;
      // fileName.value = tab.url + '.txt';
    }
  });

  pdfFileInput.addEventListener('change', function() {
    var file = pdfFileInput.files[0];
    fileName.value = file.name.split('.')[0] + '.txt';
  });

  convertButton.addEventListener('click', function() {
    var file = pdfFileInput.files[0];
    alert(pdfFileInput.value)
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
