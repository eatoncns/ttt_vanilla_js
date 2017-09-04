window.onhashchange = function() {
  renderCurrentLocation();
}

setupModeSelectionPage();
renderCurrentLocation();

function setupModeSelectionPage() {
  var page = document.querySelector('div.mode-selection');
  var gameOptions = page.querySelector('form.game-options');
  var mode = gameOptions.elements['mode'];
  var board_dimension = gameOptions.elements['board_dimension'];
  var button = page.querySelector('input.btn');
  button.addEventListener('click', bindGameOptions(mode, board_dimension));
}

function bindGameOptions(mode, board_dimension) {
  return function() {
    startGame(mode.value, board_dimension.value)
  }
}

function renderCurrentLocation() {
  render(decodeURI(window.location.hash));
}

function render(url) {
  setPagesInvisible();
  displayPage(url);
}

function setPagesInvisible() {
  pages = document.querySelectorAll('div.page')
  for (i = 0; i < pages.length; i++) {
    addClass(pages[i], 'invisible');
  }
}

function displayPage(url) {
  var pageUrl = url.split('/')[0];
  var map = {
    '': function() {
      setPageVisible('mode-selection');
    },
    '#game' : function() {
      setPageVisible('game')
    }
  };
  if (map[pageUrl]) {
    map[pageUrl]();
  }
}

function setPageVisible(pageClass) {
  page = document.querySelector('div.' + pageClass);
  removeClass(page, 'invisible');
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

function startGame(mode, board_dimension) {
  postAjax('http://localhost:4567/api/new-game', { board_dimension: board_dimension, mode: mode}, function(data) {
    var board = JSON.parse(data);
    addBoard(board);
    window.location.hash = '#game';
  });
}

function addBoard(board, winning_spaces = []) {
  var boardElement = document.querySelector('div.board');
  addBoardHTML(boardElement, board, winning_spaces);
  setupBoardButtons(boardElement);
}

function addBoardHTML(boardElement, board, winning_spaces) {
  var boardHTML = generateBoardHTML(board, winning_spaces);
  boardElement.innerHTML = boardHTML;
}

function setupBoardButtons(boardElement) {
  var buttons = boardElement.querySelectorAll('button.btn-cell');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', bindClick(buttons[i]));
  }
}

function bindClick(button)
{
  return function() {
    postAjax('http://localhost:4567/api/game', {move: button.value}, updateBoard);
  }
}

function updateBoard(data) {
  var board = JSON.parse(data);
  var winning_spaces = [];
  if (board.game_over) {
    postAjax('http://localhost:4567/api/result', {}, function(data) {
      var resultInfo = JSON.parse(data);
      winning_spaces = resultInfo.winning_spaces;
      displayResult(resultInfo);
      addBoard(board, winning_spaces);
    });  
  }
  else {
    addBoard(board, winning_spaces);
  }
}

function displayResult(resultInfo) {
  var resultElement = document.querySelector('div.result');
  setResultMessage(resultElement, resultInfo);
  setupNewGameButton(resultElement);
  setVisible(resultElement); 
}

function setResultMessage(resultElement, resultInfo) {
  var resultMessage = resultInfo.drawn ? "It's a draw!"
                                       : resultInfo.winning_mark + " wins. Congratulations!";
  var messageElement = resultElement.querySelector('p.result-message');
  messageElement.innerHTML = resultMessage;
}

function setupNewGameButton(resultElement) {
  var button = resultElement.querySelector('input.btn');
  button.addEventListener('click', function() {
    setInvisible(resultElement);
    window.location.hash = '';
  });
}

function setVisible(resultElement) {
  removeClass(resultElement, 'invisible');
}

function setInvisible(resultElement) {
  addClass(resultElement, 'invisible');
}

function generateBoardHTML(board, winning_spaces) {
  var out = '';
  for (row = 0; row < board.dimension; row++) {
    out = out + '<div class="row">';
    for (col = 0; col < board.dimension; col++) {
      index = row*board.dimension + col;
      mark = board.marks[index];
      space = index + 1;
      winningClass = winning_spaces.includes(space) ? "winning-cell" : ""; 
      disabled = mark || winning_spaces.length ? "disabled" : "";
      out = out + ' <button class="btn cell btn-cell ' + winningClass + '" name="move" value="' +
        space + '" ' + disabled + '>' + mark + '</button>';
    }
    out = out + '</div>';
  }
  return out; 
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
