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
