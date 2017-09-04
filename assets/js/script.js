window.onhashchange = function() {
  renderCurrentLocation();
}

var Game = (function() {
  var settings = {
    page: document.querySelector('div.game'),
    boardElement: document.querySelector('div.board'),
    resultElement: document.querySelector('div.result'),
    apiURL: 'http://localhost:4567/api'
  };

  var me = {};

  function setupBindings() {
    setupBoardButtons();
    setupNewGameButton();
  }

  function setupNewGameButton() {
    var button = settings.resultElement.querySelector('input.btn');
    button.addEventListener('click', function() {
      setInvisible(settings.resultElement);
      window.location.hash = '';
    });
  }
  
  function setupBoardButtons() {
    var buttons = settings.boardElement.querySelectorAll('button.btn-cell');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', bindClick(buttons[i]));
    }
  }

  function bindClick(button)
  {
    return function() {
      postAjax(settings.apiURL + '/game', {move: button.value}, updateBoard);
    }
  }

  function updateBoard(data) {
    var board = JSON.parse(data);
    var winning_spaces = [];
    if (board.game_over) {
      getAndDisplayResultInfo(board);
    }
    else {
      addBoard(board, winning_spaces);
    }
  }

  function getAndDisplayResultInfo(board) {
    postAjax(settings.apiURL + '/result', {}, function(data) {
      var resultInfo = JSON.parse(data);
      var winning_spaces = resultInfo.winning_spaces;
      displayResult(resultInfo);
      addBoard(board, winning_spaces);
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
  }

  function setVisible(element) {
    removeClass(element, 'invisible');
  }

  function setInvisible(element) {
    addClass(element, 'invisible');
  }

  me.setVisible = function() {
    setVisible(settings.page);
  }

  me.setInvisible = function() {
    setInvisible(settings.page);
  }

  return me;
}());


GameOptions.init();
renderCurrentLocation();


function renderCurrentLocation() {
  render(decodeURI(window.location.hash));
}

function render(url) {
  setPagesInvisible();
  displayPage(url);
}

function setPagesInvisible() {
  GameOptions.setInvisible();
  Game.setInvisible();
}

function displayPage(url) {
  var pageUrl = url.split('/')[0];
  var map = {
    '': function() {
      GameOptions.setVisible();
    },
    '#game' : function() {
      Game.setVisible();
    }
  };
  if (map[pageUrl]) {
    map[pageUrl]();
  }
}

function hasClass(element, className) {
  element.classList ? element.classList.contains(className) 
    : new RegExp('\\b' + className + '\\b').test(element.className);
}

function addClass(element, className) {
  if (element.classList) {
    element.classList.add(className);
  }
  else if (!hasClass(element, className)) {
    element.className += ' ' + className;
  }
}

function removeClass(element, className) {
  if (element.classList) {
    element.classList.remove(className);
  }
  else {
    classNameRegExp = new RegExp('\\b' + className + '\\b', 'g');
    element.className = element.className.replace(classNameRegExp, '');
  }
}

function postAjax(url, data, success) {
  var params = Object.keys(data).map(
    function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])  }
  ).join('&');

  var xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText);  }

  };
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(params);
  return xhr;
}
