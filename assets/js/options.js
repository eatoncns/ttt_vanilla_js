var GameOptions = (function() {
  var settings = {
    page: document.querySelector('div.mode-selection'),
    gameOptions: document.querySelector('form.game-options'),
    button: document.querySelector('input.new-game')
  };
  
  var me = {};

  function setupBindings() {
    settings.button.addEventListener('click', startGame);
  }

  function startGame() {
    var mode = settings.gameOptions.elements['mode'].value;
    var board_dimension = settings.gameOptions.elements['board_dimension'].value;
    postAjax('http://localhost:4567/api/new-game', { board_dimension: board_dimension, mode: mode}, function(data) {
      var board = JSON.parse(data);
      Game.init(board);
      window.location.hash = '#game';
    });
  }

  me.init = function() {
    setupBindings();
  }

  me.setVisible = function() {
    removeClass(settings.page, 'invisible');
  }

  me.setInvisible = function() {
    addClass(settings.page, 'invisible');
  }

  return me;
}());
