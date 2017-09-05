var Visibility = (function() {
  var me = {};

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

  me.setVisible = function(element) {
    removeClass(element, 'invisible');
  }

  me.setInvisible = function(element) {
    addClass(element, 'invisible');
  }

  return me;
}());
