var Result = (function() {
  var settings = {
    resultElement: document.querySelector('div.result'),
    apiURL: 'http://localhost:4567/api/result'
  };

  var me = {};

  function setupBindings() {
    var button = settings.resultElement.querySelector('input.btn');
    button.addEventListener('click', function() {
      setInvisible(settings.resultElement);
      window.location.hash = '';
    });
  }

  function displayResult(resultInfo) {
    setResultMessage(resultInfo);
    setVisible(settings.resultElement); 
  }

  function setResultMessage(resultInfo) {
    var resultMessage = resultInfo.drawn ? "It's a draw!"
                                         : resultInfo.winning_mark + " wins. Congratulations!";
    var messageElement = settings.resultElement.querySelector('p.result-message');
    messageElement.innerHTML = resultMessage;
  }

  me.init = function() {
    setupBindings();
  }

  me.display = function(updateWinningSpaces) {
    postAjax(settings.apiURL, {}, function(data) {
      var resultInfo = JSON.parse(data);
      var winning_spaces = resultInfo.winning_spaces;
      displayResult(resultInfo);
      updateWinningSpaces(winning_spaces);
    });  
  }

  return me;
}());
