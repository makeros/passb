/* @file passb.js */

/*

javascript:(function(){var jsCode = document.createElement('script');jsCode.setAttribute('src', 'http://passb.herokuapp.com/public/js/passb_bookmarklet.js');document.head.appendChild(jsCode);}());
*/

(function () {

  window.location.href = 'http://passb.herokuapp.com/preview?url='+window.location.href;

})();