window.onhashchange = function() {
  renderCurrentLocation();
}

boardTemplate = compileBoardTemplate();
setupModeSelectionPage();
renderCurrentLocation();

function compileBoardTemplate() {
  source = document.getElementById('board-template').innerHTML;
  return Handlebars.compile(source);
}

function setupModeSelectionPage() {
  page = document.querySelector('div.mode-selection');
  button = page.querySelector('input.btn');
  button.addEventListener('click', startGame);
}

function startGame() {
  window.location.hash = '#game';
  addBoard({dimension: 3, marks: ['', '', '', '', '', '', '', '', '']});
}

function addBoard(board) {
  var page = document.querySelector('div.game');
  var boardElement = boardTemplate(board);
  page.innerHTML = boardElement;
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

Handlebars.registerHelper('board', function() {
  var out = '<form>';
  for (row = 0; row < this.dimension; row++) {
    out = out + '<div class="row">';
    for (col = 0; col < this.dimension; col++) {
      index = row*this.dimension + col;
      mark = this.marks[index]
      space = index + 1
      out = out + '<button class="btn cell btn-cell" type="submit" name="move" value=' +
                  space + '">' + mark + '</button>';
    }
    out = out + '</div>';
  }
  out + '</form>';
  return new Handlebars.SafeString(out);
});
