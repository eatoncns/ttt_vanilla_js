window.onhashchange = function() {
  renderCurrentLocation();
}

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
