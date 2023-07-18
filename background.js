// Carregar a biblioteca pdf.js
var script = document.createElement('script');
script.src = 'pdf.js'; // Insira o caminho correto para o arquivo pdf.js
document.head.appendChild(script);

// // Função para converter PDF em texto
// function convertPDFToText(pdfData) {
//   // Usar o pdfjsLib após o carregamento da biblioteca
//   script.onload = function() {
//     pdfjsLib.getDocument(pdfData).promise.then(function(pdf) {
//       // Restante do código para converter o PDF em texto...
//     }).catch(function(error) {
//       console.error('Erro ao carregar o PDF:', error);
//     });
//   };
// }


function convertPDFToText(pdfData, fileName) {
  pdfjsLib.getDocument(pdfData).promise.then(function(pdf) {
    var numPages = pdf.numPages;
    var textContentPromises = [];

    for (var i = 1; i <= numPages; i++) {
      textContentPromises.push(pdf.getPage(i).then(function(page) {
        return page.getTextContent();
      }));
    }

    Promise.all(textContentPromises).then(function(textContents) {
      var text = '';

      textContents.forEach(function(textContent, index) {
        textContent.items.forEach(function(item) {
          text += item.str + ' ';
        });

        if (index < textContents.length - 1) {
          text += '\n\n'; // Adiciona quebra de linha após cada página, exceto a última
        }
      });

      var blob = new Blob([text], { type: 'text/plain' });
      var url = URL.createObjectURL(blob);

      chrome.downloads.download({
        url: url,
        filename: fileName,
        saveAs: true
      });
    });
  });
}



chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'convertPDFToText') {
    getActiveTab()
    convertPDFToText(request.pdfData);
  }
});
