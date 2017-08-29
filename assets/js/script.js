window.onhashchange = function() {
  render(decodeURI(window.location.hash));
}

render(decodeURI(window.location.hash));

function render(url) {
  setPagesInvisible();
}

function setPagesInvisible() {
  pages = document.querySelectorAll('div.page')
  for (i = 0; i < pages.length; i++) {
    addClass(pages[i], 'invisible')
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
