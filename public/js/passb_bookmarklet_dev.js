/* @file passb.js */

/*
javascript:(function(){var jsCode = document.createElement('script');jsCode.setAttribute('src', 'http://localhost:3333/public/js/passb_bookmarklet_dev.js');document.head.appendChild(jsCode);}());


*/

(function () {

  window.location.href = 'http://localhost:3333/preview?url='+window.location.href;

})();