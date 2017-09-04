window.onhashchange = function() {
  renderCurrentLocation();
}

setupModeSelectionPage();
renderCurrentLocation();

function setupModeSelectionPage() {
  page = document.querySelector('div.mode-selection');
  button = page.querySelector('input.btn');
  button.addEventListener('click', startGame);
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

function startGame() {
  postAjax('http://localhost:4567/api/new-game', { board_dimension: 3, mode: "hvh"}, function(data) {
    var board = JSON.parse(data);
    addBoard(board);
    window.location.hash = '#game';
  });
}

function addBoard(board) {
  var boardElement = document.querySelector('div.board');
  addBoardHTML(boardElement, board);
  setupBoardButtons(boardElement);
}

function addBoardHTML(boardElement, board) {
  var boardHTML = generateBoardHTML(board);
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
    postAjax('http://localhost:4567/api/game', {move: button.value}, function(data) {
      var board = JSON.parse(data);
      addBoard(board);
    });
  }
}

function generateBoardHTML(board) {
  var out = '';
  for (row = 0; row < board.dimension; row++) {
    out = out + '<div class="row">';
    for (col = 0; col < board.dimension; col++) {
      index = row*board.dimension + col;
      mark = board.marks[index]
      space = index + 1
      out = out + ' <button class="btn cell btn-cell" name="move" value="' +
        space + '">' + mark + '</button>';
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
