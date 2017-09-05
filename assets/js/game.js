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
}())

var Game = (function() {
  var settings = {
    page: document.querySelector('div.game'),
    boardElement: document.querySelector('div.board'),
    apiURL: 'http://localhost:4567/api/game'
  };

  var me = {};

  function setupBindings() {
    var buttons = settings.boardElement.querySelectorAll('button.btn-cell');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', bindClick(buttons[i]));
    }
  }

  function bindClick(button)
  {
    return function() {
      postAjax(settings.apiURL, {move: button.value}, updateBoard);
    }
  }

  function updateBoard(data) {
    var board = JSON.parse(data);
    if (board.game_over) {
      Result.display(function(winning_spaces) {
        addBoard(board, winning_spaces);
      });
    }
    else {
      addBoard(board);
    }
  }

  function addBoard(board, winning_spaces = []) {
    settings.boardElement.innerHTML = generateBoardHTML(board, winning_spaces)
    setupBindings();
  }

  function generateBoardHTML(board, winning_spaces) {
    var out = '';
    for (row = 0; row < board.dimension; row++) {
      out = out + '<div class="row">';
      for (col = 0; col < board.dimension; col++) {
        out = out + generateCellHTML(board, row, col, winning_spaces);
      }
      out = out + '</div>';
    }
    return out; 
  }

  function generateCellHTML(board, row, col, winning_spaces) {
    index = row*board.dimension + col;
    mark = board.marks[index];
    space = index + 1;
    winningClass = winning_spaces.includes(space) ? "winning-cell" : ""; 
    gameOver = winning_spaces.length > 0;
    disabled = mark || gameOver ? "disabled" : "";
    return ' <button class="btn cell btn-cell ' + winningClass + '" name="move" value="' +
      space + '" ' + disabled + '>' + mark + '</button>';
  }

  me.init = function(board) {
    addBoard(board);
    Result.init();
  }

  me.setVisible = function() {
    setVisible(settings.page);
  }

  me.setInvisible = function() {
    setInvisible(settings.page);
  }

  return me;
}());
