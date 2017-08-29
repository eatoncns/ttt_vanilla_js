window.onhashchange = function() {
  renderCurrentLocation();
}

renderCurrentLocation();

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
